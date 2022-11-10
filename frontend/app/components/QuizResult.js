import React, { useState } from "react";
import { Text, View, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";

import { theme, color } from "../assets/theme/Theme";
import Label from "./Label";

export default ({
  fullScore,
  maxScore,
  meanScore,
  minScore,
  questionLength,
  quizTitle,
  createDate,
  myScore = null,
}) => {
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

  const [chartData, setChartData] = useState([
    {
      label: "Min",
      chartImageUrl: generateChartUri(minScore, color.wrong),
    },
    {
      label: "Mean",
      chartImageUrl: generateChartUri(meanScore, color.warning),
    },
    {
      label: "Max",
      chartImageUrl: generateChartUri(maxScore, color.correct),
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
    <View style={[theme.blurShadow, { marginVertical: 8 }]}>
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
            flexDirection: "row",
          },
        ]}
      >
        <View style={{ width: "80%" }}>
          <Text style={theme.textHeader2}>{quizTitle}</Text>
          <Text
            style={{ color: color.content4, fontSize: 12, marginBottom: 16 }}
          >
            {createDate}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Label text={"Quiz"} />
            <Label
              text={
                questionLength === 1
                  ? "1 Question"
                  : `${questionLength} Questions`
              }
            />
          </View>
        </View>
        <View
          style={{
            width: "20%",
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          <Text
            style={{ fontSize: 12, color: color.base4, fontWeight: "normal" }}
          >
            {fullScore} Point
          </Text>
        </View>
      </View>
      <View
        style={[
          {
            borderBottomLeftRadius: myScore ? 0 : 24,
            borderBottomRightRadius: myScore ? 0 : 24,
            paddingHorizontal: 24,
            paddingVertical: 16,
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
      {myScore ? (
        <View
          style={[
            {
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              paddingHorizontal: 24,
              paddingVertical: 16,
              borderTopWidth: 1,
              backgroundColor: color.base1,
              borderColor: color.base2,
            },
          ]}
        >
          <Text
            style={{
              fontSize: 18,
              textAlign: "center",
              color: color.content1,
              justifyContent: "center",
            }}
          >
            Your score is{" "}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: color.primary,
              }}
            >
              {myScore}
            </Text>
          </Text>
        </View>
      ) : null}
    </View>
  );
};
