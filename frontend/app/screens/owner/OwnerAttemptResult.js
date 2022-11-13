import React, { useState, useRef, useEffect } from "react";
import { Text, View, FlatList, Image } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";
import PrimaryButton from "../../components/button/PrimaryButton";
import StepBar from "../../components/StepBar";
import QuizResult from "../../components/QuizResult";
import { LargeProgress } from "./OwnerAttemptingSurvey";
import AttemptTitle from "../../components/AttemptTitle";

export default (props) => {
  console.log(props.route.params);
  const type = props.route.params.type;
  const [totalResponse, setTotalResponse] = useState(0);

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

    if (type === "survey") {
      var totalResponseVar = props.route.params.jsonData.choices.reduce(
        (total, value) => total + value.response,
        0
      );
      setTotalResponse(totalResponseVar);
    }
  });

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
        domain: [0, props.route.params.jsonData.fullScore],
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

  const [chartData, setChartData] = useState([
    {
      label: "Min",
      chartImageUrl: generateChartUri(
        props.route.params.jsonData.minScore,
        color.wrong
      ),
    },
    {
      label: "Mean",
      chartImageUrl: generateChartUri(
        props.route.params.jsonData.meanScore,
        color.warning
      ),
    },
    {
      label: "Max",
      chartImageUrl: generateChartUri(
        props.route.params.jsonData.maxScore,
        color.correct
      ),
    },
  ]);

  const Chart = ({ label, chartImageUrl }) => {
    return (
      <View
        style={{
          width: "30%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: chartImageUrl }}
          style={{ width: "100%", height: 72, resizeMode: "cover" }}
        />
        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            fontWeight: "bold",
            color: color.content4,
          }}
        >
          {label}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.base2 }}>
      <View style={theme.container}>
        <StepBar
          themeColor={type === "quiz" ? color.primary : color.secondary}
          options={[
            { title: "ATTEMPTING", finished: true },
            { title: "RESULT", finished: true },
          ]}
        />
        {type === "quiz" ? (
          <AttemptTitle
            themeColor={color.primary}
            title={props.route.params.jsonData.quizTitle}
            labels={[
              "Quiz",
              props.route.params.jsonData.questionLength === 1
                ? "1 Question"
                : `${props.route.params.jsonData.questionLength} Questions`,
            ]}
            timer={props.route.params.timeSpent}
          />
        ) : (
          <AttemptTitle
            themeColor={color.secondary}
            title={props.route.params.jsonData.surveyTitle}
            labels={[
              "Survey",
              `${props.route.params.jsonData.choices.length} Choices`,
            ]}
            timer={props.route.params.timeSpent}
          />
        )}
        {type === "quiz" ? (
          <>
            <View
              style={[
                {
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  paddingHorizontal: 24,
                  paddingTop: 24,
                  paddingBottom: 16,
                  backgroundColor: color.base1,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  paddingVertical: 12,
                }}
              >
                {chartData.map((each, index) => (
                  <Chart
                    key={index}
                    label={each.label}
                    chartImageUrl={each.chartImageUrl}
                  />
                ))}
              </View>
            </View>
            <View
              style={[
                {
                  borderBottomLeftRadius: 24,
                  borderBottomRightRadius: 24,
                  borderTopWidth: 1,
                  borderColor: color.base2,
                  paddingHorizontal: 24,
                  paddingVertical: 16,
                  backgroundColor: color.base1,
                },
              ]}>
              <Text style={{ fontSize: 16, textAlign: 'center', color: color.content4 }}>
                Total {props.route.params.jsonData.totalResponse} Attempt
              </Text>
            </View>
          </>
        ) : (
          <FlatList
            data={props.route.params.jsonData.choices}
            style={{ paddingHorizontal: 4 }}
            renderItem={({ item, index }) => (
              <LargeProgress
                title={item.title}
                length={item.response}
                maxLength={totalResponse}
              />
            )}
            keyExtractor={(item, index) => index}
            ListFooterComponent={() => (
              <View style={{ paddingBottom: 200 }}></View>
            )}
          />
        )}
      </View>
      <View style={theme.tabBarContainer}>
        <View style={theme.tabBar}>
          <PrimaryButton
            backgroundColor={color.content3}
            title={"Back to Room"}
            onPress={BackRoomHandler}
          />
        </View>
      </View>
    </View>
  );
};
