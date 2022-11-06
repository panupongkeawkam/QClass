import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";

export default ({ onAddChoice }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        paddingVertical: 12,
        borderRadius: 24,
        marginVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        ...theme.boxHollow,
      }}
      onPress={() => {
        onAddChoice();
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="add" size={32} color={color.base4} />
        <Text style={{ color: color.base4, fontWeight: "600", fontSize: 12 }}>
          Add Choice
        </Text>
      </View>
    </TouchableOpacity>
  );
};
