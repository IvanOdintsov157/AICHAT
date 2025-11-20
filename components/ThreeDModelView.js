import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const ThreeDModelView = ({ size = 100, color = '#6a5acd', style }) => {
  // Animation values for 3D rotation
  const rotationX = useRef(new Animated.Value(0)).current;
  const rotationY = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Start continuous rotation animation
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
        Animated.timing(float, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Create a 3D-like cube using multiple views
  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [
            { perspective: 1000 },
            {
              rotateX: rotationX.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              }),
            },
            {
              rotateY: rotationY.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              }),
            },
            {
              translateY: float.interpolate({
                inputRange: [0, 1],
                outputRange: [-10, 10],
              }),
            },
          ],
        },
        style,
      ]}
    >
      {/* Front face */}
      <View style={[styles.face, styles.frontFace, { backgroundColor: color }]} />
      {/* Top face */}
      <View style={[styles.face, styles.topFace, { backgroundColor: color }]} />
      {/* Side face */}
      <View style={[styles.face, styles.sideFace, { backgroundColor: color }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  face: {
    position: 'absolute',
    borderRadius: 8,
  },
  frontFace: {
    width: '80%',
    height: '80%',
    top: '10%',
    left: '10%',
    opacity: 0.8,
  },
  topFace: {
    width: '80%',
    height: '20%',
    top: '5%',
    left: '10%',
    transform: [{ skewY: '-15deg' }],
    opacity: 0.6,
  },
  sideFace: {
    width: '20%',
    height: '80%',
    top: '10%',
    right: '5%',
    transform: [{ skewX: '-15deg' }],
    opacity: 0.6,
  },
});

export default ThreeDModelView;