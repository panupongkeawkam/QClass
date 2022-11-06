import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { color, theme } from "../assets/theme/Theme";
import Label from "./Label";

export default (props) => {
  return (
    <TouchableOpacity
      style={theme.boxOuter}
      onPress={() => {
        props.onCheck();
      }}
    >
      <View
        style={[
          theme.boxInner,
          theme.blurShadow,
          {
            backgroundColor: props.isChecked ? color.correct : color.base1,
            justifyContent: "space-between",
          },
        ]}
      >
        <View style={{ width: "100%", flexDirection: "row" }}>
          <View style={{ width: "75%" }}>
            <Text
              style={[
                theme.textHeader2,
                {
                  color: props.isChecked
                    ? color.base2
                    : theme.textHeader2.color,
                },
              ]}
            >
              {props.title}
            </Text>
            <Text
              style={{
                color: props.isChecked ? color.base2 : color.content4,
                fontSize: 12,
                marginBottom: 16,
              }}
            >
              {props.createDatetime}
            </Text>
          </View>
          <View style={{ width: "25%", alignItems: "flex-end" }}>
            <Ionicons
              name={props.isChecked ? "radio-button-on" : "radio-button-off"}
              size={24}
              color={props.isChecked ? color.base2 : color.base3}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
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
