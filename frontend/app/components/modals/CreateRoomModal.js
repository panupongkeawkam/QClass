import React, { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { theme, modalTheme, color } from "../../assets/theme/Theme";
import SecondaryButton from "../button/SecondaryButton";

import { createNewRoom } from "../../controller/RoomController";

export default (props) => {
  const [roomName, setRoomName] = useState("");
  const [iconName, setIconName] = useState("");
  const icons = [
    "ios-earth",
    "ios-musical-notes",
    "analytics",
    "ios-bar-chart",
    "md-medkit",
    "md-location",
    "ios-terminal",
    "md-desktop",
    "cloud",
    "image",
  ];

  const confirmHandler = async () => {
    // กดปุ่ม confirm
    var newRoom = await createNewRoom(props.user.userId, roomName, iconName);
    setRoomName("");
    setIconName("");
    props.onCreateRoom(newRoom);
    props.close();
  };

  // Icon
  const MyIcon = (icon) => {
    return (
      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
          backgroundColor: icon.isSelect ? `${color.primary}22` : "transparent",
        }}
        onPress={() => {
          icon.onSelect();
        }}
      >
        <Ionicons
          name={icon.isSelect ? icon.iconName : icon.iconName + "-outline"}
          size={24}
          color={icon.isSelect ? color.primary : color.content4}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={modalTheme.centeredView}>
      <Modal
        transparent={true}
        animationType={"fade"}
        visible={props.visible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          props.close();
        }}
      >
        <KeyboardAwareScrollView
          style={{
            flex: 1,
          }}
          extraHeight={Dimensions.get("window").height * 0.3}
        >
          <View
            style={[
              modalTheme.centeredView,
              { height: Dimensions.get("window").height },
            ]}
          >
            <View style={[modalTheme.modalView]}>
              <View style={modalTheme.header}>
                <Text style={modalTheme.textHeader}>Create Room</Text>
                <TouchableOpacity
                  onPress={() => {
                    props.close();
                  }}
                >
                  <Ionicons name="ios-close" size={28} />
                </TouchableOpacity>
              </View>
              <TextInput
                autoFocus={true}
                maxLength={20}
                placeholderTextColor={color.base3}
                style={theme.textInput}
                placeholder="Room name"
                onChangeText={(value) => {
                  setRoomName(value);
                }}
              />
              <View style={modalTheme.iconInput}>
                <View style={modalTheme.iconRow}>
                  {icons.slice(0, 5).map((icon, index) => {
                    return (
                      <MyIcon
                        key={index}
                        iconName={icon}
                        onSelect={() => {
                          setIconName((current) => {
                            return icon === current ? null : icon;
                          });
                        }}
                        isSelect={iconName === icon}
                      />
                    );
                  })}
                </View>
                <View style={modalTheme.iconRow}>
                  {icons.slice(5, 10).map((icon, index) => {
                    return (
                      <MyIcon
                        key={index}
                        iconName={icon}
                        onSelect={() => {
                          setIconName((current) => {
                            return icon === current ? null : icon;
                          });
                        }}
                        isSelect={iconName === icon}
                      />
                    );
                  })}
                </View>
              </View>
              <SecondaryButton
                disabled={!roomName?.trim()}
                title="CONFIRM"
                onPress={() => {
                  confirmHandler();
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    </View>
  );
};
