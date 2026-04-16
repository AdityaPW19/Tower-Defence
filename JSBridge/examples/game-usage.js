// examples/game-usage.js
import GameBridge from '../src/index.js';

// 1. Initialize the game when the window loads
window.onload = async () => {
    try {
        console.log("Initializing Game Bridge...");
        // This will send INIT_GAME and wait for the response with user/config
        const config = await GameBridge.init();
        console.log("Game Initialized with config:", config);
        
        startGame(config);

    } catch (error) {
        console.error("Failed to initialize game:", error);
    }
};

async function startGame(config) {
    // 2. Get the first batch of questions
    try {
        const data = await GameBridge.getQuestions(5);
        console.log("Received questions:", data.questions);
        
        // Render your game logic here...
        // ...
        
        // 3. User answers a question
        // Assume user answered the first question correctly in 10 seconds
        const firstQuestion = data.questions[0];
        await GameBridge.submitAnswer(firstQuestion.uuid, true, 10);
        console.log("Answer submitted!");

        // 4. Level Complete
        // GameBridge.levelComplete(score, stars);

    } catch (error) {
        console.error("Error in game flow:", error);
    }
}
