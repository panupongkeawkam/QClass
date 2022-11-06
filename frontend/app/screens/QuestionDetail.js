import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SwitchSelector from "react-native-switch-selector";

import { theme, color } from "../assets/theme/Theme";
import PrimaryButton from "../components/button/PrimaryButton";
import Choice from "../components/Choice";
import AddChoiceButton from "../components/button/AddChoiceButton";

import { deleteQuestion, editQuestion } from "../controller/QuizController";

export default (props) => {
  const [title, setTitle] = useState(props.route.params.question.title);
  const [time, setTime] = useState(
    new Date(0, 0, 0, 0, props.route.params.question.timer)
  );
  const [type, setType] = useState(props.route.params.question.type);
  const [correct, setCorrect] = useState(props.route.params.question.correct);
  const [hasTimer, setHasTimer] = useState(
    Boolean(props.route.params.question.timer)
  );
  const [choices, setChoices] = useState(
    props.route.params.question.choices?.map((c, index) => ({
      ...c,
      isDeletable: index > 1,
      isCorrect: index === parseInt(correct),
    }))
  );
  useEffect(() => {
    props.navigation.setOptions({
      title: null,
      headerRight: () => {
        return (
          <DeleteQuizButton
            onDeleteQuiz={async () => {
              Alert.alert(`Delete "${title}" Question?`, "", [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    deleteHandler();
                  },
                },
              ]);
            }}
          />
        );
      },
    });
  }, []);

  const confirmHandler = async () => {
    var timeLimit = time.getHours() * 60 + time.getMinutes();
    timeLimit = !hasTimer && timeLimit === 5 ? null : timeLimit;
    var correctVar =
      type === "text"
        ? correct.trim().length <= 0
          ? null
          : correct.trim()
        : correct === -1
          ? null
          : correct + "";
    try {
      var questionObject = {
        quizTitle: props.route.params.quizTitle,
        questionTitle: title,
        timer: timeLimit,
        correct: correctVar,
        choices: choices,
        type: type,
      };
      var questions = await editQuestion(
        questionObject,
        props.route.params.question.title,
        props.route.params.questionIndex
      );
      props.navigation.navigate("QuestionOverview", {
        questions: questions,
        quizTitle: props.route.params.quizTitle,
      });
    } catch (error) {
      Alert.alert("Fail to create question", error.message, [
        {
          text: "Retry",
        },
      ]);
      console.log("Error : ", error);
    }
  };

  const deleteHandler = async () => {
    var questions = await deleteQuestion(
      props.route.params.questions,
      props.route.params.questionIndex,
      props.route.params.quizTitle
    );
    props.navigation.navigate("QuestionOverview", {
      questions: questions,
      quizTitle: props.route.params.quizTitle,
    });
  };

  const timerPickerHandler = (event, selectedDate) => {
    setTime(selectedDate);
  };

  const setCorrectHandler = (index) => {
    var newChoices = choices;
    if (choices[index].title.trim().length > 0) {
      if (correct === -1) {
        setCorrect(index);
        newChoices[index].isCorrect = true;
      } else {
        newChoices[correct].isCorrect = false;
        newChoices[index].isCorrect = true;
        setCorrect(index);
      }
    }
    setChoices((currentChoice) => {
      return newChoices;
    });
  };

  const titleChangeHandler = (newTitle, index) => {
    const newChoices = choices;
    newChoices[index].title = newTitle;
    if (
      newChoices[index].title.trim().length <= 0 &&
      newChoices[index].isCorrect
    ) {
      newChoices[index].isCorrect = false;
      setCorrect(-1);
    }
    setChoices([...newChoices]);
  };

  const addChoiceHandler = () => {
    var newChoices = choices;
    newChoices.push({
      title: "",
      isDeletable: true,
      isCorrect: false,
    });
    setChoices([...newChoices]);
  };

  const deleteChoiceHandler = (index) => {
    var newChoices = choices;
    if (newChoices[index].isCorrect) {
      setCorrect(-1);
    }
    newChoices.splice(index, 1);
    setChoices([...newChoices]);
  };

  const CheckBox = ({ checked, onCheck }) => {
    return (
      <TouchableOpacity
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: color.content4,
          padding: 2,
          marginBottom: 4,
        }}
        onPress={onCheck}
      >
        {checked ? (
          <View
            style={{
              flex: 1,
              backgroundColor: color.content4,
              borderRadius: 4,
            }}
          ></View>
        ) : null}
      </TouchableOpacity>
    );
  };
  const DeleteQuizButton = ({ onDeleteQuiz }) => {
    return (
      <TouchableOpacity
        onPress={onDeleteQuiz}
        style={{
          marginLeft: 16,
          backgroundColor: "#eee",
          borderRadius: "50%",
          width: 36,
          height: 36,
          ...theme.centered,
          ...theme.blurShadow,
        }}
      >
        <Ionicons name="trash-outline" size={20} color={color.base4} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.base2 }}>
      <KeyboardAwareScrollView style={{ flex: 1 }} extraHeight={200}>
        <ScrollView style={[theme.container]}>
          <Text style={theme.textLabel}>TITLE</Text>
          <TextInput
            style={theme.textInput}
            maxLength={60}
            value={title}
            placeholder="New question title"
            placeholderTextColor={color.base3}
            onChangeText={(text) => {
              setTitle(text);
            }}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CheckBox
              checked={hasTimer}
              onCheck={() => {
                setHasTimer(!hasTimer);
                setTime(new Date(0, 0, 0, 0, 5));
              }}
            />
            <Text style={[theme.textLabel, { marginLeft: 8 }]}>TIME LIMIT</Text>
          </View>
          <DateTimePicker
            style={[theme.textInput, { height: 160 }]}
            display="spinner"
            testID="dateTimePicker"
            mode={"time"}
            minuteInterval={5}
            minimumDate={new Date(0, 0, 0, 0, 5)}
            maximumDate={new Date(0, 0, 0, 5)}
            value={time}
            onChange={timerPickerHandler}
            disabled={!hasTimer}
          />
          <View style={{ marginBottom: 180 }}>
            {type === "choice" ? (
              choices.map((choice, index) => {
                return (
                  <Choice
                    key={index}
                    title={choice.title}
                    isDeletable={choice.isDeletable}
                    isCorrect={choice.isCorrect}
                    index={index}
                    onSetCorrect={() => {
                      setCorrectHandler(index);
                    }}
                    onDelete={(index) => {
                      deleteChoiceHandler(index);
                    }}
                    onTitleChange={(newTitle) => {
                      titleChangeHandler(newTitle, index);
                    }}
                  />
                );
              })
            ) : (
              <TextInput
                style={theme.textInput}
                placeholder="Answer"
                placeholderTextColor={color.base3}
                maxLength={60}
                value={correct}
                onChangeText={(text) => {
                  setCorrect(text);
                }}
              />
            )}
            {type === "text" ? null : choices.length < 8 ? (
              <AddChoiceButton
                onAddChoice={addChoiceHandler}
              />
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
      <View style={theme.tabBarContainer}>
        <View style={theme.tabBar}>
          <PrimaryButton title={"Confirm"} onPress={confirmHandler} />
        </View>
      </View>
    </View>
  );
};
