import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import CircularProgress from "react-native-circular-progress-indicator";

import { theme, color } from "../assets/theme/Theme";
import Label from "./Label";

export default ({
  fullScore,
  totalResponse,
  maxScore,
  meanScore,
  minScore,
  questionLength,
  quizTitle,
  createDate,
  myScore = null,
}) => {
  const options = [
    { value: minScore, color: color.wrong, title: "Min" },
    { value: meanScore, color: color.warning, title: "Mean" },
    { value: maxScore, color: color.correct, title: "Max" },
  ];

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
            {quizTitle}
          </Text>
          <Text style={{ color: color.base4, fontSize: 10, marginBottom: 16 }}>
            {createDate}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Label text={"Quiz"} />
            <Label
              text={
                questionLength === 1
                  ? "1 Question"
                  : `${questionLength} Questions`
              }
            />
            <Label text={fullScore + " Point"} />
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Label text={totalResponse + " Response"} hasMarginTop />
          </View>
        </View>
      </View>
      <View
        style={[
          {
            borderBottomLeftRadius: myScore !== null ? 0 : 24,
            borderBottomRightRadius: myScore !== null ? 0 : 24,
            paddingHorizontal: 24,
            paddingVertical: 16,
            backgroundColor: color.base1,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            paddingVertical: 12,
          }}
        >
          {options.map((option, index) => (
            <View key={index}>
              <CircularProgress
                value={option.value}
                radius={32}
                duration={typeof option.value === "number" ? 500 : 0}
                progressValueColor={color.base4}
                maxValue={fullScore}
                activeStrokeWidth={8}
                inActiveStrokeWidth={12}
                activeStrokeColor={option.color}
                inActiveStrokeColor={color.base2}
                progressValueFontSize={20}
                progressValueStyle={{ fontWeight: "600" }}
                progressFormatter={(value) => {
                  "worklet";
                  return typeof value === "number"
                    ? value.toFixed(index === 1 ? 1 : 0)
                    : "-";
                }}
              />
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 12,
                  fontWeight: "600",
                  color: color.content4,
                }}
              >
                {option.title}
              </Text>
            </View>
          ))}
        </View>
      </View>
      {myScore !== null ? (
        <View
          style={[
            {
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderTopWidth: 1,
              backgroundColor: color.base1,
              borderColor: color.base2,
              flexDirection: "row",
              justifyContent: "center",
            },
          ]}
        >
          <View
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: color.primaryTransparent,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                fontWeight: "300",
                color: color.primary,
                justifyContent: "center",
              }}
            >
              Your score is{" "}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: color.primary,
                }}
              >
                {myScore}
              </Text>
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};
