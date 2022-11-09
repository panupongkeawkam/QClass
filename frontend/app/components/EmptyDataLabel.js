import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../assets/theme/Theme";

export default ({ title, description, isSmall = false }) => {
  return (
    <View
      style={{
        flex: 1,
        height: isSmall ? 180 : 640,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: isSmall ? 60 : 120,
          height: isSmall ? 60 : 120,
          borderRadius: 9999,
          backgroundColor: `${color.base3}33`,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Ionicons
          name="file-tray-outline"
          color={color.base3}
          size={isSmall ? 24 : 48}
        />
      </View>
      <Text
        style={{
          fontSize: isSmall ? 16 : 24,
          fontWeight: "500",
          color: color.base4,
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: isSmall ? 12 : 16,
          maxWidth: "60%",
          textAlign: "center",
          fontWeight: "300",
          color: color.base4,
        }}
      >
        {description}
      </Text>
    </View>
  );
};
