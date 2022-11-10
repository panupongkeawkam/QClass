import React, { useEffect, useState } from "react";
import { TouchableOpacity, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PortalProvider } from "@gorhom/portal";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "./app/assets/theme/Theme";
import Splash from "./app/screens/Splash";
import HomeTabsNavigator from "./app/navigators/HomeTabsNavigator";
import QuestionOverview from "./app/screens/QuestionOverview";
import QuestionDetail from "./app/screens/QuestionDetail";
import CreateQuestion from "./app/screens/CreateQuestion";
import ParticipantRoomTabsNavigator from "./app/navigators/ParticipantRoomTabsNavigator";
import OwnerRoomTabsNavigator from "./app/navigators/OwnerRoomTabsNavigator";
import RoomInvite from "./app/screens/owner/RoomInvite";
import OwnerAttemptingQuiz from "./app/screens/owner/OwnerAttemptingQuiz";
import OwnerAttemptingSurvey from "./app/screens/owner/OwnerAttemptingSurvey";
import OwnerAttemptResult from "./app/screens/owner/OwnerAttemptResult";
import ParticipantAttemptingQuiz from "./app/screens/participant/ParticipantAttemptingQuiz";
import ParticipantQuizResult from "./app/screens/participant/ParticipantQuizResult";
import ParticipantAttemptingSurvey from "./app/screens/participant/ParticipantAttemptingSurvey";

export default function App() {
  const Stack = createNativeStackNavigator();
  const [loading, setLoading] = useState(true);

  StatusBar.setBarStyle("dark-content");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  });

  if (loading) {
    return <Splash />;
  }

  return (
    <SafeAreaProvider>
      <PortalProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="HomeTabsNavigator"
            screenOptions={(props) => ({
              headerShadowVisible: false,
              headerShown: props.route.name !== "HomeTabsNavigator",
              headerStyle: {
                backgroundColor: color.base2,
              },
              headerTintColor: color.primary,
              headerTitleStyle: {
                fontWeight: "600",
                fontSize: 16,
              },
              headerBackTitle: null,
              headerLeft: () => {
                if (props.route.name === "HomeTabsNavigator") {
                  return null;
                }

                return (
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.goBack();
                    }}
                  >
                    <Ionicons
                      name="md-arrow-back-outline"
                      size={28}
                      color={color.primary}
                    />
                  </TouchableOpacity>
                );
              },
            })}
          >
            <Stack.Screen
              name="HomeTabsNavigator"
              component={HomeTabsNavigator}
            />
            <Stack.Screen
              name="QuestionOverview"
              component={QuestionOverview}
            />
            <Stack.Screen name="QuestionDetail" component={QuestionDetail} />
            <Stack.Screen name="CreateQuestion" component={CreateQuestion} />
            <Stack.Screen
              name="OwnerRoomTabsNavigator"
              component={OwnerRoomTabsNavigator}
            />
            <Stack.Screen name="RoomInvite" component={RoomInvite} />
            <Stack.Screen
              name="OwnerAttemptingQuiz"
              component={OwnerAttemptingQuiz}
            />
            <Stack.Screen
              name="OwnerAttemptingSurvey"
              component={OwnerAttemptingSurvey}
            />
            <Stack.Screen
              name="OwnerAttemptResult"
              component={OwnerAttemptResult}
            />
            <Stack.Screen
              name="ParticipantRoomTabsNavigator"
              component={ParticipantRoomTabsNavigator}
            />
            <Stack.Screen
              name="ParticipantAttemptingQuiz"
              component={ParticipantAttemptingQuiz}
            />
            <Stack.Screen
              name="ParticipantQuizResult"
              component={ParticipantQuizResult}
            />
            <Stack.Screen
              name="ParticipantAttemptingSurvey"
              component={ParticipantAttemptingSurvey}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PortalProvider>
    </SafeAreaProvider>
  );
}
