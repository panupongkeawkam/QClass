import React, { useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { BarCodeScanner } from "expo-barcode-scanner";

import { theme, color } from "../../assets/theme/Theme";
import SecondaryButton from "./SecondaryButton";

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

  const joinHandler = async () => {
    try {
      var newRoom = await joinRoom(user.userId, inviteCode);
      props.navigation.navigate("QuizLibrary", {});
      props.navigation.navigate("RoomOverview", {});
      bottomSheetRef.current.close();
    } catch (error) {
      Alert.alert("", error.message, [{ text: "Retry", style: "cancel" }]);
      setInviteCode("");
    }
  };

  const bottomSheetOnChangeHandler = (state) => {
    setActiveCamera(() => state === 0);
    setInviteCode("");
    Keyboard.dismiss();
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (!data.includes("Roti")) {
      setActiveCamera(false);
      setScanned(true);
      Alert.alert("", "Invalid room QR code", [
        {
          text: "Retry",
          style: "cancel",
          onPress: () => {
            setActiveCamera(true);
            setScanned(false);
          },
        },
      ]);
      return;
    }
    setTimeout(() => {
      setScanned(() => false);
    }, 2000);
    setInviteCode(() => data.replace("Roti", ""));
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
            width: 88,
            height: 88,
            bottom: 48,
            backgroundColor: color.primary,
            borderRadius: 88,
          },
          theme.blurShadow,
          theme.centered,
        ]}
        onPress={async () => {
          const getUserId = async () => {
            var userVar = await userInitialize();
            setUser(userVar);
          };
          await getUserId();
          bottomSheetRef?.current?.expand();
          getBarCodeScannerPermissions();
          setActiveCamera(() => true);
        }}
      >
        <Ionicons name="scan-outline" size={32} color={color.base1} />
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
            paddingBottom: 24,
            borderRadius: 60,
          }}
          handleIndicatorStyle={{ width: 48 }}
          onChange={bottomSheetOnChangeHandler}
        >
          <BottomSheetView style={{ height: Dimensions.get("window").height }}>
            <KeyboardAvoidingView
              behavior="height"
              style={{ flex: 1 }}
              keyboardVerticalOffset={-100}
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
                  <View style={{ flex: 1, backgroundColor: "black" }}></View>
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
                    spellCheck={false}
                    onEndEditing={() => {
                      Keyboard.dismiss()
                    }}
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
            </KeyboardAvoidingView>
          </BottomSheetView>
        </BottomSheet>
      </Portal>
    </>
  );
};
