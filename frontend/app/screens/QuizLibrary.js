import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import Constants from "expo-constants";

import { theme, color } from "../assets/theme/Theme";
import Quiz from "../components/Quiz";
import CreatorButton from "../components/button/CreatorButton";
import CreateQuizModal from "../components/modals/CreateQuizModal";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default (props) => {
  // ข้อมูลจาก localstorage
  const [createQuizModalVisible, setCreateQuizModalVisible] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  // fetch data from async storage
  const fetchQuiz = async () => {
    let values = await AsyncStorage.getItem("quizzes");
    if (values) {
      setQuizzes(JSON.parse(values));
    } else {
      await AsyncStorage.setItem("quizzes", "[]");
    }
  };
  
  useEffect(() => {
    props.navigation.addListener("focus", () => {
      setTimeout(async () => {
        await fetchQuiz();
      }, 100);
    });
  }, []);

  const selectQuizHandler = async (quiz, index) => {
    // เปิดหน้า QuestionOverview พร้อมกับดึงข้อมูลไปแสดง
    props.navigation.navigate("QuestionOverview", {
      quizTitle: quiz.title,
      questions: quiz.questions, // ข้อมูล
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.base2,
        paddingTop: Constants.statusBarHeight,
      }}
    >
      <ScrollView style={theme.container}>
        <CreateQuizModal
          visible={createQuizModalVisible}
          close={() => {
            setCreateQuizModalVisible(false);
          }}
          onCreatedQuiz={async (newQuiz) => {
            var quizzesVar = quizzes;
            quizzesVar.push(newQuiz);
            setQuizzes(quizzesVar);
            await AsyncStorage.setItem("quizzes", JSON.stringify(quizzesVar));
          }}
        />
        <View style={[theme.boxContainer]}>
          <CreatorButton
            title="Create Quiz"
            onCreate={() => {
              setCreateQuizModalVisible(true);
            }}
          />
          {quizzes.map((quiz, index) => (
            // สร้าง quiz component
            <Quiz
              key={index}
              title={quiz.title}
              questionLength={quiz.questions.length}
              onSelect={() => {
                selectQuizHandler(quiz, index);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
