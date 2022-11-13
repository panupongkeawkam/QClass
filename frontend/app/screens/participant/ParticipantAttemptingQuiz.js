import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  Animated,
  Easing,
} from "react-native";
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
  const [timeoutObject, setTimeoutObject] = useState(null);
  const timer = props.route.params.quiz.questions[questionIndex].timer;

  const widthAnim = useRef(new Animated.Value(1)).current;

  const width = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const startTimer = () => {
    Animated.timing(widthAnim, {
      toValue: 0,
      duration: timer * 1000,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
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

    if (questionIndex === questions.length - 1 || questions.length === 1) {
      setButtonLabel("Submit");
      setButtonColor(color.correct);
    }

    if (timer) {
      startTimer();
      var timeoutObjectVar = setTimeout(() => {
        pressHandler();
      }, timer * 1000);
      setTimeoutObject(timeoutObjectVar)
    }
  }, []);

  const submit = async () => {
    var quizAvailable = await checkQuizAvailable();
    if (quizAvailable) {
      await pointSummarize();
    }
    const myScore = await axios.get(
      `http://${config.ip}:3000/quiz/${props.route.params.quiz.quizId}/participant/${props.route.params.participantId}/score`
    );
    props.navigation.navigate("ParticipantQuizResult", {
      quiz: props.route.params.quiz,
      myScore: myScore.data.myScore[0],
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

  const checkQuizAvailable = async () => {
    var quizResponse = await axios.get(
      `http://${config.ip}:3000/room/${props.route.params.roomId}/quiz`
    );
    return quizResponse.data.quiz.length;
  };

  const next = async () => {
    var quizAvailable = await checkQuizAvailable();
    if (quizAvailable) {
      await pointSummarize();
      props.navigation.dispatch(
        StackActions.replace("ParticipantAttemptingQuiz", {
          quiz: props.route.params.quiz,
          questionIndex: questionIndex + 1,
          participantId: props.route.params.participantId,
          roomId: props.route.params.roomId,
        })
      );
      return;
    }
    submit();
  };

  const pressHandler = () => {
    clearTimeout(timeoutObject);
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
            paddingVertical: 8,
            flexDirection: "row",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: color.content3,
            }}
          >
            {`${questionIndex + 1} of ${questions.length}`}
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[{ marginVertical: 8, paddingHorizontal: 4 }]}
        >
          <View style={{ paddingBottom: 200, ...theme.blurShadow }}>
            <View
              style={{
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingHorizontal: 24,
                paddingTop: 16,
                paddingBottom: 12,
                borderBottomWidth: 1,
                backgroundColor: color.base1,
                borderColor: color.base2,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                display: timer ? "flex" : "none",
              }}
            >
              <View
                style={{
                  width: "10%",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="stopwatch-outline"
                  size={20}
                  color={color.wrong}
                />
              </View>
              <View
                style={{
                  height: 8,
                  width: "90%",
                  borderRadius: 8,
                  backgroundColor: color.base2,
                }}
              >
                <Animated.View
                  style={{
                    width: width,
                    height: "100%",
                    borderRadius: 8,
                    backgroundColor: color.wrong,
                  }}
                />
              </View>
            </View>
            <View
              style={[
                {
                  borderTopLeftRadius: timer ? 0 : 24,
                  borderTopRightRadius: timer ? 0 : 24,
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
