# AI Chat Mobile Application with 3D Animations

This is a mobile application that provides AI chat functionality using Qwen streaming API and ElevenLabs text-to-speech API for voice responses, featuring stunning 3D animations and visual effects.

## Features

- Real-time streaming responses from Qwen AI
- Voice output using ElevenLabs API
- Beautiful and responsive UI
- Animated loading indicators
- Modern chat interface
- **NEW: 3D animations throughout the interface**
  - Rotating 3D header with perspective effects
  - Floating animated spheres in the background
  - Animated message bubbles with 3D entrance effects
  - Rotating input area with subtle 3D transformation
  - Continuous floating and rotation animations

## Technologies Used

- React Native
- Expo
- Qwen AI API
- ElevenLabs API
- React Native TTS
- React Native Animated for 3D animations

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your API keys:
   - Get your Qwen API key from [Alibaba Cloud DashScope](https://www.alibabacloud.com/product/dashscope)
   - Get your ElevenLabs API key from [ElevenLabs](https://elevenlabs.io/)
   - Find voice IDs from ElevenLabs dashboard

3. Update the config.js file with your API keys:
   ```javascript
   // In config.js
   export const API_CONFIG = {
     QWEN: {
       API_KEY: 'your-qwen-api-key-here',
       ENDPOINT: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
       MODEL: 'qwen-max'
     },
     ELEVENLABS: {
       API_KEY: 'your-elevenlabs-api-key-here',
       ENDPOINT: 'https://api.elevenlabs.io/v1/text-to-speech',
       VOICE_ID: 'your-voice-id-here',
       DEFAULT_VOICE_SETTINGS: {
         stability: 0.75,
         similarity_boost: 0.75
       }
     }
   };
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

## Running on Different Platforms

- For iOS: `npx expo start --ios`
- For Android: `npx expo start --android`
- For Web: `npx expo start --web`

## API Configuration

### Qwen API
- Endpoint: `https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation`
- Model: `qwen-max` (or other available models)
- Streaming is enabled with `X-DashScope-SSE: enable` header

### ElevenLabs API
- Endpoint: `https://api.elevenlabs.io/v1/text-to-speech/{voice-id}`
- Requires API key in `xi-api-key` header
- Supports voice customization with stability and similarity_boost parameters

## App Structure

```
/workspace/
├── App.js              # Main application component
├── config.js           # API configuration and UI settings
├── package.json        # Dependencies and scripts
├── babel.config.js     # Babel configuration
├── app.json            # Expo configuration
├── components/         # Reusable UI components
│   ├── LoadingIndicator.js
│   └── WelcomeScreen.js
└── assets/             # App assets (icons, images)
```

## Security Considerations

For production use, make sure to:
- Store API keys securely (use environment variables or secure storage)
- Implement proper error handling
- Add input validation
- Consider using backend proxy for API calls to protect keys

## Customization

You can customize the app by modifying:
- UI colors in `config.js`
- Voice settings in `config.js`
- Component styles in each component file
- Welcome screen content in `components/WelcomeScreen.js`

## Troubleshooting

- If you encounter issues with API calls, check your API keys and network connection
- For voice issues, verify your ElevenLabs subscription and voice ID
- Make sure your device has proper permissions for audio playback
## 3D Animation Features

The application includes several 3D animation effects that enhance the user experience:

- **Rotating 3D Header**: The app header features perspective-based 3D rotation animations
- **Floating Spheres**: Animated background elements that rotate and float
- **3D Message Bubbles**: Each message slides in with 3D transformation effects
- **Interactive Input Area**: The input area has subtle 3D rotation effects
- **3D Model Visualization**: A rotating 3D cube in the header area

These animations are implemented using React Native's Animated API with perspective transforms to create the illusion of 3D space.
