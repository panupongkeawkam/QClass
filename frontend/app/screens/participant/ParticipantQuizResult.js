import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";
import StepBar from "../../components/StepBar";
import PrimaryButton from "../../components/button/PrimaryButton";
import AttemptTitle from "../../components/AttemptTitle";

export default (props) => {
  const myPoint = props.route.params.myScore.point;
  const fullScore = props.route.params.quiz.questionLength;
  const [rate, setRate] = useState(null);
  const rateColor = {
    EXCELLENT: color.correct,
    GOOD: color.warning,
    MODERATE: color.base4,
    BAD: color.wrong,
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
              <View style={{ paddingVertical: 24 }}>
                <CircularProgress
                  value={myPoint}
                  radius={80}
                  duration={1000}
                  title={" of " + fullScore}
                  titleColor={color.base4}
                  titleStyle={{ fontWeight: "600" }}
                  progressValueColor={color.base4}
                  maxValue={fullScore}
                  activeStrokeWidth={16}
                  inActiveStrokeWidth={24}
                  activeStrokeColor={rateColor[rate]}
                  inActiveStrokeColor={color.base2}
                  progressValueFontSize={60}
                  progressValueStyle={{ fontWeight: "600" }}
                />
              </View>
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
