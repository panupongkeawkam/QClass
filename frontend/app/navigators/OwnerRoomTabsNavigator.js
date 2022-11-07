import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../assets/theme/Theme";
import OwnerAnnouncement from "../screens/owner/OwnerAnnouncement";
import OwnerRoomQuiz from "../screens/owner/OwnerRoomQuiz";
import StartAttemptButton from "../components/button/StartAttemptButton";

export default (props) => {
  const [showStartAttemptButton, setShowStartAttemptButton] = useState(true);
  const RoomTabsNavigators = createBottomTabNavigator();

  useEffect(() => {
    props.navigation.setOptions({
      title: props.route.params.room.title,
      headerRight: () => {
        return (
          <InviteButton
            onInvite={() => {
              props.navigation.navigate("RoomInvite", {
                roomCode: props.route.params.room.inviteCode,
              });
            }}
          />
        );
      },
    });
  }, []);

  const InviteButton = ({ onInvite }) => {
    return (
      <TouchableOpacity
        onPress={onInvite}
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
        <Ionicons name="person-add-outline" size={16} color="grey" />
        <Text
          style={{
            marginLeft: 4,
            fontSize: 16,
            fontWeight: "bold",
            color: "grey",
          }}
        >
          Invite
        </Text>
      </TouchableOpacity>
    );
  };
  const NullComponent = () => null;

  return (
    <RoomTabsNavigators.Navigator
      initialRouteName="OwnerRoomQuiz"
      screenOptions={(props) => ({
        headerShown: false,
        tabBarStyle: [
          theme.bottomTab,
          {
            borderTopLeftRadius: showStartAttemptButton ? 32 : 0,
            borderTopRightRadius: showStartAttemptButton ? 32 : 0,
            shadowOpacity: showStartAttemptButton
              ? theme.tabBar.shadowOpacity
              : 0,
          },
        ],
        tabBarHideOnKeyboard: true,
      })}
    >
      <RoomTabsNavigators.Screen
        name="OwnerRoomQuiz"
        component={OwnerRoomQuiz}
        initialParams={{
          room: props.route.params.room,
          user: props.route.params.user,
        }}
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
                RESULT
              </Text>
            );
          },
        }}
      />
      <RoomTabsNavigators.Screen
        name="StartAttempt"
        component={NullComponent}
        options={() => ({
          tabBarButton: () => {
            return (
              <StartAttemptButton
                room={props.route.params.room}
                user={props.route.params.user}
                {...props}
                hide={!showStartAttemptButton}
              />
            );
          },
        })}
      />
      <RoomTabsNavigators.Screen
        name="OwnerAnnouncement"
        component={OwnerAnnouncement}
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
            useEffect(() => {
              setShowStartAttemptButton(() => !focused);
            });

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
