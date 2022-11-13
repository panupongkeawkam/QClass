import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../assets/theme/Theme";
import Label from "./Label";

export default ({ title, labels = [], timer, themeColor = color.primary }) => {
  return (
    <View>
      <View
        style={[
          theme.blurShadow,
          {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingVertical: 16,
            paddingHorizontal: 24,
            paddingBottom: 32,
            backgroundColor: themeColor,
          },
        ]}
      >
        <Text style={[theme.textHeader1, { color: color.base1 }]}>{title}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {labels.map((text, index) => (
            <Label key={index} text={text} />
          ))}
        </View>
      </View>
      <View
        style={{
          marginBottom: 20,
          borderTopWidth: 1,
          borderColor: color.base2,
          backgroundColor: themeColor,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          padding: 12,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="stopwatch" size={18} color={color.base1} />
        <Text
          style={{
            fontSize: 16,
            marginLeft: 4,
            color: color.base1,
            fontWeight: "600",
          }}
        >
          {timer}
        </Text>
      </View>
    </View>
  );
};
