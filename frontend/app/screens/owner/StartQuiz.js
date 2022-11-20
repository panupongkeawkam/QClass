import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { theme, color } from "../../assets/theme/Theme";
import CheckableQuiz from "../../components/CheckableQuiz";
import PrimaryButton from "../../components/button/PrimaryButton";
import Loading from "../../components/Loading";
import EmptyDataLabel from "../../components/EmptyDataLabel";

import * as Controller from "../../controller/QuizController";

export default (props) => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(-1);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuiz = async () => {
    let values = await AsyncStorage.getItem("quizzes");
    if (values) {
      values = JSON.parse(values).filter(
        (value) => value.questions.length !== 0
      );
      setQuizzes(values);
    } else {
      await AsyncStorage.setItem("quizzes", "[]");
    }
  };

  useEffect(() => {
    const callFetchQuiz = async () => {
      await fetchQuiz();
    };

    callFetchQuiz();
  }, []);

  const checkHandler = (quiz, index) => {
    setSelectedQuizIndex(index === selectedQuizIndex ? -1 : index);
    setSelectedQuiz(index === selectedQuizIndex ? null : quiz);
  };

  const startHandler = async () => {
    setIsLoading(true);
    const newQuiz = await Controller.startQuiz(
      selectedQuiz,
      props.route.params.room,
      props.route.params.user
    );

    props.onStart({
      type: "quiz",
      quiz: newQuiz,
      quizIndex: selectedQuizIndex,
    });

    setSelectedQuizIndex(-1);
    setSelectedQuiz(null);
    setIsLoading(false);
  };

  return (
    <>
      <Loading active={isLoading} />
      <View style={{ flex: 1, backgroundColor: color.base2 }}>
        <View style={theme.container}>
          <FlatList
            data={quizzes}
            style={{ paddingHorizontal: 4 }}
            renderItem={({ item, index }) => (
              <CheckableQuiz
                title={item.title}
                questionLength={item.questions.length}
                createDatetime={"22 October 2565"}
                isChecked={selectedQuizIndex === index}
                onCheck={() => {
                  checkHandler(item, index);
                }}
              />
            )}
            keyExtractor={(quiz, index) => index}
            key={"quizzes"}
            numColumns={2}
            ListEmptyComponent={() => <EmptyDataLabel title={"No quiz"} />}
            ListFooterComponent={() => (
              <View style={{ marginBottom: 200 }}></View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={theme.tabBarContainer}>
          <View style={theme.tabBar}>
            <PrimaryButton
              disable={selectedQuizIndex === -1}
              title={"Start Quiz"}
              onPress={startHandler}
            />
          </View>
        </View>
      </View>
    </>
  );
};
