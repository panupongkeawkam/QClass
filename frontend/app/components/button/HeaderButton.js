import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";

export default ({ onPress, title, iconName, iconSize = 20, style = {} }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginLeft: 16,
        backgroundColor: "#eee",
        borderRadius: "50%",
        width: title ? "auto" : 32,
        height: 32,
        paddingHorizontal: title ? 12 : 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        ...theme.centered,
        ...theme.blurShadow,
        ...style,
      }}
    >
      <Ionicons name={iconName} size={iconSize} color={color.base4} />
      {!title || (
        <Text
          style={{
            marginLeft: 4,
            fontSize: 16,
            fontWeight: "bold",
            color: "grey",
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
