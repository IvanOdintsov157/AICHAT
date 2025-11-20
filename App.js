import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Image,
  Animated
} from 'react-native';
import Constants from 'expo-constants';
import Tts from 'react-native-tts';
import { API_CONFIG, UI_CONFIG } from './config';
import LoadingIndicator from './components/LoadingIndicator';
import WelcomeScreen from './components/WelcomeScreen';
import ThreeDModelView from './components/ThreeDModelView';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values for 3D effects
  const rotationX = useRef(new Animated.Value(0)).current;
  const rotationY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const float = useRef(new Animated.Value(0)).current;
  
  // Initialize animations
  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Rotation animation
    startRotationAnimation();
    
    // Initialize TTS
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);
    Tts.setIgnoreSilentSwitch('ignore');
  }, []);
  
  const startRotationAnimation = () => {
    // Continuous rotation animation
    Animated.loop(
      Animated.parallel([
        Animated.timing(rotationX, {
          toValue: 360,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(rotationY, {
          toValue: 360,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Function to send message to Qwen API with streaming
  const sendMessageToQwen = async (userMessage) => {
    setIsLoading(true);
    
    try {
      // Add user message to chat
      const updatedMessages = [...messages, { id: Date.now(), text: userMessage, sender: 'user' }];
      setMessages(updatedMessages);
      
      // Prepare request to Qwen API
      const response = await fetch(API_CONFIG.QWEN.ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.QWEN.API_KEY}`,
          'Content-Type': 'application/json',
          'X-DashScope-SSE': 'enable' // Enable streaming
        },
        body: JSON.stringify({
          model: API_CONFIG.QWEN.MODEL,
          input: {
            messages: updatedMessages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            }))
          },
          parameters: {
            stream: true,
            result_format: 'message'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Process streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';
      let assistantMessageId = Date.now() + 1;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.output && data.output.choices && data.output.choices[0].delta.content) {
                const content = data.output.choices[0].delta.content;
                assistantResponse += content;
                
                // Update the assistant message in real-time
                setMessages(prev => {
                  const newMessages = [...prev];
                  const assistantIndex = newMessages.findIndex(msg => msg.id === assistantMessageId);
                  
                  if (assistantIndex !== -1) {
                    newMessages[assistantIndex] = { 
                      ...newMessages[assistantIndex], 
                      text: assistantResponse 
                    };
                  } else {
                    newMessages.push({ 
                      id: assistantMessageId, 
                      text: assistantResponse, 
                      sender: 'ai' 
                    });
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              // Skip malformed JSON lines
              continue;
            }
          }
        }
      }

      // If no assistant message was added yet, add it now
      if (!messages.some(msg => msg.id === assistantMessageId)) {
        setMessages(prev => [
          ...prev, 
          { id: assistantMessageId, text: assistantResponse, sender: 'ai' }
        ]);
      }

      // Convert AI response to speech using ElevenLabs
      if (assistantResponse.trim()) {
        convertTextToSpeech(assistantResponse);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please check your API keys and connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to convert text to speech using ElevenLabs API
  const convertTextToSpeech = async (text) => {
    try {
      const response = await fetch(`${API_CONFIG.ELEVENLABS.ENDPOINT}/${API_CONFIG.ELEVENLABS.VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': API_CONFIG.ELEVENLABS.API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: text,
          voice_settings: API_CONFIG.ELEVENLABS.DEFAULT_VOICE_SETTINGS
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get audio URL and play it
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Play audio using TTS as fallback
      Tts.speak(text);
    } catch (error) {
      console.error('Error converting text to speech:', error);
      // Fallback to device TTS
      Tts.speak(text);
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    sendMessageToQwen(inputText);
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSendMessage();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6a5acd" />
      
      {/* Animated 3D Background Elements */}
      <View style={StyleSheet.absoluteFill}>
        {[...Array(5)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.backgroundSphere,
              {
                top: `${10 + i * 15}%`,
                left: `${i * 20}%`,
                transform: [
                  { 
                    rotate: float.interpolate({
                      inputRange: [0, 1],
                      outputRange: [`${i * 30}deg`, `${i * 30 + 360}deg`]
                    })
                  },
                  {
                    scale: float.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.5, 0.8, 0.5]
                    })
                  }
                ]
              }
            ]}
          />
        ))}
      </View>
      
      {/* Animated 3D Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            transform: [
              { perspective: 1000 },
              { rotateX: rotationX.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg']
              })},
              { rotateY: rotationY.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg']
              })},
              { scale: scale },
              { translateY: float.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10]
              })}
            ]
          }
        ]}
      >
        <Text style={styles.headerTitle}>AI Chat with Qwen & ElevenLabs</Text>
        <Text style={styles.headerSubtitle}>Powered by Qwen AI & ElevenLabs TTS</Text>
        
        {/* Animated floating sphere */}
        <Animated.View 
          style={[
            styles.floatingSphere,
            {
              transform: [
                { translateX: float.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 20]
                })},
                { translateY: float.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 10]
                })},
                { scale: float.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.8, 1.2, 0.8]
                })}
              ]
            }
          ]}
        />
        
        {/* 3D Model Visualization */}
        <ThreeDModelView size={50} color="#ffffff" style={styles.threeDModel} />
      </Animated.View>

      {/* Chat messages container */}
      <ScrollView 
        style={styles.chatContainer}
        ref={scrollView => this.scrollView = scrollView}
        onContentSizeChange={() => {
          // Auto-scroll to bottom
          if (this.scrollView) {
            this.scrollView.scrollToEnd({ animated: true });
          }
        }}
      >
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          messages.map((message, index) => {
            // Create animation for each message
            const messageAnimation = useRef(new Animated.Value(0)).current;
            
            useEffect(() => {
              // Animate new messages with a delay based on index
              const animationTimer = setTimeout(() => {
                Animated.spring(messageAnimation, {
                  toValue: 1,
                  tension: 50,
                  friction: 7,
                  useNativeDriver: true,
                }).start();
              }, index * 100); // Stagger animation for each message
                
              return () => clearTimeout(animationTimer);
            }, [message.id]);
            
            const animatedStyle = {
              transform: [
                {
                  translateX: messageAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [message.sender === 'user' ? 100 : -100, 0],
                  }),
                },
                {
                  scale: messageAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.8, 1.1, 1],
                  }),
                },
              ],
              opacity: messageAnimation,
            };
            
            return (
              <Animated.View 
                key={message.id} 
                style={[
                  styles.messageContainer, 
                  message.sender === 'user' ? styles.userMessage : styles.aiMessage,
                  animatedStyle
                ]}
              >
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.messageSender}>
                  {message.sender === 'user' ? 'You' : 'AI Assistant'}
                </Text>
              </Animated.View>
            );
          })
        )}
        
        {isLoading && <LoadingIndicator />}
      </ScrollView>

      {/* Input area */}
      <Animated.View 
        style={[
          styles.inputContainer,
          {
            transform: [
              {
                rotateX: rotationX.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '10deg']
                })
              },
              {
                translateY: float.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 5]
                })
              }
            ]
          }
        ]}
      >
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          placeholderTextColor="#aaa"
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity 
          style={[styles.sendButton, { opacity: inputText.trim() === '' ? 0.5 : 1 }]}
          onPress={handleSendMessage}
          disabled={inputText.trim() === ''}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  header: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    padding: 15,
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    zIndex: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e0ff',
    textAlign: 'center',
    zIndex: 1,
  },
  floatingSphere: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: 10,
    right: 20,
    zIndex: 0,
  },
  backgroundSphere: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(106, 90, 205, 0.1)',
    zIndex: -1,
  },
  threeDModel: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 2,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },

  messageContainer: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 15,
    maxWidth: '80%',
    position: 'relative',
  },
  userMessage: {
    backgroundColor: UI_CONFIG.COLORS.USER_MESSAGE,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  aiMessage: {
    backgroundColor: UI_CONFIG.COLORS.AI_MESSAGE,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: UI_CONFIG.COLORS.TEXT_PRIMARY,
  },
  messageSender: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT_SECONDARY,
  },
  loadingContainer: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: UI_CONFIG.COLORS.AI_MESSAGE,
    alignSelf: 'flex-start',
    borderRadius: 15,
    maxWidth: '80%',
  },
  loadingText: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 12,
    marginRight: 10,
    maxHeight: 100,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});