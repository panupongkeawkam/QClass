import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { color, theme } from "../assets/theme/Theme";

export default (props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (props.isReadOnly) {
          props.onSetCorrect(props.title);
        }
      }}
      activeOpacity={props.isReadOnly ? 0.2 : 1}
      style={[
        props.isReadOnly ? {} : theme.blurShadow,
        {
          flexDirection: "row",
          backgroundColor: props.isCorrect
            ? color.correct
            : props.isReadOnly
            ? color.base2
            : color.base1,
          paddingHorizontal: 4,
          paddingVertical: props.isReadOnly ? 16 : 24,
          borderRadius: 24,
          marginVertical: 8,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={props.isCorrect === undefined ? 0 : 0.2}
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "16%",
          opacity: props.isCorrect === undefined ? 0 : 1,
        }}
        onPress={() => {
          props.onSetCorrect(props.title);
        }}
      >
        <Ionicons
          name={props.isCorrect ? "radio-button-on" : "radio-button-off"}
          size={24}
          color={props.isCorrect ? color.base2 : color.base3}
        />
      </TouchableOpacity>
      {props.isReadOnly ? (
        <Text
          style={{
            width: "68%",
            fontSize: 20,
            color: props.isCorrect ? color.base1 : color.content1,
          }}
        >
          {props.title}
        </Text>
      ) : (
        <TextInput
          placeholder="Choice title"
          placeholderTextColor={color.base3}
          maxLength={60}
          value={props.title}
          onChangeText={(text) => {
            props.onTitleChange(text);
          }}
          style={{
            width: "68%",
            borderBottomWidth: 1,
            borderColor: props.isCorrect ? color.base2 : color.base3,
            fontSize: 20,
            color: props.isCorrect ? color.base1 : color.content1,
          }}
        />
      )}
      <TouchableOpacity
        style={{
          display: props.isDeletable ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          width: "16%",
        }}
        onPress={() => {
          props.onDelete(props.index);
        }}
      >
        <Ionicons
          name="close"
          size={24}
          color={props.isCorrect ? color.base2 : color.content4}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
