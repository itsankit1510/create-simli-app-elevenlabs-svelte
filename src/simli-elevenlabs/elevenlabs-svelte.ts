// elevenlabs-client.js - This would contain your Conversation class implementation
// Import it the same way as you would in the original code
import { Conversation } from './elevenlabs-client';

// Types for conversation configuration
interface ConversationConfig {
    onConnect?: (data: { conversationId: string }) => void;
    onDisconnect?: () => void;
    onError?: (message: string, details?: any) => void;
    onDebug?: (data: any) => void;
    onMessage?: (data: { source: string; message: string }) => void;
    onStatusChange?: (data: { status: string }) => void;
    onModeChange?: (data: { mode: string }) => void;
    onAudioData?: (audioData: Uint8Array) => void;
    agentId?: string;
    signedUrl?: string;
    [key: string]: any;
}

// Default handlers for the conversation
const DEFAULT_HANDLERS = {
    onConnect: () => {},
    onDisconnect: () => {},
    onError: () => {},
    onDebug: () => {},
    onMessage: () => {},
    onStatusChange: () => {},
    onModeChange: () => {},
    onAudioData: () => {}
};

/**
 * Helper function to merge objects with proper typing
 */
function mergeConfigs(...configs: Partial<ConversationConfig>[]): ConversationConfig {
    return Object.assign({}, DEFAULT_HANDLERS, ...configs);
}

/**
 * Svelte 5 service using runes to manage conversation state and audio handling
 */
export function createConversationService(defaultConfig: Partial<ConversationConfig> = {}) {
    // State managed by runes
    let $state = {
        connectionStatus: 'disconnected',
        conversationMode: 'listening'
    };
    
    // Computed values
    const $derived = {
        status: () => $state.connectionStatus,
        isSpeaking: () => $state.conversationMode === 'speaking'
    };
    
    // References to conversation instances
    let conversationInstance: unknown = null;
    let pendingConversation: unknown = null;
    
    // Clean up when component is destroyed
    // $effect.cleanup(() => {
    //     conversationInstance?.endSession();
    // });
    
    /**
     * Starts a new conversation session
     */
    async function startSession(config: Partial<ConversationConfig> = {}) {
        // Return existing conversation ID if available
        if (conversationInstance) {
            return conversationInstance;
        }
        
        // Return pending conversation ID if exists
        if (pendingConversation) {
            const conversation = await pendingConversation;
            return conversation;
        }

        try {
            // Create merged configuration with proper handlers
            const mergedConfig = mergeConfigs(
                defaultConfig,
                config,
                {
                    onModeChange: ({ mode }: { mode: string }) => {
                        $state.conversationMode = mode;
                        // Call the user's handler if provided
                        defaultConfig.onModeChange?.(({ mode }));
                        config.onModeChange?.(({ mode }));
                    },
                    onStatusChange: ({ status }: { status: string }) => {
                        $state.connectionStatus = status;
                        // Call the user's handler if provided
                        defaultConfig.onStatusChange?.(({ status }));
                        config.onStatusChange?.(({ status }));
                    },
                    onAudioData: (audioData: Uint8Array) => {
                        defaultConfig.onAudioData?.(audioData);
                        config.onAudioData?.(audioData);
                    }
                }
            );

            // Initialize new conversation
            pendingConversation = Conversation.startSession(mergedConfig);

            // Await conversation initialization
            conversationInstance = await pendingConversation;
            return conversationInstance;
            
        } finally {
            pendingConversation = null;
        }
    }

    /**
     * Ends the current conversation session
     */
    async function endSession() {
        const currentConversation = conversationInstance;
        conversationInstance = null;
        await currentConversation?.endSession();
    }

    /**
     * Sets the volume for the conversation
     */
    function setVolume({ volume }: { volume: number }) {
        if (pendingConversation) {
            pendingConversation.then(conversation => {
                conversation.setVolume({ volume });
            });
        }
        conversationInstance?.setVolume({ volume });
    }

    /**
     * Gets frequency data for audio visualization
     */
    function getInputByteFrequencyData() {
        return conversationInstance?.getInputByteFrequencyData();
    }

    function getOutputByteFrequencyData() {
        return conversationInstance?.getOutputByteFrequencyData();
    }

    /**
     * Gets volume levels for input/output
     */
    function getInputVolume() {
        return conversationInstance?.getInputVolume() ?? 0;
    }

    function getOutputVolume() {
        return conversationInstance?.getOutputVolume() ?? 0;
    }

    return {
        // Session management
        startSession,
        endSession,
        setVolume,
        
        // Audio data getters
        getInputByteFrequencyData,
        getOutputByteFrequencyData,
        getInputVolume,
        getOutputVolume,
        
        // Reactive state
        get status() { return $derived.status(); },
        get isSpeaking() { return $derived.isSpeaking(); }
    };
}