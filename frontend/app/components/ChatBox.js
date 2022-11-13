import React from "react";
import { View, Text } from "react-native";

import { theme, color } from "../assets/theme/Theme";

export default ({ dateTime, message, style, alignRight = false }) => {
  return (
    <View
      style={[
        style,
        {
          width: "100%", // 100%,
          justifyContent: "flex-start",
          alignItems: alignRight ? "flex-end" : "flex-start",
        },
      ]}
    >
      <View
        style={[
          theme.chatBox,
          theme.blurShadow,
          {
            borderTopLeftRadius: alignRight ? 24 : 4,
            borderTopRightRadius: alignRight ? 4 : 24,
            marginRight: 0,
            alignItems: alignRight ? "flex-end" : "flex-start",
          },
        ]}
      >
        <Text style={{ marginBottom: 4, color: color.base4, fontSize: 12 }}>{dateTime}</Text>
        <Text style={{ fontSize: 18, fontWeight: "400" }}>{message}</Text>
      </View>
    </View>
  );
};
