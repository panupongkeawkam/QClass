import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Keyboard,
  Alert,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { BarCodeScanner } from "expo-barcode-scanner";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackActions } from "@react-navigation/native";

import { theme, color } from "../../assets/theme/Theme";
import SecondaryButton from "./SecondaryButton";
import EmptyDataLabel from "../EmptyDataLabel";

import { joinRoom } from "../../controller/RoomController";

import { userInitialize } from "../../controller/UserController";

export default (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [inviteCode, setInviteCode] = useState(null);
  const [activeCamera, setActiveCamera] = useState(false);
  const [status, requestPermission] = BarCodeScanner.usePermissions();
  const [user, setUser] = useState({});

  const bottomSheetRef = useRef(null);

  // press 'Join' button
  const joinHandler = async () => {
    try {
      var newRoom = await joinRoom(user.userId, inviteCode);
      console.log("Success: ", newRoom);
      console.log(props);
      props.navigation.navigate("QuizLibrary", {});
      props.navigation.navigate("RoomOverview", {});
      bottomSheetRef.current.close();
    } catch (error) {
      Alert.alert(error.message);
      setInviteCode("");
      console.log("Error: ", error);
    }
  };

  const bottomSheetOnChangeHandler = (state) => {
    setActiveCamera(() => state === 0);
    setInviteCode("");
    Keyboard.dismiss();
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setTimeout(() => {
      setScanned(() => false);
    }, 2000);
    setInviteCode(() => data);
  };

  const getBarCodeScannerPermissions = async () => {
    const permission = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(permission.status === "granted");
    if (permission.status === "denied") {
      bottomSheetRef?.current.close();
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[
          {
            width: 108,
            height: 72,
            bottom: 40,
            backgroundColor: color.primary,
            borderRadius: 24,
          },
          theme.blurShadow,
          theme.centered,
        ]}
        onPress={() => {
          const getUserId = async () => {
            var userVar = await userInitialize();
            setUser(userVar);
          };
          getUserId();
          getBarCodeScannerPermissions();
          setActiveCamera(() => true);
          bottomSheetRef?.current?.expand();
        }}
      >
        <Ionicons name="scan-outline" size={28} color={color.base1} />
        <Text
          style={{
            color: color.base1,
            fontWeight: "bold",
            fontSize: 12,
            marginTop: 4,
          }}
        >
          JOIN
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
          onChange={bottomSheetOnChangeHandler}
        >
          <KeyboardAwareScrollView
            extraHeight={Dimensions.get("window").height * 0.3}
          >
            <BottomSheetView
              style={{ height: Dimensions.get("window").height }}
            >
              <View
                style={{
                  height: "60%",
                  paddingHorizontal: 12,
                  backgroundColor: color.base1,
                }}
              >
                {activeCamera ? (
                  <BarCodeScanner
                    onBarCodeScanned={
                      scanned ? undefined : handleBarCodeScanned
                    }
                    style={{ flex: 1 }}
                  />
                ) : (
                  <EmptyDataLabel title="Accessing Camera..." />
                )}
              </View>
              <View
                style={{
                  alignItems: "center",
                  height: "40%",
                  padding: 16,
                  paddingBottom: 132,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: color.base1,
                }}
              >
                <View style={{ width: "60%", alignItems: "center" }}>
                  <TextInput
                    value={inviteCode}
                    placeholder={"Room Code"}
                    placeholderTextColor={color.base3}
                    onChangeText={(text) => {
                      setInviteCode(() => text);
                    }}
                    style={[theme.textInput, { textAlign: "center" }]}
                  ></TextInput>
                  <SecondaryButton
                    disabled={!inviteCode}
                    title={"Join"}
                    onPress={joinHandler}
                    isWide
                  />
                </View>
              </View>
            </BottomSheetView>
          </KeyboardAwareScrollView>
        </BottomSheet>
      </Portal>
    </>
  );
};