import React, { useEffect, useState } from "react";
import { Text, View, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "react-native-vector-icons";

import JoinRoomButton from "../components/button/JoinRoomButton";
import QuizLibrary from "../screens/QuizLibrary";
import RoomOverview from "../screens/RoomOverview";
import { theme, color } from "../assets/theme/Theme";

export default (props) => {
  const HomeTabs = createBottomTabNavigator();

  useEffect(() => {
    props.navigation.setOptions({
      title: null,
    });
  }, []);

  const NullComponent = () => {
    return null;
  };

  return (
    <HomeTabs.Navigator
      initialRouteName="RoomOverview"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "left",
        headerStyle: {
          backgroundColor: color.base2,
          height: 100,
        },
        headerShadowVisible: false,
        headerTitle: () => {
          return (
            <Image
              source={require("../assets/q-class-logo-text.png")}
              style={{ height: 20, width: 80, resizeMode: "contain" }}
            />
          );
        },
        tabBarStyle: {
          ...theme.bottomTab,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <HomeTabs.Screen
        name="RoomOverview"
        component={RoomOverview}
        options={{
          tabBarIcon: ({ focused, size }) => {
            return (
              <Ionicons
                name={focused ? "grid" : "grid-outline"}
                size={24}
                color={focused ? color.primary : color.base4}
              />
            );
          },
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: focused ? color.primary : color.base4,
                  fontSize: 10,
                  fontWeight: "bold",
                  marginTop: 2,
                }}
              >
                ROOM
              </Text>
            );
          },
        }}
      />
      <HomeTabs.Screen
        name="JoinRoom"
        component={NullComponent}
        options={() => ({
          tabBarButton: () => {
            return <JoinRoomButton {...props} title="JOIN ROOM" />;
          },
        })}
      />
      <HomeTabs.Screen
        name="QuizLibrary"
        component={QuizLibrary}
        options={{
          tabBarIcon: ({ focused, size }) => {
            return (
              <Ionicons
                name={focused ? "albums" : "albums-outline"}
                size={24}
                color={focused ? color.primary : color.base4}
              />
            );
          },
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: focused ? color.primary : color.base4,
                  fontSize: 10,
                  fontWeight: "bold",
                  marginTop: 2,
                }}
              >
                QUIZ LIBRARY
              </Text>
            );
          },
        }}
      />
    </HomeTabs.Navigator>
  );
};
