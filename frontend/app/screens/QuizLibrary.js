import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import Constants from "expo-constants";

import { theme, color } from "../assets/theme/Theme";
import Quiz from "../components/Quiz";
import CreateQuizModal from "../components/modals/CreateQuizModal";
import EmptyDataLabel from "../components/EmptyDataLabel";
import HeaderButton from "../components/button/HeaderButton";

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
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          style={{ marginRight: 12 }}
          title={"Quiz"}
          iconName={"add"}
          onPress={() => {
            setCreateQuizModalVisible(true);
          }}
        />
      ),
    });

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

  const renderQuizzes = ({ item, index }) => {
    return (
      <Quiz
        title={item.title}
        questionLength={item.questions.length}
        onSelect={() => {
          selectQuizHandler(item, index);
        }}
      />
    );
  };

  return (
    <View style={theme.container}>
      <View style={{ width: "100%" }}>
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
        <FlatList
          showsVerticalScrollIndicator={false}
          data={quizzes}
          initialNumToRender={4}
          key={"quizzes"}
          numColumns={2}
          renderItem={renderQuizzes}
          keyExtractor={(quiz, index) => index}
          ListEmptyComponent={() => (
            <EmptyDataLabel
              title={"No Quiz in Library"}
              description={
                "Use create quiz button on the top right of this page"
              }
            />
          )}
          ListFooterComponent={() => (
            <View style={{ marginBottom: 200 }}></View>
          )}
        />
      </View>
    </View>
  );
};
