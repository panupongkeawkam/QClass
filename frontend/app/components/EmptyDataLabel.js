import React from "react";
import { View, Text } from "react-native";

import { theme, color } from "../assets/theme/Theme";

export default ({ title, isSmall = false }) => {
  return (
    <View
      style={{
        flex: 1,
        height: isSmall ? 180 : 640,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={[theme.textLabel, { fontSize: 20, fontWeight: "normal" }]}>
        {title}
      </Text>
    </View>
  );
};
