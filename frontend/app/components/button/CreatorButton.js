import React from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { theme, color } from "../../assets/theme/Theme";

export default (props) => {
  return (
    <TouchableOpacity
      style={[theme.boxOuter, { width: "100%", height: 120 }]}
      onPress={() => {
        props.onCreate();
      }}
    >
      <View style={[theme.boxInner, theme.boxHollow, theme.centered]}>
        <Ionicons name="add" size="36" color={color.base4} />
        <Text style={[{ color: color.base4, fontWeight: "600" }]}>
          {props.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
