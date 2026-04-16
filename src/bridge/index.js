// src/index.js
import { generateUUID } from './utils.js';

class GameBridge {
  constructor() {
    this.pendingRequests = new Map();
    this.eventListeners = new Map();
    // Detect environment
    this.isReactNative = !!window.ReactNativeWebView;
    
    // Bind methods to ensure 'this' context
    this._handleMessage = this._handleMessage.bind(this);
    
    // Initialize listener
    this._setupMessageListener();
  }

  /**
   * Internal method to post message to the parent (Client App)
   */
  _postMessage(type, action, payload = {}, requestId = null) {
    const message = {
      type,
      action,
      payload,
      requestId: requestId || generateUUID()
    };
  
    // console.log(`[GameBridge] Sending:`, message);

    if (this.isReactNative) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    } else {
      window.parent.postMessage(message, '*');
    }

    return message.requestId;
  }

  /**
   * Send a request and wait for a response (Promise-based)
   */
  _sendRequest(action, payload = {}) {
    return new Promise((resolve, reject) => {
      // Generate ID *before* sending so we can store the promise
      const requestId = generateUUID();
      this.pendingRequests.set(requestId, { resolve, reject });
      
      // Perform send
      this._postMessage('IGNITE_GAME_EVENT', action, payload, requestId);
      
      // Optional: Timeout to clean up pending request
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error(`Request timeout for action: ${action}`));
        }
      }, 10000); // 10s timeout
    });
  }

  /**
   * Emit a one-way event (Fire and Forget)
   */
  _sendEvent(action, payload = {}) {
    this._postMessage('IGNITE_GAME_EVENT', action, payload);
  }

  /**
   * Setup global message listener
   */
  _setupMessageListener() {
    window.addEventListener('message', this._handleMessage);
    // Also listen to document events just in case (some android webviews trigger document events instead of window)
    document.addEventListener('message', this._handleMessage); 
  }

  _handleMessage(event) {
      let data = event.data;
      
      // Parse string data (common in RN WebView)
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
            // Ignore non-JSON messages
            return;
        }
      }

      // console.log(`[GameBridge] Received:`, data);

      // Validate message type - must be a response or event from Client
      if (!data || (data.type !== 'IGNITE_CLIENT_RESPONSE' && data.type !== 'IGNITE_CLIENT_EVENT')) {
        return;
      }

      const { action, payload, requestId, error } = data;

      // 1. Handle Request-Response pairing (Client responding to our request)
      if (requestId && this.pendingRequests.has(requestId)) {
        const { resolve, reject } = this.pendingRequests.get(requestId);
        
        if (error) {
            reject(new Error(error));
        } else {
            resolve(payload);
        }
        
        this.pendingRequests.delete(requestId);
        return;
      }

      // 2. Handle Events (Client pushing data to us)
      // Check for specific listeners
      if (this.eventListeners.has(action)) {
        this.eventListeners.get(action).forEach(callback => callback(payload));
      }
  }

  // =================================================================
  // Public API
  // =================================================================

  /**
   * Register a callback for a specific action/event
   */
  on(action, callback) {
    if (!this.eventListeners.has(action)) {
      this.eventListeners.set(action, []);
    }
    this.eventListeners.get(action).push(callback);
  }

  /**
   * Remove a callback
   */
  off(action, callback) {
    if (!this.eventListeners.has(action)) return;
    const listeners = this.eventListeners.get(action);
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Initialize the game.
   * Sends INIT_GAME and waits for configuration.
   * @returns {Promise<Object>} The config object
   */
  init() {
    return this._sendRequest('INIT_GAME', {});
  }

  /**
   * Get a batch of questions.
   * @param {number} limit Number of questions to fetch
   * @returns {Promise<Object>} { questions: [], remainingCount: number }
   */
  getQuestions(limit = 10) {
    return this._sendRequest('GET_QUESTION_BATCH', { limit });
  }

  /**
   * Submit an answer for a question.
   * @param {string} questionUuid
   * @param {boolean} isCorrect
   * @param {number} timeTaken (in seconds)
   * @returns {Promise<any>}
   */
  submitAnswer(questionUuid, isCorrect, timeTaken) {
    // This is often fire-and-forget, but we return a promise in case the client wants to ACK
    return this._sendRequest('SUBMIT_ANSWER', { questionUuid, isCorrect, timeTaken });
  }

  /**
   * Notify that the level is complete.
   * @param {number} score
   * @param {number} stars
   * @returns {void}
   */
  levelComplete(score, stars) {
    this._sendEvent('LEVEL_COMPLETE', { score, stars });
  }
}

// Export singleton instance
const gameBridge = new GameBridge();
export default gameBridge;

// Also attach to window for non-module usage
window.GameBridge = gameBridge;
