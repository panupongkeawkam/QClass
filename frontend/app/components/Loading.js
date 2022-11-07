import React from "react";
import { View, ActivityIndicator, Dimensions } from "react-native";
import { Portal } from "@gorhom/portal";

import { theme, color } from "../assets/theme/Theme";

export default ({ active = false }) => {
  return (
    <Portal>
      <View
        style={{
          display: active ? "flex" : "none",
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: color.blackTransparent,
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={color.content3} />
      </View>
    </Portal>
  );
};
