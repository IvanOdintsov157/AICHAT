// API Configuration
export const API_CONFIG = {
  QWEN: {
    API_KEY: process.env.QWEN_API_KEY || 'YOUR_QWEN_API_KEY',
    ENDPOINT: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    MODEL: 'qwen-max'
  },
  ELEVENLABS: {
    API_KEY: process.env.ELEVENLABS_API_KEY || 'YOUR_ELEVENLABS_API_KEY',
    ENDPOINT: 'https://api.elevenlabs.io/v1/text-to-speech',
    VOICE_ID: process.env.ELEVENLABS_VOICE_ID || 'YOUR_VOICE_ID',
    DEFAULT_VOICE_SETTINGS: {
      stability: 0.75,
      similarity_boost: 0.75
    }
  }
};

// Default UI Settings
export const UI_CONFIG = {
  COLORS: {
    PRIMARY: '#6a5acd',
    PRIMARY_DARK: '#5a4eb8',
    SECONDARY: '#4ecdc4',
    USER_MESSAGE: '#6a5acd',
    AI_MESSAGE: '#e9ecef',
    BACKGROUND: '#f5f5f5',
    TEXT_PRIMARY: '#333',
    TEXT_SECONDARY: '#666',
    TEXT_LIGHT: '#aaa'
  },
  FONTS: {
    REGULAR: 'System',
    BOLD: 'System',
    MEDIUM: 'System'
  }
};