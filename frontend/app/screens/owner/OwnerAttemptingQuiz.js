import React, { useState, useRef, useEffect } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";
import PrimaryButton from "../../components/button/PrimaryButton";
import Label from "../../components/Label";
import Question from "../../components/Question";
import StepBar from "../../components/StepBar";

export default (props) => {
  console.log("OwnerAttemptingQuiz say: ", props.route.params.data);
  const [questions, setQuestions] = useState([
    {
      title: "กากาำส",
      correct: "1",
      timer: 5,
      choices: [
        {
          title: "มแทก",
        },
        {
          title: "ากาก",
        },
      ],
      type: "choice",
    },
    {
      title: "why",
      correct: "2",
      timer: 0,
      choices: [
        {
          title: "b",
          index: 0,
        },
        {
          title: "m",
          index: 1,
        },
        {
          title: "nn",
          index: 2,
        },
        {
          title: "nnn",
          index: 3,
        },
        {
          title: "b vbv",
          index: 4,
        },
      ],
      type: "choice",
    },
    {
      title: "bdbd",
      correct: "4",
      timer: null,
      choices: [
        {
          title: "o",
          index: 0,
        },
        {
          title: "p",
          index: 1,
        },
        {
          title: "k",
          index: 2,
        },
        {
          title: "l",
          index: 3,
        },
        {
          title: "u",
          index: 4,
        },
        {
          title: "n",
          index: 5,
        },
      ],
      type: "choice",
    },
  ]);

  useEffect(() => {
    props.navigation.setOptions({
      title: null,
      gestureEnabled: false,
      headerShown: false,
      headerLeft: () => {
        return <></>;
      },
    });
  });

  const endAttemptHandler = () => {
    Alert.alert(`End "${"HID Week 7"}" Quiz?`, "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "End",
        style: "destructive",
        onPress: () => {
          props.navigation.navigate("OwnerQuizResult", {});
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.base2 }}>
      <View style={[theme.container]}>
        <StepBar
          options={[
            { title: "ATTEMPTING", finished: true },
            { title: "RESULT", finished: false },
          ]}
        />
        <View
          style={[
            theme.rounded,
            theme.blurShadow,
            {
              paddingBottom: 24,
              marginBottom: 8,
              backgroundColor: color.primary,
            },
          ]}
        >
          <Text style={[theme.textHeader1, { color: color.base1 }]}>
            HID Week 7
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Label text={"Quiz"} />
            <Label text={"10 Questions"} />
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {questions.map((question, index) => {
            return (
              <View
                style={{
                  paddingBottom: index === questions.length - 1 ? 200 : 0,
                }}
                key={index}
              >
                <Question
                  title={question.title}
                  type={question.type}
                  choices={question.choices}
                  correct={question.correct}
                  timer={question.timer}
                  untouchable
                  onSelect={() => {}}
                />
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View style={theme.tabBarContainer}>
        <View style={theme.tabBar}>
          <PrimaryButton
            backgroundColor={color.wrong}
            title={"End Attempt"}
            onPress={endAttemptHandler}
          />
        </View>
      </View>
    </View>
  );
};
