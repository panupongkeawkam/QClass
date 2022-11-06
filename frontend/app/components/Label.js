import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../assets/theme/Theme";

export default ({ style = {}, text }) => {
  return (
    <View
      style={{
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 24,
        marginRight: 8,
        backgroundColor: color.base2,
        ...style,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          color: color.base4,
        }}
      >
        {text}
      </Text>
    </View>
  );
};
