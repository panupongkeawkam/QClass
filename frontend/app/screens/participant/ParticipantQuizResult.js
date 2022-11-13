import React, { useState, useRef, useEffect } from "react";
import { Text, View, Image } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";
import StepBar from "../../components/StepBar";
import PrimaryButton from "../../components/button/PrimaryButton";
import Label from "../../components/Label";
import AttemptTitle from "../../components/AttemptTitle";

export default (props) => {
  const myAttemptingTime = props.route.params.myAttemptingTime;
  const myPoint = props.route.params.myScore.point;
  const fullScore = props.route.params.quiz.questionLength;
  const [chartImageUrl, setChartImageUrl] = useState(null);
  const [rate, setRate] = useState(null);
  const rateColor = {
    EXCELLENT: color.correct,
    GOOD: color.warning,
    MODERATE: color.base4,
    BAD: color.wrong,
  };

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

  const timeDiff = (dateTime) => {
    var date1 = new Date(dateTime);
    var date2 = new Date();

    var diff = date2.getTime() - date1.getTime();

    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    return `${(mm + 100).toString().slice(1)}:${(ss + 100)
      .toString()
      .slice(1)}`;
  };

  const scoreRateCalculate = () => {
    var ratio = myPoint / fullScore;
    var rateVar;

    if (ratio >= 0.75) {
      rateVar = "EXCELLENT";
    } else if (ratio >= 0.5) {
      rateVar = "GOOD";
    } else if (ratio >= 0.25) {
      rateVar = "MODERATE";
    } else if (ratio >= 0) {
      rateVar = "BAD";
    }

    return rateVar;
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

    setRate(scoreRateCalculate());
    setChartImageUrl(generateChartUri(myPoint, rateColor[rate]));
  });

  const backHomeHandler = () => {
    props.navigation.goBack();
    props.navigation.goBack();
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
        <AttemptTitle
          title={props.route.params.quiz.title}
          labels={[
            "Quiz",
            `${props.route.params.quiz.questionLength} Question${
              props.route.params.quiz.questionLength === 1 ? "" : "s"
            }`,
          ]}
          timer={timeDiff(props.route.params.myScore.createDatetime)}
        />
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
                  width: "80%",
                  height: 240,
                  marginBottom: 32,
                  resizeMode: "contain",
                }}
              />
              <Text
                style={[
                  { fontSize: 16, fontWeight: "500", color: color.content4 },
                ]}
              >
                Score {myPoint} of {fullScore}
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
                  color: rateColor[rate],
                }}
              >
                {rate}
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
