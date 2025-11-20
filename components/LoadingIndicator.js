import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { UI_CONFIG } from '../config';

const LoadingIndicator = () => {
  // Create animated values for the dots
  const dot1Anim = new Animated.Value(0);
  const dot2Anim = new Animated.Value(0);
  const dot3Anim = new Animated.Value(0);

  // Animation sequence for the dots
  const animateDots = () => {
    const sequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(dot1Anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(dot1Anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(dot1Anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(300),
    ]);

    sequence.start(() => {
      // Loop the animation
      animateDots();
    });
  };

  // Start the animation when component mounts
  React.useEffect(() => {
    animateDots();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>AI is thinking</Text>
        <View style={styles.dots}>
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dot1Anim,
                transform: [
                  {
                    scale: dot1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dot2Anim,
                transform: [
                  {
                    scale: dot2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dot3Anim,
                transform: [
                  {
                    scale: dot3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginVertical: 5,
    alignSelf: 'flex-start',
  },
  bubble: {
    backgroundColor: UI_CONFIG.COLORS.AI_MESSAGE,
    padding: 12,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT_PRIMARY,
    marginRight: 8,
  },
  dots: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: UI_CONFIG.COLORS.TEXT_SECONDARY,
    marginHorizontal: 2,
  },
});

export default LoadingIndicator;