import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { theme, color } from "../../assets/theme/Theme";
import CheckableQuiz from "../../components/CheckableQuiz";
import PrimaryButton from "../../components/button/PrimaryButton";

export default (props) => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(-1);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const fetchQuiz = async () => {
    let values = await AsyncStorage.getItem("quizzes");
    if (values) {
      setQuizzes(JSON.parse(values));
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

  const checkHandler = async (quiz, index) => {
    console.log("Check Quiz Index: " + selectedQuizIndex);
    setSelectedQuizIndex(index === selectedQuizIndex ? -1 : index);
    setSelectedQuiz(index === selectedQuizIndex ? null : quiz);
  };

  const startHandler = () => {
    setSelectedQuiz(null);
    setSelectedQuizIndex(-1);
    props.onStart({
      type: "quiz",
      quiz: selectedQuiz,
      quizIndex: selectedQuizIndex,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.base2 }}>
      <View style={theme.container}>
        <ScrollView>
          <View style={[theme.boxContainer]}>
            {quizzes.map((quiz, index) => (
              <CheckableQuiz
                key={index}
                title={quiz.title}
                questionLength={quiz.questions.length}
                createDatetime={"22 October 2565"}
                isChecked={selectedQuizIndex === index}
                onCheck={() => {
                  checkHandler(quiz, index);
                }}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={theme.tabBarContainer}>
        <View style={theme.tabBar}>
          <PrimaryButton
            // disable={!props.route.params.quiz || !props.route.params.survey}
            title={"Start Quiz"}
            onPress={startHandler}
          />
        </View>
      </View>
    </View>
  );
};
