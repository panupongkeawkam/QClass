import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { theme, color } from "../../assets/theme/Theme";
import StartQuiz from "../../screens/owner/StartQuiz";
import StartSurvey from "../../screens/owner/StartSurvey";

export default (props) => {
  const room = props.route.params.room;

  const bottomSheetRef = useRef(null);
  const Tab = createMaterialTopTabNavigator();

  const startQuizHandler = ({ type, quiz, quizIndex }) => {
    bottomSheetRef.current.close();
    setTimeout(() => {
      props.navigation.navigate("OwnerAttemptingQuiz", {
        type,
        quiz,
        quizIndex,
        room,
      });
    }, 500);
  };

  const startSurveyHandler = ({ survey }) => {
    bottomSheetRef.current.close();
    setTimeout(() => {
      props.navigation.navigate("OwnerAttemptingSurvey", {
        survey,
        room,
      });
    }, 500);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={props.hide ? 0 : 0.2}
        style={[
          {
            width: 88,
            height: 88,
            bottom: 48,
            backgroundColor: color.primary,
            borderRadius: 88,
            opacity: props.hide ? 0 : 1,
          },
          theme.blurShadow,
          theme.centered,
        ]}
        onPress={() => {
          if (props.hide) {
            return;
          }
          bottomSheetRef?.current?.expand();
        }}
      >
        <Ionicons name="ios-add" size={32} color={color.base1} />
        <Text
          style={{
            color: color.base1,
            fontWeight: "bold",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          ATTEMPT
        </Text>
      </TouchableOpacity>
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={["94%"]}
          enablePanDownToClose={true}
          style={[theme.blurShadow]}
          handleStyle={{
            backgroundColor: color.base1,
            paddingBottom: 20,
            borderRadius: 60,
          }}
          handleIndicatorStyle={{ width: 48 }}
          onChange={() => {
            Keyboard.dismiss();
          }}
        >
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="StartSurvey"
              screenOptions={{
                tabBarLabelStyle: { fontSize: 16, fontWeight: "bold" },
                tabBarActiveTintColor: color.primary,
                tabBarInactiveTintColor: color.content4,
                tabBarIndicatorStyle: {
                  height: 4,
                  width: Dimensions.get("window").width * 0.4,
                  marginHorizontal: Dimensions.get("window").width * 0.05,
                  borderRadius: 16,
                  marginBottom: 6,
                  backgroundColor: color.primary,
                },
              }}
            >
              <Tab.Screen
                name="StartSurvey"
                initialParams={{ room: props.room, user: props.user }}
                children={(props) => (
                  <StartSurvey
                    onStart={(data) => {
                      startSurveyHandler(data);
                    }}
                    {...props}
                  />
                )}
                options={{ tabBarLabel: "Survey" }}
              />
              <Tab.Screen
                name="StartQuiz"
                initialParams={{ room: props.room, user: props.user }}
                children={(props) => (
                  <StartQuiz
                    onStart={(data) => {
                      props.navigation.navigate("StartSurvey");
                      startQuizHandler(data);
                    }}
                    {...props}
                  />
                )}
                options={{ tabBarLabel: "Quiz" }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </BottomSheet>
      </Portal>
    </>
  );
};
