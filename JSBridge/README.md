# Game JS Bridge

A lightweight, modular, plug-and-play JavaScript bridge for connecting HTML5 games with client applications (React Native & Web).

This bridge abstracts the complexity of `postMessage` communication, providing a simple Promise-based API for game developers.

## Features

- 🔌 **Plug & Play**: Works in both React Native WebViews and standard Web Iframes.
- ⚡ **Promise-based API**: Async methods like `init()` and `getQuestions()` wait for a response from the Client.
- 🛡️ **Type Safe**: Automatically handles JSON serialization and parsing.
- 📡 **Event System**: Listen for custom events from the Client app.
- ✅ **Tested**: Includes unit tests for critical functionality.

## Installation

### Option A: NPM (Recommended for Bundlers)
If you are building your game with Webpack, Vite, Parcel, etc.:

```bash
npm install qbank-js-bridge
```

Then import it in your game:

```javascript
import GameBridge from 'qbank-js-bridge';
```

### Option B: Script Tag (For Vanilla JS Games)
Download `dist/index.umd.js` and include it in your HTML file:

```html
<script src="js/index.umd.js"></script>
<script>
  // GameBridge is available globally
  GameBridge.init().then(config => {
      console.log("Game Initialized!", config);
  });
</script>
```

---

## API Reference

### 1. Initialize
Must be called first. Tells the Client that the game has loaded and requests user/game config.

```javascript
const config = await GameBridge.init();
console.log(`User: ${config.user.name}, Level: ${config.config.level}`);
```

### 2. Get Questions
Fetch a batch of questions from the Client.

```javascript
try {
  const data = await GameBridge.getQuestions(10); // Request 10 questions
  const questions = data.questions;
  console.log(`Received ${questions.length} questions.`);
} catch (error) {
  console.error("Failed to load questions:", error);
}
```

### 3. Submit Answer
Report a user's answer. Returns a Promise (optional to await).

```javascript
// GameBridge.submitAnswer(questionUuid, isCorrect, timeTakenInSeconds)
await GameBridge.submitAnswer('uuid-123', true, 15);
```

### 4. Level Complete
Notify the Client that the level is finished.

```javascript
// GameBridge.levelComplete(score, stars)
GameBridge.levelComplete(1500, 3);
```

### 5. Listen to Custom Events
Listen for any other events sent by the Client.

```javascript
GameBridge.on('PAUSE_GAME', () => {
    myGame.pause();
});

GameBridge.on('RESUME_GAME', () => {
    myGame.resume();
});
```

---

## Architecture: The Bridge Connector Pattern (Recommended)

To keep your game logic clean, we recommend creating a `BridgeConnector` script. This acts as the "glue" between the `GameBridge` library and your game's `GameManager`.

Your game code calls the Connector, which calls the Bridge. This way, your game doesn't need to know about messages or promises directly.

**Example `bridge-connector.js`:**
```javascript
const Bridge = window.GameBridge;

const BridgeConnector = {
    async connect(gameManager) {
        // 1. Handshake
        const config = await Bridge.init();
        
        // 2. Start Game Logic
        gameManager.startLevel(config);
        
        // 3. Listen for external events
        Bridge.on('PAUSE_GAME', () => gameManager.pause());
        Bridge.on('RESUME_GAME', () => gameManager.resume());
    },

    async fetchQuestions(count) {
        const data = await Bridge.getQuestions(count);
        return data.questions;
    },

    reportAnswer(uuid, isCorrect, time) {
        Bridge.submitAnswer(uuid, isCorrect, time);
    },
    
    levelComplete(score, stars) {
        Bridge.levelComplete(score, stars);
    }
};

window.BridgeConnector = BridgeConnector;
```

**Usage in Game:**
```javascript
// Inside your game's main script
BridgeConnector.connect(MyGameManager);
```

See `examples/bridge-connector.js` for a full implementation.

---

## Development

### Setup
Clone the repo and install dependencies:

```bash
npm install
```

### Build
Generate the production files in `dist/`:

```bash
npm run build
```

### Test
Run the unit test suite (using Jest):

```bash
npm test
```

## Protocol Details
The bridge communicates using the following JSON format via `window.postMessage`:

**Request (Game -> Client):**
```json
{
  "type": "IGNITE_GAME_EVENT",
  "action": "ACTION_NAME",
  "requestId": "uuid-v4",
  "payload": { ... }
}
```

**Response (Client -> Game):**
```json
{
  "type": "IGNITE_CLIENT_RESPONSE",
  "requestId": "uuid-v4", // Matches request
  "payload": { ... }
}
```
