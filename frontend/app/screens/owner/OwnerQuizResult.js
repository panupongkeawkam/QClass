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
    // props.navigation.navigate("OwnerRoomQuiz", { data: data })
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
              paddingBottom: 24,
              marginBottom: 8,
              backgroundColor: color.primary,
            },
          ]}
        >
          <Text style={[theme.textHeader1, { color: color.base1 }]}>
            HID Week 7
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Label text={"Quiz"} />
            <Label text={"10 Questions"} />
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
            surveyTitle={"What T-shirt colors you like?"}
            createDate={"28 October 2565 19:30"}
            choices={[
              {
                title: "Black",
                response: 37,
              },
              {
                title: "Pink",
                response: 11,
              },
              {
                title: "Yellow",
                response: 9,
              },
            ]}
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
