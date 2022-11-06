import React, { useEffect } from "react";
import { Text, TouchableOpacity, Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "react-native-vector-icons";

import { leaveRoom } from "../controller/RoomController";
import { theme, color } from "../assets/theme/Theme";
import ParticipantAnnouncement from "../screens/participant/ParticipantAnnouncement";
import ParticipantRoomQuiz from "../screens/participant/ParticipantRoomQuiz";

export default (props) => {
  const RoomTabsNavigators = createBottomTabNavigator();
  const leaveRoomHandler = async () => {
    const userId = props.route.params.user.userId
    const room = props.route.params.room
    try {
      var leave = await leaveRoom(userId, room);
      props.navigation.navigate("RoomOverview");
      console.log("Success : ", leave)
    } catch (error) {
      console.log("Error : ", error);
    }
  }

  useEffect(() => {
    props.navigation.setOptions({
      title: props.route.params.roomTitle,
      headerRight: () => {
        return (
          <LeftRoomButton
            onLeave={() => {
              Alert.alert(`Leave "${props.route.params.roomTitle}" Room?`, "", [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Leave",
                  style: "destructive",
                  onPress: () => {
                    leaveRoomHandler()
                  },
                },
              ]);
            }}
          />
        );
      },
    });
  }, []);

  const LeftRoomButton = ({ onLeave }) => {
    return (
      <TouchableOpacity
        onPress={onLeave}
        style={{
          backgroundColor: "#eee",
          borderRadius: "50",
          paddingHorizontal: 12,
          marginLeft: 8,
          height: 36,
          flexDirection: "row",
          ...theme.centered,
          ...theme.blurShadow,
        }}
      >
        <Ionicons name="exit-outline" size={20} color="grey" />
        <Text
          style={{
            marginLeft: 4,
            fontSize: 16,
            fontWeight: "bold",
            color: "grey",
          }}
        >
          Leave
        </Text>
      </TouchableOpacity>
    );
  };

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
        initialParams={{room : props.route.params.room, user : props.route.params.user}}
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
