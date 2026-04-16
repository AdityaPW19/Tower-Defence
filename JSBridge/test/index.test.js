// test/GameBridge.test.js

// Mock setup
const mockPostMessage = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
// Mock window methods
global.window = {
  parent: {
    postMessage: mockPostMessage
  },
  postMessage: mockPostMessage,
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
  ReactNativeWebView: undefined,
};
global.document = {
  addEventListener: jest.fn(),
};

describe('GameBridge', () => {
    let messageCallback;

    beforeEach(async () => {
        jest.clearAllMocks();
        // Do NOT resetModules() here globally if we depend on loadBridge
    });

    const loadBridge = async (isRN = false) => {
        // Redefine window globally before import
        global.window.parent.postMessage = mockPostMessage;
        
        // Mock addEventListener for this isolation
         mockAddEventListener.mockReset();
         mockAddEventListener.mockImplementation((event, cb) => {
            if (event === 'message') {
                messageCallback = cb;
            }
        });
        global.window.addEventListener = mockAddEventListener;

        let bridge;
        
        // Isolate dependencies so we get a FRESH execution of src/index.js
        jest.isolateModules(() => {
            if (isRN) {
                 global.window.ReactNativeWebView = { postMessage: jest.fn() };
            } else {
                 delete global.window.ReactNativeWebView;
            }

            const module = require('../src/index.js');
            bridge = module.default || module;
        });

        return bridge;
    };


    test('initializes and sends requests to parent window (Web)', async () => {
        const bridge = await loadBridge(false); // Web mode

        // Test init()
        const initPromise = bridge.init();
        
        // Expect postMessage to be called (Web mode uses window.parent.postMessage)
        expect(mockPostMessage).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'IGNITE_GAME_EVENT',
                action: 'INIT_GAME'
            }),
            '*'
        );

        // Simulate response from Client
        // We need to get the requestId sent
        const sentMessage = mockPostMessage.mock.calls[0][0];
        const requestId = sentMessage.requestId;

        const responseData = {
            type: 'IGNITE_CLIENT_RESPONSE',
            action: 'INIT_GAME_RESPONSE', // Action doesn't strictly matter for request resolution, but good for validity
            requestId: requestId,
            payload: { user: 'Test User' }
        };

        // Trigger the listener
        expect(messageCallback).toBeDefined();
        
        messageCallback({ data: responseData });

        await expect(initPromise).resolves.toEqual({ user: 'Test User' });
    });

    test('supports ReactNativeWebView environment', async () => {
        const bridge = await loadBridge(true); // RN Mode
        const mockRNPostMessage = global.window.ReactNativeWebView.postMessage; // Get the mock created inside loadBridge
        
        bridge._sendEvent('TEST_ACTION', { foo: 'bar' });

        expect(mockRNPostMessage).toHaveBeenCalled();
        const sentString = mockRNPostMessage.mock.calls[0][0];
        const sentMessage = JSON.parse(sentString);
        
        expect(sentMessage.type).toEqual('IGNITE_GAME_EVENT');
        expect(sentMessage.action).toEqual('TEST_ACTION');
    });

    test('handles request timeout', async () => {
        jest.useFakeTimers();
        const bridge = await loadBridge(false);
        
        const promise = bridge.getQuestions();
        
        // Fast-forward time
        jest.advanceTimersByTime(11000);
        
        await expect(promise).rejects.toThrow('Request timeout');
        jest.useRealTimers();
    });

    test('handles event listeners (on/off)', async () => {
        const bridge = await loadBridge(false);
        const callback = jest.fn();
        
        bridge.on('CUSTOM_EVENT', callback);
        
        // Trigger event from client
        const eventData = {
            type: 'IGNITE_CLIENT_EVENT',
            action: 'CUSTOM_EVENT',
            payload: { value: 123 }
        };
        
        expect(messageCallback).toBeDefined();
        messageCallback({ data: eventData });
        
        expect(callback).toHaveBeenCalledWith({ value: 123 });
    });
});
