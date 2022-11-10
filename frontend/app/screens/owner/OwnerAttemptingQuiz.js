import React, { useState, useRef, useEffect } from "react";
import { Text, View, ScrollView, Alert, FlatList } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import axios from "axios";

import { theme, color } from "../../assets/theme/Theme";
import PrimaryButton from "../../components/button/PrimaryButton";
import Label from "../../components/Label";
import Question from "../../components/Question";
import StepBar from "../../components/StepBar";

import config from "../../assets/api-config";

import { formatDateForResult } from "../../controller/QuizController";

export default (props) => {
  const roomId = props.route.params.room.roomId;
  const quizTitle = props.route.params.quiz.title;
  const questionLength = props.route.params.quiz.questionLength;
  const questions = props.route.params.quiz.questions;
  const quizId = props.route.params.quiz.quizId;

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
          var allScoresVar = scores.data.map((score) => score.point);
          var maxScoreVar = Math.max(...allScoresVar);
          var minScoreVar = Math.min(...allScoresVar);
          var averageScoreVar =
            allScoresVar.reduce((prev, current) => prev + current, 0) /
            allScoresVar.length;
          var jsonData = {
            allScore: allScoresVar,
            maxScore: maxScoreVar,
            minScore: minScoreVar,
            averageScore: averageScoreVar,
            quizTitle: quizTitle,
            questionLength: questionLength,
            fullScore: questionLength,
            type: "quiz",
          };

          var resultResponse = await axios.post(
            `http://${config.ip}:3000/room/${roomId}/result`,
            {
              jsonData: jsonData,
            }
          );

          resultResponse.data.createDate = formatDateForResult(
            resultResponse.data.createDate
          );

          props.navigation.navigate("OwnerAttemptResult", {
            type: "quiz",
            jsonData: resultResponse.data,
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
        <View
          style={[
            theme.rounded,
            theme.blurShadow,
            {
              paddingBottom: 36,
              marginBottom: 16,
              backgroundColor: color.primary,
            },
          ]}
        >
          <Text style={[theme.textHeader2, { color: color.base1 }]}>
            {quizTitle}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Label text={"Quiz"} />
            <Label
              text={
                questionLength === 1
                  ? "1 Question"
                  : `${questionLength} Questions`
              }
            />
          </View>
        </View>
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
