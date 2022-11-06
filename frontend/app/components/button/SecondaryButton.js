import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";

export default ({
  title,
  onPress,
  style,
  isWide = false,
  disabled = false,
  backgroundColor = color.primary
}) => {
  return (
    <TouchableOpacity
      style={[
        theme.btn,
        {
          width: isWide ? "100%" : "auto",
          backgroundColor: disabled ? color.base3 : backgroundColor,
          ...style,
        },
      ]}
      activeOpacity={disabled ? 1 : 0.2}
      onPress={() => {
        if (disabled) {
          return null;
        }
        onPress();
      }}
    >
      <Text style={[theme.textBtn, style]}>{title}</Text>
    </TouchableOpacity>
  );
};
