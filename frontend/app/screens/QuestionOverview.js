import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../assets/theme/Theme";
import Question from "../components/Question";
import PrimaryButton from "../components/button/PrimaryButton";
import EditQuizModal from "../components/modals/EditQuizModal";
import EmptyDataLabel from "../components/EmptyDataLabel";
import HeaderButton from "../components/button/HeaderButton";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { saveNewTitle } from "../controller/QuizController";

export default (props) => {
  const [questions, setQuestions] = useState(props.route.params.questions);
  const [quizTitle, setQuizTitle] = useState(props.route.params.quizTitle);
  const [showQuizTitle, setShowQuizTitle] = useState(null);

  useEffect(() => {
    // need to refactor
    props.navigation.addListener("focus", async () => {
      let quizzes = JSON.parse(await AsyncStorage.getItem("quizzes"));
      let thisQuiz = await quizzes.find((quiz) => {
        return quiz.title === quizTitle;
      });
      setQuestions([...thisQuiz.questions]);
    });

    const deleteConfirmHandle = async () => {
      let quizzes = JSON.parse(await AsyncStorage.getItem("quizzes"));
      let targetIndex = quizzes.findIndex((quiz) => quiz.title === quizTitle);
      quizzes.splice(targetIndex, 1);
      await AsyncStorage.setItem("quizzes", JSON.stringify(quizzes));
      props.navigation.goBack();
    };

    props.navigation.setOptions({
      title: null,
      headerRight: () => {
        return (
          <View style={{ flexDirection: "row" }}>
            <EditQuizModal
              title={quizTitle}
              onEditQuiz={(newTitle) => {
                setTitle(newTitle);
              }}
            />
            <HeaderButton
              iconName={"trash-outline"}
              onPress={() => {
                Alert.alert(`Delete "${quizTitle}" Quiz?`, "", [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                      deleteConfirmHandle();
                    },
                  },
                ]);
              }}
            />
          </View>
        );
      },
    });
  }, []);

  props.navigation.addListener("beforeRemove", async () => {
    let isNewTitle = showQuizTitle !== null;
    if (isNewTitle) {
      await saveNewTitle(showQuizTitle, quizTitle);
    }
  });

  const setTitle = (newTitle) => {
    setShowQuizTitle((current) => {
      return newTitle;
    });
  };

  const selectHandler = (question, index) => {
    props.navigation.navigate("QuestionDetail", {
      quizTitle: quizTitle,
      question: question,
      questions: questions,
      questionIndex: index,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[theme.container]}>
        <Text style={theme.textHeader1}>
          {showQuizTitle === null ? quizTitle : showQuizTitle}
        </Text>
        {props.route.params.questions.length === 0 ? (
          <EmptyDataLabel title={"No Question"} />
        ) : (
          questions.map((question, index) => {
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
                  onSelect={() => {
                    selectHandler(question, index);
                  }}
                />
              </View>
            );
          })
        )}
      </ScrollView>
      <View style={theme.tabBarContainer}>
        <View style={theme.tabBar}>
          <PrimaryButton
            title={"Add Question"}
            onPress={() => {
              props.navigation.navigate("CreateQuestion", {
                questions: questions,
                quizTitle: props.route.params.quizTitle,
              });
            }}
          />
        </View>
      </View>
    </View>
  );
};
