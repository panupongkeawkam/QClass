import React, { useState, useRef, useEffect } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import axios from "axios";

import { theme, color } from "../../assets/theme/Theme";
import PrimaryButton from "../../components/button/PrimaryButton";
import Question from "../../components/Question";

export default (props) => {
  console.log("OwnerAttemptingSurvey:", props.route.params.survey);
  const survey = props.route.params.survey;

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

  const endAttemptHandler = () => {
    if (true) {
      props.navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.base2 }}>
      <View style={[theme.container, { paddingTop: 100 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              paddingBottom: 200,
            }}
          >
            <Question
              title={survey.title}
              isSurvey={true}
              type={"choice"}
              choices={survey.choices}
              timer={null}
              untouchable
              onSelect={() => {}}
            />
          </View>
        </ScrollView>
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
