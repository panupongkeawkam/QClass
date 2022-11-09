import React, { useState, useRef, useEffect } from "react";
import { Text, View, ScrollView, TextInput } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { StackActions } from "@react-navigation/native";

import { theme, color } from "../../assets/theme/Theme";
import PrimaryButton from "../../components/button/PrimaryButton";
import StepBar from "../../components/StepBar";
import Choice from "../../components/Choice";
import axios from "axios";
import config from "../../assets/api-config";

export default (props) => {
  const [quizTitle, setQuizTitle] = useState(props.route.params.quiz.title);
  const [questions, setQuestions] = useState(props.route.params.quiz.questions);
  const [questionIndex, setQuestionIndex] = useState(
    props.route.params.questionIndex
  );
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(-1);
  const [textAnswer, setTextAnswer] = useState("");
  const [buttonLabel, setButtonLabel] = useState(
    <Ionicons name={"arrow-forward"} size={32} color={color.base1} />
  );
  const [buttonColor, setButtonColor] = useState(
    questions.length === 1 ? color.correct : color.primary
  );

  useEffect(() => {
    props.navigation.setOptions({
      title: null,
      gestureEnabled: false,
      headerShown: false,
      headerLeft: () => {
        return <></>;
      },
    });

    if (questionIndex === questions.length - 1 || questions.length === 1) {
      setButtonLabel("Submit");
      setButtonColor(color.correct);
    }
  });

  const submit = async () => {
    await pointSummarize();
    props.navigation.navigate("ParticipantQuizResult", {
      quiz: props.route.params.quiz,
      participantId: props.route.params.participantId,
    });
  };

  const pointSummarize = async () => {
    await axios.put(
      `http://${config.ip}:3000/quiz/${props.route.params.quiz.quizId}/score`,
      {
        participantId: props.route.params.participantId,
        point:
          questions[questionIndex].type === "choice"
            ? questions[questionIndex].correct === selectedChoiceIndex
            : questions[questionIndex].correct === textAnswer,
      }
    );
  };

  const next = async () => {
    await pointSummarize();
    props.navigation.dispatch(
      StackActions.replace("ParticipantAttemptingQuiz", {
        quiz: props.route.params.quiz,
        questionIndex: questionIndex + 1,
        participantId: props.route.params.participantId,
      })
    );
  };

  const pressHandler = () => {
    if (questionIndex === questions.length - 1) {
      submit();
    } else {
      next();
    }
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
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text
            style={{ fontSize: 16, fontWeight: "600", color: color.content4 }}
          >
            {`${questionIndex + 1} of ${questions.length}`}
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[theme.blurShadow, { marginVertical: 8 }]}
        >
          <View style={{ paddingBottom: 200 }}>
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
              <View style={{ width: "90%" }}>
                <Text style={theme.textHeader2}>
                  {questions[questionIndex].title}
                </Text>
              </View>
              <View
                style={{
                  width: "10%",
                  justifyContent: "flex-end",
                  flexDirection: "row",
                }}
              >
                <Ionicons
                  name={
                    questions[questionIndex].type === "text"
                      ? "text"
                      : "md-git-network-outline"
                  }
                  color={color.base4}
                  size={20}
                />
              </View>
            </View>
            <View
              style={[
                {
                  borderBottomLeftRadius: 24,
                  borderBottomRightRadius: 24,
                  paddingHorizontal: 24,
                  paddingVertical: 16,
                  backgroundColor: color.base1,
                },
              ]}
            >
              {questions[questionIndex].type === "choice" ? (
                questions[questionIndex].choices.map((choice, index) => {
                  return (
                    <Choice
                      key={index}
                      title={choice.title}
                      isDeletable={false}
                      isCorrect={selectedChoiceIndex === index}
                      index={index}
                      onSetCorrect={() => {
                        setSelectedChoiceIndex(
                          index === selectedChoiceIndex ? -1 : index
                        );
                      }}
                      onDelete={(index) => {}}
                      onTitleChange={(newTitle) => {}}
                      isReadOnly
                    />
                  );
                })
              ) : (
                <TextInput
                  style={theme.textInput}
                  placeholder="Answer"
                  placeholderTextColor={color.base3}
                  maxLength={60}
                  onChangeText={(text) => {
                    setTextAnswer(() => text.trim());
                  }}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={theme.tabBarContainer}>
        <View style={theme.tabBar}>
          <PrimaryButton
            backgroundColor={buttonColor}
            title={buttonLabel}
            onPress={pressHandler}
          />
        </View>
      </View>
    </View>
  );
};
