import React, { useState, useEffect } from "react";
import { Text, View, Alert, FlatList } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import axios from "axios";

import { theme, color } from "../../assets/theme/Theme";
import PrimaryButton from "../../components/button/PrimaryButton";
import StepBar from "../../components/StepBar";
import AttemptTitle from "../../components/AttemptTitle";

import { getSurveyResult } from "../../controller/QuizController";
import config from "../../assets/api-config";

const LargeProgress = ({ title, length, maxLength }) => (
  <View
    style={{
      ...theme.blurShadow,
      backgroundColor: color.base1,
      paddingHorizontal: 24,
      borderRadius: 24,
      marginVertical: 8,
      paddingTop: 10,
      paddingBottom: 16,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        paddingVertical: 4,
      }}
    >
      <View
        style={{
          width: "80%",
          padding: 4,
          fontSize: 16,
          color: color.content3,
        }}
      >
        <Text style={{ fontSize: 16 }}>{title}</Text>
      </View>
      <View
        style={{
          width: "20%",
          alignItems: "flex-end",
          padding: 4,
          color: color.content3,
        }}
      >
        <Text style={{ fontSize: 16 }}>{length === null ? "?" : length}</Text>
      </View>
      <View
        style={{
          width: "100%",
          height: 16,
          borderRadius: 24,
          backgroundColor: color.base2,
          padding: 3,
        }}
      >
        <View
          style={{
            height: "100%",
            borderRadius: 24,
            minWidth: length ? 10 : 0,
            minHeight: length ? 10 : 0,
            width: `${Math.round((length / maxLength) * 100)}%`,
            backgroundColor: color.warning,
          }}
        ></View>
      </View>
    </View>
  </View>
);

export default (props) => {
  const survey = props.route.params.survey;
  const roomId = props.route.params.room.roomId;
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    props.navigation.setOptions({
      title: null,
      gestureEnabled: false,
      headerShown: false,
      headerLeft: () => {
        return <></>;
      },
    });

    for (var i = 0; i < 1200; i++) {
      setTimeout(() => {
        setTimer(timer + 1);
      }, 1000);
    }
  });

  const endAttemptHandler = async () => {
    Alert.alert("", "Are you sure to end this survey now?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "End",
        style: "destructive",
        onPress: async () => {
          await axios.put(`http://${config.ip}:3000/survey/${survey.surveyId}`);

          var jsonData = await getSurveyResult(props.route.params.survey);
          jsonData.type = "survey";
          jsonData.totalResponse = jsonData.choices.reduce(
            (total, value) => total + value.response,
            0
          );

          var resultResponse = await axios.post(
            `http://${config.ip}:3000/room/${roomId}/result`,
            {
              jsonData: jsonData,
            }
          );

          props.navigation.navigate("OwnerAttemptResult", {
            type: "survey",
            jsonData: resultResponse.data,
            timeSpent: formatTime(timer),
          });
        },
      },
    ]);
  };

  const formatTime = (time) => {
    var minutes = (parseInt(time / 60) + 100).toString().slice(1);
    var seconds = ((time % 60) + 100).toString().slice(1);
    return `${minutes}:${seconds}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.base2 }}>
      <View style={[theme.container]}>
        <StepBar
          themeColor={color.secondary}
          options={[
            { title: "ATTEMPTING", finished: true },
            { title: "RESULT", finished: false },
          ]}
        />
        <AttemptTitle
          themeColor={color.secondary}
          title={survey.title}
          labels={["Survey", `${survey.choices.length} Choices`]}
          timer={formatTime(timer)}
        />
        <FlatList
          data={survey.choices}
          style={{ paddingHorizontal: 4 }}
          renderItem={({ item, index }) => (
            <LargeProgress title={item.title} length={null} maxLength={null} />
          )}
          keyExtractor={(item, index) => index}
          ListFooterComponent={() => (
            <View style={{ paddingBottom: 200 }}></View>
          )}
        />
      </View>
      <View style={theme.tabBarContainer}>
        <View style={theme.tabBar}>
          <PrimaryButton
            backgroundColor={color.wrong}
            title={"End Attempt"}
            onPress={endAttemptHandler}
          />
        </View>
      </View>
    </View>
  );
};

export { LargeProgress };
