import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "react-native-vector-icons";

import { leaveRoom } from "../controller/RoomController";
import { theme, color } from "../assets/theme/Theme";
import ParticipantAnnouncement from "../screens/participant/ParticipantAnnouncement";
import ParticipantRoomQuiz from "../screens/participant/ParticipantRoomQuiz";
import HeaderButton from "../components/button/HeaderButton";

import axios from "axios";
import config from "../assets/api-config";

export default (props) => {
  const RoomTabsNavigators = createBottomTabNavigator();
  const userId = props.route.params.user.userId;
  const room = props.route.params.room;
  const participantId = props.route.params.participantId;

  const leaveRoomHandler = async () => {
    try {
      var leave = await leaveRoom(userId, room);
      props.navigation.navigate("RoomOverview");
    } catch (error) {
      Alert.alert(error.message, "", [{ text: "Retry", style: "cancel" }]);
    }
  };

  useEffect(() => {
    props.navigation.setOptions({
      title: props.route.params.room.title,
      headerRight: () => {
        return (
          <HeaderButton
            title={"Leave"}
            iconName={"exit-outline"}
            onPress={() => {
              Alert.alert(
                `Leave "${props.route.params.room.title}" Room?`,
                "",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Leave",
                    style: "destructive",
                    onPress: () => {
                      leaveRoomHandler();
                    },
                  },
                ]
              );
            }}
          />
        );
      },
    });
  }, []);

  return (
    <RoomTabsNavigators.Navigator
      initialRouteName="ParticipantRoomQuiz"
      screenOptions={{
        headerShown: false,
        tabBarStyle: theme.bottomTab,
        tabBarHideOnKeyboard: true,
      }}
    >
      <RoomTabsNavigators.Screen
        name="ParticipantRoomQuiz"
        component={ParticipantRoomQuiz}
        initialParams={{ room: room, participantId: participantId }}
        options={{
          tabBarIcon: ({ focused, size }) => {
            return (
              <Ionicons
                name={focused ? "ios-podium" : "ios-podium-outline"}
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
                ATTEMPT & RESULT
              </Text>
            );
          },
        }}
      />
      <RoomTabsNavigators.Screen
        name="ParticipantAnnouncement"
        component={ParticipantAnnouncement}
        initialParams={{
          room: props.route.params.room,
          user: props.route.params.user,
        }}
        options={{
          tabBarIcon: ({ focused, size }) => {
            return (
              <Ionicons
                name={focused ? "megaphone" : "megaphone-outline"}
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
                ANNOUNCEMENT
              </Text>
            );
          },
        }}
      />
    </RoomTabsNavigators.Navigator>
  );
};
