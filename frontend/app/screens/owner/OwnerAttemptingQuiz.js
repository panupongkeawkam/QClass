import React, { useState, useRef, useEffect } from "react";
import { Text, View, ScrollView, Alert, FlatList } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import axios from "axios";

import { theme, color } from "../../assets/theme/Theme";
import PrimaryButton from "../../components/button/PrimaryButton";
import Label from "../../components/Label";
import Question from "../../components/Question";
import StepBar from "../../components/StepBar";
import AttemptTitle from "../../components/AttemptTitle";

import config from "../../assets/api-config";

import { formatDateForResult } from "../../controller/QuizController";

export default (props) => {
  const roomId = props.route.params.room.roomId;
  const quizTitle = props.route.params.quiz.title;
  const questionLength = props.route.params.quiz.questionLength;
  const questions = props.route.params.quiz.questions;
  const quizId = props.route.params.quiz.quizId;
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    props.navigation.setOptions({
      title: null,
      gestureEnabled: false,
      headerShown: false,
      headerLeft: () => {
        return <></>;
      },
    });

    for (var i = 0; i < 1200; i++) {
      setTimeout(() => {
        setTimer(timer + 1);
      }, 1000);
    }
  });

  const formatTime = (time) => {
    var minutes = (parseInt(time / 60) + 100).toString().slice(1);
    var seconds = ((time % 60) + 100).toString().slice(1);
    return `${minutes}:${seconds}`;
  };

  const endAttemptHandler = () => {
    Alert.alert("", "Are you sure to end this quiz now?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "End",
        style: "destructive",
        onPress: async () => {
          await axios.put(
            `http://${config.ip}:3000/quiz/${props.route.params.quiz.quizId}`,
            {
              quiz: {
                state: "ended",
              },
            }
          );

          // result statement
          var scores = await axios.get(
            `http://${config.ip}:3000/quiz/${quizId}/score`
          );
          var totalResponseVar = scores.data.length;
          var allScoresVar = scores.data.map((score) => score.point);
          var maxScoreVar = Math.max(...allScoresVar);
          var minScoreVar = Math.min(...allScoresVar);
          var averageScoreVar =
            allScoresVar.reduce((prev, current) => prev + current, 0) /
            allScoresVar.length;
          var jsonData = {
            totalResponse: totalResponseVar,
            allScore: allScoresVar,
            maxScore: maxScoreVar,
            minScore: minScoreVar,
            averageScore: averageScoreVar,
            quizTitle: quizTitle,
            questionLength: questionLength,
            fullScore: questionLength,
            type: "quiz",
            quizId: quizId,
          };

          var resultResponse = await axios.post(
            `http://${config.ip}:3000/room/${roomId}/result`,
            {
              jsonData: jsonData,
            }
          );

          props.navigation.navigate("OwnerAttemptResult", {
            type: "quiz",
            jsonData: resultResponse.data,
            timeSpent: formatTime(timer),
          });
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
        <AttemptTitle
          themeColor={color.primary}
          title={quizTitle}
          labels={[
            "Quiz",
            questionLength === 1 ? "1 Question" : `${questionLength} Questions`,
          ]}
          timer={formatTime(timer)}
        />
        <FlatList
          style={{ paddingHorizontal: 4, borderRadius: 24 }}
          showsVerticalScrollIndicator={false}
          data={questions}
          key={"questions"}
          renderItem={({ item, index }) => (
            <Question
              title={item.title}
              type={item.type}
              choices={item.choices}
              correct={item.correct}
              timer={item.timer}
              untouchable
              onSelect={() => {}}
            />
          )}
          keyExtractor={(question) => question.questionId}
          ListFooterComponent={() => (
            <View style={{ marginBottom: 200 }}></View>
          )}
        />
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
