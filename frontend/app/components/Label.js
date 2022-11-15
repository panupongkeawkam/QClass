import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../assets/theme/Theme";

export default ({ style = {}, text, colored = false, hasMarginTop = false }) => {
  return (
    <View
      style={{
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 24,
        marginRight: 8,
        marginTop: hasMarginTop ? 8 : 0,
        backgroundColor: colored ? color.primaryTransparent : color.base2,
        ...style,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "bold",
          color: colored ? color.primary : color.base4,
        }}
      >
        {text}
      </Text>
    </View>
  );
};
