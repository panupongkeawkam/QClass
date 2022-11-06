import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Keyboard,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { theme, color } from "../../assets/theme/Theme";
import PrimaryButton from "./PrimaryButton";
import StartQuiz from "../../screens/owner/StartQuiz";
import StartSurvey from "../../screens/owner/StartSurvey";

export default (props) => {
  const bottomSheetRef = useRef(null);
  const Tab = createMaterialTopTabNavigator();

  const startHandler = (data) => {
    bottomSheetRef.current.close();
    console.log("StartAttemptButton says:", data);
    setTimeout(() => {
      props.navigation.navigate("OwnerAttemptingQuiz", {
        data: data,
      });
    }, 500);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={props.hide ? 0 : 0.2}
        style={[
          {
            width: 108,
            height: 72,
            bottom: 40,
            backgroundColor: color.primary,
            borderRadius: 24,
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
        <Ionicons name="ios-add" size={24} color={color.base1} />
        <Text
          style={{
            color: color.base1,
            fontWeight: "bold",
            fontSize: 12,
            marginTop: 4,
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
          <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            extraHeight={Dimensions.get("window").height * 0.3}
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
                  children={(props) => (
                    <StartSurvey
                      onStart={(data) => {
                        startHandler(data);
                      }}
                      {...props}
                    />
                  )}
                  options={{ tabBarLabel: "Survey" }}
                />
                <Tab.Screen
                  name="StartQuiz"
                  children={(props) => (
                    <StartQuiz
                      onStart={(data) => {
                        props.navigation.navigate("StartSurvey");
                        startHandler(data);
                      }}
                      {...props}
                    />
                  )}
                  options={{ tabBarLabel: "Quiz" }}
                />
              </Tab.Navigator>
            </NavigationContainer>
          </KeyboardAwareScrollView>
        </BottomSheet>
      </Portal>
    </>
  );
};
