import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";
import PrimaryButton from "../../components/button/PrimaryButton";
import StepBar from "../../components/StepBar";
import Label from "../../components/Label";
import QuizResult from "../../components/QuizResult";
import SurveyResult from "../../components/SurveyResult";

export default (props) => {
  const [type, setType] = useState(props.route.params.type); // quiz || survey

  const BackRoomHandler = () => {
    props.navigation.goBack();
    props.navigation.goBack();
  };

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

  return (
    <View style={{ flex: 1, backgroundColor: color.base2 }}>
      <View style={theme.container}>
        <StepBar
          options={[
            { title: "ATTEMPTING", finished: true },
            { title: "RESULT", finished: true },
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
            {type === "quiz"
              ? props.route.params.jsonData.quizTitle
              : undefined}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Label text={type === "quiz" ? "Quiz" : "Survey"} />
            {type === "quiz" ? (
              <Label
                text={
                  props.route.params.jsonData.questionLength === 1
                    ? "1 Question"
                    : `${props.route.params.jsonData.questionLength} Questions`
                }
              />
            ) : null}
          </View>
        </View>
        {type === "quiz" ? (
          <QuizResult
            quizTitle={props.route.params.jsonData.quizTitle}
            questionLength={props.route.params.jsonData.questionLength}
            fullScore={props.route.params.jsonData.questionLength}
            minScore={props.route.params.jsonData.minScore}
            meanScore={props.route.params.jsonData.averageScore}
            maxScore={props.route.params.jsonData.maxScore}
            createDate={props.route.params.jsonData.createDate}
          />
        ) : (
          <SurveyResult
          surveyTitle={props.route.params.jsonData.surveyTitle}
          createDate={props.route.params.jsonData.createDate}
          choices={props.route.params.jsonData.choices}
          />
        )}
      </View>
      <View style={theme.tabBarContainer}>
        <View style={theme.tabBar}>
          <PrimaryButton
            backgroundColor={color.primary}
            title={"Back to Room"}
            onPress={BackRoomHandler}
          />
        </View>
      </View>
    </View>
  );
};
