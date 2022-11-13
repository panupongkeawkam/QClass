import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";

export default ({
  title = "",
  onPress,
  style = {},
  isWide = false,
  disabled = false,
  backgroundColor = color.primary,
  iconName = null,
}) => {
  return (
    <TouchableOpacity
      style={[
        theme.btn,
        {
          width: isWide ? "100%" : "auto",
          backgroundColor: disabled ? color.base3 : backgroundColor,
          flexDirection: "row",
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
      {iconName ? (
        <Ionicons
          name={iconName}
          size={20}
          color={disabled ? color.base4 : theme.textBtn.color}
        />
      ) : null}
      {title ? (
        <Text
          style={[
            theme.textBtn,
            style,
            {
              color: disabled
                ? color.base4
                : style.color
                ? style.color
                : theme.textBtn.color,
              marginLeft: iconName ? 4 : 0,
            },
          ]}
        >
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};
