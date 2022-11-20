import React, { useState, useEffect } from "react";
import { Text, View, FlatList } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";
import PrimaryButton from "../../components/button/PrimaryButton";
import StepBar from "../../components/StepBar";
import { LargeProgress } from "./OwnerAttemptingSurvey";
import AttemptTitle from "../../components/AttemptTitle";

export default (props) => {
  const type = props.route.params.type;
  const [totalResponse, setTotalResponse] = useState(0);

  const options =
    type === "quiz"
      ? [
          {
            value: props.route.params.jsonData.minScore,
            color: color.wrong,
            title: "Min",
          },
          {
            value: props.route.params.jsonData.averageScore,
            color: color.warning,
            title: "Mean",
          },
          {
            value: props.route.params.jsonData.maxScore,
            color: color.correct,
            title: "Max",
          },
        ]
      : [];

  const BackRoomHandler = () => {
    props.navigation.goBack();
    props.navigation.goBack();
  };

  useEffect(() => {
    props.navigation.setOptions({
      title: null,
      gestureEnabled: false,
      headerShown: false,
      headerLeft: () => {
        return <></>;
      },
    });

    if (type === "survey") {
      var totalResponseVar = props.route.params.jsonData.choices.reduce(
        (total, value) => total + value.response,
        0
      );
      setTotalResponse(totalResponseVar);
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: color.base2 }}>
      <View style={theme.container}>
        <StepBar
          themeColor={type === "quiz" ? color.primary : color.secondary}
          options={[
            { title: "ATTEMPTING", finished: true },
            { title: "RESULT", finished: true },
          ]}
        />
        {type === "quiz" ? (
          <AttemptTitle
            themeColor={color.primary}
            title={props.route.params.jsonData.quizTitle}
            labels={[
              "Quiz",
              props.route.params.jsonData.questionLength === 1
                ? "1 Question"
                : `${props.route.params.jsonData.questionLength} Questions`,
            ]}
            timer={props.route.params.timeSpent}
          />
        ) : (
          <AttemptTitle
            themeColor={color.secondary}
            title={props.route.params.jsonData.surveyTitle}
            labels={[
              "Survey",
              `${props.route.params.jsonData.choices.length} Choices`,
            ]}
            timer={props.route.params.timeSpent}
          />
        )}
        {type === "quiz" ? (
          <>
            <View
              style={[
                {
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  paddingHorizontal: 24,
                  paddingTop: 24,
                  paddingBottom: 16,
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
                      maxValue={props.route.params.jsonData.fullScore}
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
            <View
              style={[
                {
                  borderBottomLeftRadius: 24,
                  borderBottomRightRadius: 24,
                  borderTopWidth: 1,
                  borderColor: color.base2,
                  paddingHorizontal: 24,
                  paddingVertical: 16,
                  backgroundColor: color.base1,
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
                  Total{" "}
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: color.primary,
                    }}
                  >
                    {props.route.params.jsonData.totalResponse}
                  </Text>{" "}
                  Attempt
                </Text>
              </View>
            </View>
          </>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={props.route.params.jsonData.choices}
            style={{ paddingHorizontal: 4 }}
            renderItem={({ item, index }) => (
              <LargeProgress
                title={item.title}
                length={item.response}
                maxLength={totalResponse}
              />
            )}
            keyExtractor={(item, index) => index}
            ListFooterComponent={() => (
              <View style={{ paddingBottom: 200 }}></View>
            )}
          />
        )}
      </View>
      <View style={theme.tabBarContainer}>
        <View style={theme.tabBar}>
          <PrimaryButton
            backgroundColor={color.content3}
            title={"Back to Room"}
            onPress={BackRoomHandler}
          />
        </View>
      </View>
    </View>
  );
};
