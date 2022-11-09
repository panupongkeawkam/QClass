import React, { useState, useRef, useEffect } from "react";
import { Text, View, Image } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";
import StepBar from "../../components/StepBar";
import PrimaryButton from "../../components/button/PrimaryButton";
import Label from "../../components/Label";

export default (props) => {
  // score data of participant xx
  console.log("Participant Score : ", props.route.params.myScore)
  
  const myAttemptingTime = props.route.params.myAttemptingTime
  const myPoint = props.route.params.myScore.point
  const fullScore = props.route.params.quiz.questionLength
  const [chartImageUrl, setChartImageUrl] = useState(null);
  const generateChartUri = (score, radialColor) => {
    const options = {
      type: "radialGauge",
      data: {
        datasets: [{ data: [Math.round(score)], backgroundColor: radialColor }],
      },
      options: {
        animation: {
          animateRotate: true,
          animateScale: true,
        },
        centerPercentage: 80,
        rotation: -Math.PI / 2,
        trackColor: color.base2,
        domain: [0, fullScore],
        roundedCorners: true,
        centerArea: {
          displayText: true,
          fontColor: null,
          fontSize: 128,
          padding: 0,
          backgroundImage: null,
          backgroundColor: null,
          text: null,
        },
      },
    };

    return `https://quickchart.io/chart?&c=${JSON.stringify(options)}`;
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

    setChartImageUrl(generateChartUri(myPoint, color.correct));
  });

  const backHomeHandler = () => {
    props.navigation.goBack();
    props.navigation.goBack();
    // props.navigation.navigate("ParticipantRoomQuiz", { data: data })
  };

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
            {props.route.params.quiz.title}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Label text={"Quiz"} />
            <Label text={`${props.route.params.quiz.questionLength} questions`} />
          </View>
        </View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={[theme.blurShadow, { marginVertical: 8, width: "100%" }]}
          >
            <View
              style={[
                {
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  paddingHorizontal: 24,
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  backgroundColor: color.base1,
                  borderColor: color.base2,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Image
                source={{ uri: chartImageUrl }}
                style={{
                  width: "100%",
                  height: 240,
                  marginBottom: 32,
                  resizeMode: "contain",
                }}
              />
              <Text
                style={[
                  { fontSize: 20, fontWeight: "500", color: color.content4 },
                ]}
              >
                {myPoint} of {fullScore}
              </Text>
            </View>
            <View
              style={[
                {
                  borderBottomLeftRadius: 24,
                  borderBottomRightRadius: 24,
                  paddingHorizontal: 24,
                  paddingVertical: 16,
                  backgroundColor: color.base1,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: color.correct,
                }}
              >
                GOOD
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={theme.tabBarContainer}>
        <View style={theme.tabBar}>
          <PrimaryButton title={"Back to Room"} onPress={backHomeHandler} />
        </View>
      </View>
    </View>
  );
};
