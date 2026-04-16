import { StoreBase } from './storeShim';
import { GameConfig } from '../config/gameConfig';
import { mockQuestions } from '../config/questions';
import { managers } from './managers';
import { soundManager } from './soundManager';
// @ts-ignore
import gameBridge from '../bridge/index.js';

export class QuestionManager extends StoreBase {
	questions: any[] = mockQuestions.slice();
	questionQueue: any[] = [];
	isLoadingQuestions = false;

	currentQuestion: any = null;
	isActive = false;
	timeScale = 1;

	timer = 0;
	initialTimer = 0;
	strikes = 0;
	gameTimeSinceLastQuestion = 0;
	buildPoints = 0;
	wrongAnswerTrigger = 0;

	distortedAudio = false;

	constructor() {
		super();
		this.reset();
		this.init();
	}

	async init() {
		try {
			console.log('[QuestionManager] Initializing Bridge...');
			gameBridge
				.init()
				.then((config) => {
					console.log('[QuestionManager] Bridge Config:', config);
					this.fetchQuestions();
				})
				.catch((err) => {
					console.warn('[QuestionManager] Bridge init failed (dev mode?):', err);
				});
		} catch (e) {
			console.warn('[QuestionManager] Bridge init failed, using mock mode.', e);
		}
	}

	async fetchQuestions() {
		if (this.isLoadingQuestions) return;
		this.isLoadingQuestions = true;
		this.emitChange();

		try {
			const response: any = await gameBridge.getQuestions(5).catch(() => null);
			if (response && response.questions) {
				const adapted = response.questions.map((q: any) => this.adaptBridgeQuestion(q));
				this.questionQueue.push(...adapted);
				console.log(`[QuestionManager] Fetched ${adapted.length} questions. Queue size: ${this.questionQueue.length}`);
			}
		} catch (e) {
			console.warn('[QuestionManager] Failed to fetch questions (using mocks)', e);
		} finally {
			this.isLoadingQuestions = false;
			this.emitChange();
		}
	}

	adaptBridgeQuestion(bq: any) {
		const content = bq.content || {};
		const optionsRaw = content.options || [];

		let finalOptions: any[] = [];
		let correctIndex = -1;

		if (optionsRaw.length > 0) {
			finalOptions = optionsRaw.map((o: any) => ({
				text: o.text || o.value || '',
				image: o.image || null,
				label: o.label || '',
				id: o.mysql_id
			}));

			correctIndex = optionsRaw.findIndex((o: any) => o.is_correct === true || o.isCorrect === true);

			if (correctIndex === -1 && content.answer) {
				const answerId = content.answer.mysql_id || content.answer.id;
				if (answerId) correctIndex = finalOptions.findIndex((o) => o.id === answerId);
			}

			if (correctIndex === -1) correctIndex = 0;
		}

		return {
			id: bq.uuid || bq._id || bq.id,
			question: content.text || content.question || 'Unknown Question?',
			image: content.image || null,
			hint: content.hint || null,
			hintImage: content.hint_image || null,
			options: finalOptions,
			correctIndex,
			meta: bq.meta
		};
	}

	reset() {
		this.isActive = false;
		this.timeScale = 1;
		this.strikes = 0;
		this.buildPoints = 0;
		this.gameTimeSinceLastQuestion = GameConfig.questionInterval * 0.75;
		this.currentQuestion = null;
		this.emitChange();
	}

	update(deltaTime: number) {
		if (!this.isActive) {
			this.gameTimeSinceLastQuestion += deltaTime;
			if (this.gameTimeSinceLastQuestion >= GameConfig.questionInterval) {
				this.triggerQuestion();
			}
		} else {
			const realTimePassedPerUpdate = this.timeScale === 0 ? deltaTime : deltaTime / this.timeScale;
			this.timer -= realTimePassedPerUpdate;
			if (this.timer <= 0) this.handleTimeout();
		}
		this.emitChange();
	}

	triggerQuestion() {
		let questionToUse: any = null;

		if (this.questionQueue.length > 0) {
			questionToUse = this.questionQueue.shift();
			if (this.questionQueue.length < 3) this.fetchQuestions();
		} else {
			const randomIndex = Math.floor(Math.random() * this.questions.length);
			const rawMock = this.questions[randomIndex];
			if (rawMock.options && typeof rawMock.options[0] === 'string') {
				questionToUse = { ...rawMock, options: rawMock.options.map((opt: any) => ({ text: opt, image: null })) };
			} else {
				questionToUse = rawMock;
			}
			this.fetchQuestions();
		}

		this.currentQuestion = questionToUse;

		if (this.currentQuestion && this.currentQuestion.meta && typeof this.currentQuestion.meta.time_needed === 'number') {
			this.initialTimer = this.currentQuestion.meta.time_needed * 1000;
		} else {
			this.initialTimer = GameConfig.questionDuration;
		}

		this.timer = this.initialTimer;
		this.gameTimeSinceLastQuestion = 0;

		this.isActive = true;
		this.timeScale = GameConfig.bulletTimeFactor;

		const gameLoop = managers.get('gameLoop');
		if (gameLoop) gameLoop.timeScale = this.timeScale;

		this.distortedAudio = true;
		if (soundManager.setDistortion) soundManager.setDistortion(true);

		this.emitChange();
	}

	answer(optionIndex: number) {
		if (!this.currentQuestion) return;

		const isCorrect = optionIndex === this.currentQuestion.correctIndex;
		const timeTaken = Math.max(0, (this.initialTimer - this.timer) / 1000);

		if (this.currentQuestion.id && String(this.currentQuestion.id).length > 5) {
			gameBridge.submitAnswer(this.currentQuestion.id, isCorrect, timeTaken).catch((err: any) => console.error(err));
		}

		if (isCorrect) this.handleCorrect();
		else this.handleIncorrect();

		this.closeQuestion();
		this.emitChange();
	}

	handleCorrect() {
		if (this.buildPoints >= 8) {
			const lootTracker = managers.get('lootTracker');
			if (lootTracker && typeof lootTracker.receiveLoot === 'function') {
				lootTracker.receiveLoot(10);
			}
			if (soundManager.play) soundManager.play('towerUpgrade');
		} else {
			this.buildPoints++;
			if (soundManager.play) soundManager.play('towerUpgrade');
		}
		this.emitChange();
	}

	handleIncorrect() {
		this.wrongAnswerTrigger++;
		if (soundManager.play) soundManager.play('lowResourse');
		this.strikes++;
		if (this.strikes >= GameConfig.maxStrikes) {
			this.punishPlayer();
			this.strikes = 0;
		}
		this.emitChange();
	}

	handleTimeout() {
		if (this.currentQuestion && this.currentQuestion.id && String(this.currentQuestion.id).length > 5) {
			gameBridge.submitAnswer(this.currentQuestion.id, false, GameConfig.questionDuration / 1000).catch((err: any) => console.error(err));
		}
		this.handleIncorrect();
		this.closeQuestion();
		this.emitChange();
	}

	punishPlayer() {
		const entityManager = managers.get('entityManager');
		const particleManager = managers.get('particleManager');
		if (!entityManager) return;

		const towers = entityManager.entities.filter((t: any) => t.type === 'tower');
		const builtTowers = towers.filter((t: any) => {
			const stateName = t.state?.currentState?.name;
			return stateName !== 'NotBuilt' && t.name !== 'Throne';
		});

		if (builtTowers.length > 0) {
			const victim = builtTowers[0];
			
			// Reset tower to NotBuilt state
			if (victim.state && typeof victim.state.setState === 'function') {
				victim.state.setState('NotBuilt');
			}
			victim.upgradeLevel = -1;
			victim.isInteractable = true;

			if (particleManager && typeof particleManager.spawnExplosion === 'function') {
				const x = victim.position?.x || 0;
				const y = victim.position?.y || 0;
				particleManager.spawnExplosion(x + (victim.width || 0) / 2, y + (victim.height || 0) / 2, '#ff0000', 30);
			}
		}

		this.emitChange();
	}

	closeQuestion() {
		this.isActive = false;
		this.timeScale = 1;
		const gameLoop = managers.get('gameLoop');
		if (gameLoop) gameLoop.timeScale = 1;
		this.currentQuestion = null;
		this.distortedAudio = false;
		if (soundManager.setDistortion) soundManager.setDistortion(false);
		this.emitChange();
	}

	getSnapshot() {
		return {
			isActive: this.isActive,
			currentQuestion: this.currentQuestion,
			timer: this.timer,
			initialTimer: this.initialTimer,
			strikes: this.strikes,
			buildPoints: this.buildPoints,
			isLoadingQuestions: this.isLoadingQuestions,
			questionQueueLength: this.questionQueue.length
		};
	}
}

export const questionManager = new QuestionManager();
