import React from "react";
import { View, Text } from "react-native";
import Constants from "expo-constants";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../assets/theme/Theme";

export default ({ options }) => {
  return (
    <View
      style={{
        width: "100%",
        paddingBottom: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
        paddingTop: Constants.statusBarHeight,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "20%",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Ionicons
            name={`radio-button${options[0].finished ? "-on" : "-off"}`}
            size={24}
            color={options[0].finished ? color.primary : color.base3}
          />
        </View>
        <View
          style={{
            width: "60%",
            height: 2,
            paddingHorizontal: 4,
          }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 40,
              backgroundColor: options[1].finished
                ? color.primary
                : color.base3,
            }}
          ></View>
        </View>
        <View
          style={{
            width: "20%",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Ionicons
            name={`radio-button${options[1].finished ? "-on" : "-off"}`}
            size={24}
            color={options[1].finished ? color.primary : color.base3}
          />
        </View>
        <View style={{ width: "50%", paddingLeft: 24, marginTop: 4 }}>
          <Text style={{ fontSize: 12, color: color.content4 }}>
            {options[0].title}
          </Text>
        </View>
        <View
          style={{
            width: "50%",
            alignItems: "flex-end",
            paddingRight: 36,
            marginTop: 4,
          }}
        >
          <Text style={{ fontSize: 12, color: color.content4 }}>
            {options[1].title}
          </Text>
        </View>
      </View>
    </View>
  );
};
