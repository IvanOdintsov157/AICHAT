import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { UI_CONFIG } from '../config';

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>🤖</Text>
        </View>
      </View>
      <Text style={styles.title}>Welcome to AI Chat</Text>
      <Text style={styles.subtitle}>Powered by Qwen AI & ElevenLabs TTS</Text>
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>💬</Text>
          <Text style={styles.featureText}>Real-time streaming responses</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🔊</Text>
          <Text style={styles.featureText}>Voice responses with ElevenLabs</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🧠</Text>
          <Text style={styles.featureText}>Powered by Qwen AI technology</Text>
        </View>
      </View>
      <Text style={styles.instruction}>Type your message below to start chatting!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.PRIMARY,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  instruction: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default WelcomeScreen;