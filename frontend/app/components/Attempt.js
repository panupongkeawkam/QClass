import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../assets/theme/Theme";
import SecondaryButton from "../components/button/SecondaryButton";
import Label from "./Label";

export default (props) => {
  return (
    <View
      style={[
        theme.rounded,
        {
          marginTop: 8,
          marginBottom: 24,
          backgroundColor: color.base1,
          backgroundColor: color.primary,
        },
      ]}
    >
      <Text style={[theme.textHeader2, { color: color.base1 }]}>
        {props.attemptTitle}
      </Text>
      <View style={{ flexDirection: "row", marginBottom: 32 }}>
        <Label
          text={`${props.type?.charAt(0).toUpperCase()}${props.type?.slice(1)}`}
        />
        {props.type === "quiz" ? (
          <Label
            text={`${props.questionLength} Question${
              props.questionLength > 1 ? "s" : ""
            }`}
          />
        ) : null}
      </View>
      <SecondaryButton
        style={{ backgroundColor: color.base1, color: color.content1 }}
        title={"Attempt"}
        onPress={() => {
          props.onAttempt();
        }}
      />
    </View>
  );
};
