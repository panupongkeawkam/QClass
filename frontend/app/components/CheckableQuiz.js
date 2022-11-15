import React, { version } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { color, theme } from "../assets/theme/Theme";
import Label from "./Label";

export default (props) => {
  return (
    <TouchableOpacity
      style={[theme.boxOuter, theme.blurShadow, { height: 160 }]}
      onPress={() => {
        props.onCheck();
      }}
    >
      <View
        style={{
          backgroundColor: props.isChecked ? color.correct : color.base1,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "flex-end",
          }}
        >
          <Ionicons
            name={props.isChecked ? "radio-button-on" : "radio-button-off"}
            size={20}
            color={props.isChecked ? color.base2 : color.base3}
          />
        </View>
      </View>
      <View
        style={[
          {
            backgroundColor: props.isChecked ? color.correct : color.base1,
            justifyContent: "space-between",
            flex: 1,
            paddingHorizontal: 16,
            paddingBottom: 16,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          },
        ]}
      >
        <View>
          <Text
            style={[
              theme.textHeader2,
              {
                color: props.isChecked ? color.base2 : theme.textHeader2.color,
              },
            ]}
          >
            {props.title}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "space-between" }}>
          <Label
            text={
              props.questionLength === 0
                ? "No question"
                : props.questionLength === 1
                ? props.questionLength + " Question"
                : props.questionLength + " Questions"
            }
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
