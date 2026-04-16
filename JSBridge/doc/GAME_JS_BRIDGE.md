# Game JS Bridge Documentation

This document defines the communication protocol between the Client App (React/React Native wrapper) and the HTML5 Game (running in WebView/Iframe).

## 1. Overview

The **JS Bridge** allows the Game to request data (questions, user info) and report events (progress, scores) without knowing about the backend API. The Client App acts as a proxy, handling all network requests and authentication.

**Communication Method:** `window.postMessage`

## 2. Message Format

All messages sent from **Game -> Client** must follow this JSON structure:

```json
{
  "type": "IGNITE_GAME_EVENT",
  "action": "ACTION_NAME",
  "payload": {
    // ... specific data
  },
  "requestId": "unique-uuid-v4" // Optional, for request-response pairing
}
```

All messages sent from **Client -> Game** must follow this structure:

```json
{
  "type": "IGNITE_CLIENT_RESPONSE",
  "action": "ACTION_NAME_RESPONSE",
  "payload": {
    // ... response data or error
  },
  "requestId": "original-request-id" // Matches the request
}
```

## 3. Supported Actions

### A. Initialization
**Action:** `INIT_GAME`
*   **Sent by:** Game (on load)
*   **Purpose:** Tell the client the game is ready and request initial configuration (current level, user info).
*   **Payload:** `{}`
*   **Response:** `INIT_GAME_RESPONSE`
    ```json
    {
      "user": { "id": "...", "name": "..." },
      "config": { "subject": "Math", "chapter": "Algebra", "level": 1 }
    }
    ```

### B. Request Questions
**Action:** `GET_QUESTION_BATCH`
*   **Sent by:** Game
*   **Purpose:** Request the next set of questions.
*   **Payload:**
    ```json
    {
      "limit": 5 // Optional, default is 10
    }
    ```
*   **Response:** `GET_QUESTION_BATCH_RESPONSE`
    ```json
    {
      "questions": [
        {
          "uuid": "...",
          "content": { "text": "2+2?", "options": [...] },
          "meta": { "time_needed": 30 }
        }
      ],
      "remainingCount": 15
    }
    ```

### C. Report Progress (Answer Submitted)
**Action:** `SUBMIT_ANSWER`
*   **Sent by:** Game
*   **Purpose:** Report that a user answered a question (correctly or incorrectly).
*   **Payload:**
    ```json
    {
      "questionUuid": "...",
      "isCorrect": true,
      "timeTaken": 12
    }
    ```
*   **Response:** `SUBMIT_ANSWER_ACK` (Optional, usually fire-and-forget logic on client)

### D. Game Over / Level Complete
**Action:** `LEVEL_COMPLETE`
*   **Sent by:** Game
*   **Purpose:** Notify client to show the summary screen or unlock the next level.
*   **Payload:**
    ```json
    {
      "score": 100,
      "stars": 3
    }
    ```

## 4. Implementation Example (Game Side)

```javascript
// Helper to send messages
function sendToClient(action, payload) {
  const message = {
    type: 'IGNITE_GAME_EVENT',
    action,
    payload,
    requestId: generateUUID()
  };
  
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  } else {
    window.parent.postMessage(message, '*');
  }
}

// Listen for responses
window.addEventListener('message', (event) => {
  const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
  if (data.type !== 'IGNITE_CLIENT_RESPONSE') return;

  switch (data.action) {
    case 'GET_QUESTION_BATCH_RESPONSE':
      loadQuestions(data.payload.questions);
      break;
  }
});

// Start
sendToClient('INIT_GAME', {});
```
