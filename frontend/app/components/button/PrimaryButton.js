import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";

export default ({
  title,
  onPress,
  backgroundColor = color.primary,
  disable = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={disable ? 1 : 0.2}
      style={[
        {
          width: "90%",
          marginHorizontal: "5%",
          height: 60,
          bottom: 0,
          backgroundColor: disable ? color.base3 : backgroundColor,
          borderRadius: 24,
        },
        theme.blurShadow,
        theme.centered,
      ]}
      onPress={() => {
        if (!disable) {
          onPress();
        }
      }}
    >
      <Text style={{ color: color.base1, fontWeight: "bold", fontSize: 20 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
