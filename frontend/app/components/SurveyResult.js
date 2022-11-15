import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../assets/theme/Theme";
import Label from "./Label";

export default ({ surveyTitle, createDate, choices, myAnswered = null }) => {
  const choicesResponse = choices.map((choice) => choice.response);
  const totalResponse = choicesResponse.reduce((a, b) => a + b, 0);

  const getChoiceTitle = (targetIndex) => {
    var choice = choices.find((choice, index) => index == targetIndex);
    return choice ? choice.title : null;
  };

  const ChoiceProgress = ({ choiceTitle, choiceResponse }) => {
    return (
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", paddingVertical: 4 }}
      >
        <View
          style={{
            width: "80%",
            padding: 4,
            fontSize: 16,
            color: color.content3,
          }}
        >
          <Text>{choiceTitle}</Text>
        </View>
        <View
          style={{
            width: "20%",
            alignItems: "flex-end",
            padding: 4,
            fontSize: 16,
            color: color.content3,
          }}
        >
          <Text>{choiceResponse}</Text>
        </View>
        <View
          style={{
            width: "100%",
            height: 16,
            borderRadius: 24,
            backgroundColor: color.base2,
            padding: 3,
          }}
        >
          <View
            style={{
              height: "100%",
              borderRadius: 24,
              minWidth: choiceResponse ? 10 : 0,
              minHeight: choiceResponse ? 10 : 0,
              width: `${Math.round((choiceResponse / totalResponse) * 100)}%`,
              backgroundColor: color.warning,
            }}
          ></View>
        </View>
      </View>
    );
  };

  return (
    <View style={[theme.blurShadow, { marginVertical: 8 }]}>
      <View
        style={[
          {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 24,
            paddingVertical: 16,
            borderBottomWidth: 1,
            backgroundColor: color.base1,
            borderColor: color.base2,
            flexDirection: "row",
          },
        ]}
      >
        <View style={{ width: "100%" }}>
          <Text style={[theme.textHeader2, { fontWeight: "normal" }]}>
            {surveyTitle}
          </Text>
          <Text style={{ color: color.base4, fontSize: 10, marginBottom: 16 }}>
            {createDate}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Label text={"Survey"} />
            <Label text={totalResponse + " Response"} />
          </View>
        </View>
      </View>
      <View
        style={[
          {
            borderBottomLeftRadius: myAnswered !== null ? 0 : 24,
            borderBottomRightRadius: myAnswered !== null ? 0 : 24,
            paddingHorizontal: 24,
            paddingVertical: 4,
            backgroundColor: color.base1,
          },
        ]}
      >
        <View
          style={{
            paddingVertical: 12,
            marginBottom: myAnswered !== null ? 0 : 12,
          }}
        >
          {choices.map((choice, index) => (
            <ChoiceProgress
              key={index}
              choiceTitle={choice.title}
              choiceResponse={choice.response}
            />
          ))}
        </View>
      </View>
      <View
        style={{
          display: myAnswered !== null ? "flex" : "none",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          paddingHorizontal: 24,
          paddingVertical: 12,
          backgroundColor: color.base1,
          flexDirection: "row",
          justifyContent: "center",
          borderTopWidth: 1,
          borderColor: color.base2,
        }}
      >
        <View
          style={{
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: color.secondaryTransparent,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              fontWeight: "300",
              color: color.secondary,
              justifyContent: "center",
            }}
          >
            Your response is{" "}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: color.secondary,
              }}
            >
              {myAnswered !== null ? getChoiceTitle(myAnswered) : ""}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};
