import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../assets/theme/Theme";
import OwnerAnnouncement from "../screens/owner/OwnerAnnouncement";
import OwnerRoomResult from "../screens/owner/OwnerRoomResult";
import StartAttemptButton from "../components/button/StartAttemptButton";
import HeaderButton from "../components/button/HeaderButton";

export default (props) => {
  const [showStartAttemptButton, setShowStartAttemptButton] = useState(true);
  const RoomTabsNavigators = createBottomTabNavigator();

  useEffect(() => {
    props.navigation.setOptions({
      title: props.route.params.room.title,
      headerRight: () => (
        <HeaderButton
          title={"Invite"}
          iconName="person-add-outline"
          iconSize={16}
          onPress={() => {
            props.navigation.navigate("RoomInvite", {
              roomCode: props.route.params.room.inviteCode,
            });
          }}
        />
      ),
    });
  }, []);

  const NullComponent = () => null;

  return (
    <RoomTabsNavigators.Navigator
      initialRouteName="OwnerRoomResult"
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
        name="OwnerRoomResult"
        component={OwnerRoomResult}
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
