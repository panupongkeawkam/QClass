import React, { useState, useRef } from "react";
import { View, Image, Animated } from "react-native";
import { theme, color } from "../assets/theme/Theme";

export default ({ onLoaded }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const runAnimation = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 10,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  setTimeout(runAnimation, 800);

  return (
    <Animated.View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: color.primary,
        opacity: opacity,
        transform: [{ scale: scale }],
      }}
    >
      <Image
        source={require("../assets/q-class-logo-invert.png")}
        style={{ width: 100, height: 100, resizeMode: "contain" }}
      />
    </Animated.View>
  );
};
