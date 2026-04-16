// examples/bridge-connector.js

/**
 * This script acts as the GLUE between the generic GameBridge
 * and your specific Game Logic (GameManager).
 */

// 1. Import the bridge (or use window.GameBridge if using script tags)
// import GameBridge from 'qbank-js-bridge'; 
const Bridge = window.GameBridge; 

// 2. Assume you have a GameManager in your game
const GameManager = window.GameManager || {
    startLevel: (config) => console.log("Starting level with", config),
    pause: () => console.log("Game Paused"),
    resume: () => console.log("Game Resumed"),
    onQuestionsLoaded: (questions) => console.log("Questions loaded", questions)
};

const BridgeConnector = {
    
    // Call this when the game assets are loaded
    async connect() {
        try {
            console.log("Connecting to Client App...");
            
            // A. Handshake
            const config = await Bridge.init();
            
            // B. Pass config to your Game Manager
            GameManager.startLevel(config);
            
            // C. Fetch first batch of content
            this.fetchQuestions();

        } catch (err) {
            console.error("Connection failed", err);
            // Handle offline mode or error state here
        }
    },

    async fetchQuestions() {
        const data = await Bridge.getQuestions(5);
        // Pass data to your internal game logic
        GameManager.onQuestionsLoaded(data.questions);
    },

    // Called by YOUR Game Manager when player answers
    onPlayerAnswered(questionId, isCorrect, time) {
        Bridge.submitAnswer(questionId, isCorrect, time);
    },

    // Called by YOUR Game Manager when level ends
    onLevelComplete(score, stars) {
        Bridge.levelComplete(score, stars);
    }
};

// 3. Setup listeners for events coming FROM the Client
Bridge.on('PAUSE_GAME', () => GameManager.pause());
Bridge.on('RESUME_GAME', () => GameManager.resume());

// Expose connector to your game
window.BridgeConnector = BridgeConnector;
