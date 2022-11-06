import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
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

import { createQuestion } from "../controller/QuizController";

export default (props) => {
  const [questionTitle, setQuestionTitle] = useState("");
  // const [questionTimeLimit, setQuestionTimeLimit] = useState(null);
  const [questionType, setQuestionType] = useState("choice");
  const [questionTextAnswer, setQuestionTextAnswer] = useState("");
  const [questionShowTimeLimit, setQuestionShowTimeLimit] = useState(
    new Date(0, 0, 0, 0, 5)
  );
  const [latestCorrect, setLatestCorrect] = useState(-1);
  const [hasTimer, setHasTimer] = useState(false);
  const [choices, setChoices] = useState([
    {
      title: "",
      isDeletable: false,
      isCorrect: false,
    },
    {
      title: "",
      isDeletable: false,
      isCorrect: false,
    },
  ]);

  const options = [
    {
      label: "Choice",
      value: "choice",
      accessibilityLabel: "switch-one",
    },
    {
      label: "Text",
      value: "text",
      accessibilityLabel: "switch-two",
    },
  ];

  useEffect(() => {
    props.navigation.setOptions({
      title: null,
    });
  }, []);

  const confirmHandler = async () => {
    var timeLimit =
      questionShowTimeLimit.getHours() * 60 +
      questionShowTimeLimit.getMinutes();
    timeLimit = !hasTimer && timeLimit === 5 ? null : timeLimit;
    var correct =
      questionType === "choice"
        ? latestCorrect === -1
          ? null
          : latestCorrect + ""
        : questionTextAnswer.trim().length <= 0
        ? null
        : questionTextAnswer.trim();
    try {
      var questionObject = {
        quizTitle: props.route.params.quizTitle,
        questionTitle: questionTitle,
        timer: timeLimit,
        correct: correct,
        choices: choices,
        type: questionType,
      };

      var newQuestion = await createQuestion(questionObject);
      var questions = props.route.params.questions;
      questions.push(newQuestion);

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
      console.log("Error: ", error);
    }
  };

  const timerPickerHandler = (event, selectedDate) => {
    setQuestionShowTimeLimit(selectedDate);
  };

  const deleteHandler = (index) => {
    var newChoices = choices;
    if (newChoices[index].isCorrect) {
      setLatestCorrect(-1);
    }
    newChoices.splice(index, 1);
    setChoices([...newChoices]);
  };

  const setCorrectHandler = (index) => {
    var newChoices = choices;
    if (choices[index].title.trim().length > 0) {
      if (latestCorrect === -1) {
        setLatestCorrect(index);
        newChoices[index].isCorrect = true;
      } else {
        newChoices[latestCorrect].isCorrect = false;
        newChoices[index].isCorrect = true;
        setLatestCorrect(index);
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
      setLatestCorrect(-1);
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

  return (
    <View style={{ flex: 1, backgroundColor: color.base2 }}>
      <KeyboardAwareScrollView style={{ flex: 1 }} extraHeight={200}>
        <ScrollView style={[theme.container]}>
          <Text style={theme.textLabel}>TITLE</Text>
          <TextInput
            style={theme.textInput}
            maxLength={60}
            placeholder="Question title"
            placeholderTextColor={color.base3}
            onChangeText={(value) => {
              setQuestionTitle(value.trim());
            }}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CheckBox
              checked={hasTimer}
              onCheck={() => {
                setHasTimer(!hasTimer);
                setQuestionShowTimeLimit(new Date(0, 0, 0, 0, 5));
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
            value={questionShowTimeLimit}
            onChange={timerPickerHandler}
            disabled={!hasTimer}
          />
          <View style={theme.centered}>
            <SwitchSelector
              initial={0}
              options={options}
              onPress={(value) => {
                setQuestionType(() => value);
              }}
              hasPadding
              buttonMargin={2}
              buttonColor={color.primary}
              selectedTextStyle={{
                fontSize: 14,
                fontWeight: "800",
                color: color.base2,
              }}
              textStyle={{
                fontSize: 14,
                fontWeight: "800",
                color: color.content4,
              }}
              style={{ width: "50%", marginVertical: 8 }}
            />
          </View>
          <View style={{ marginBottom: 180 }}>
            {questionType === "choice" ? (
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
                      deleteHandler(index);
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
                onChangeText={(text) => {
                  setQuestionTextAnswer(() => text.trim());
                }}
              />
            )}
            {choices.length < 8 && questionType === "choice" ? (
              <AddChoiceButton onAddChoice={addChoiceHandler} />
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
