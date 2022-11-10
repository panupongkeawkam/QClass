import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../assets/theme/Theme";
import Question from "../components/Question";
import PrimaryButton from "../components/button/PrimaryButton";
import EditQuizModal from "../components/modals/EditQuizModal";
import EmptyDataLabel from "../components/EmptyDataLabel";
import HeaderButton from "../components/button/HeaderButton";
import Label from "../components/Label";

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
                Alert.alert(
                  "",
                  "Are you sure to delete this quiz (warning: this action cannot be change back)",
                  [
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
                  ]
                );
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
      <View style={[theme.container]}>
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
            {showQuizTitle === null ? quizTitle : showQuizTitle}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Label text={"Quiz"} />
            <Label
              text={
                questions.length <= 1
                  ? `${questions.length === 0 ? "No" : "1"} Question`
                  : `${questions.length} Questions`
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
              onSelect={() => {
                selectHandler(item, index);
              }}
            />
          )}
          keyExtractor={(question, index) => index}
          ListEmptyComponent={() => <EmptyDataLabel title={"No Question"} />}
          ListFooterComponent={() => (
            <View style={{ marginBottom: 200 }}></View>
          )}
        />
      </View>
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
