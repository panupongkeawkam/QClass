import React, { useState } from "react";
import {
  Modal,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, modalTheme, color } from "../../assets/theme/Theme";
import SecondaryButton from "../button/SecondaryButton";

import { createNewRoom } from "../../controller/RoomController";

export default (props) => {
  const [roomName, setRoomName] = useState("");
  const [iconName, setIconName] = useState("");
  const icons = [
    "ios-musical-notes",
    "ios-flask",
    "ios-camera",
    "document-text",
    "ios-earth",
    "pie-chart",
    "game-controller",
    "ios-fast-food",
    "ios-baseball",
    "color-palette",
  ];
  const colorOfIcons = {
    "ios-musical-notes": { primary: "#ff8f85", secondary: "#ffecec" },
    "ios-flask": { primary: "#ca97d4", secondary: "#f9eef8" },
    "game-controller": { primary: "#c48bd3", secondary: "#f6ebf8" },
    "ios-camera": { primary: "#70b5d9", secondary: "#e8f2f8" },
    "document-text": { primary: "#75c2ee", secondary: "#e9f5fc" },
    "ios-earth": { primary: "#4cdbc2", secondary: "#e5f8f6" },
    "pie-chart": { primary: "#5fd39c", secondary: "#e7f6ef" },
    "ios-fast-food": { primary: "#fbdc59", secondary: "#fff9e7" },
    "ios-baseball": { primary: "#ffc15f", secondary: "#fef5e5" },
    "color-palette": { primary: "#f19458", secondary: "#fceee5" },
  };

  const confirmHandler = async () => {
    var newRoom = await createNewRoom(props.user.userId, roomName, iconName);
    setRoomName("");
    setIconName("");
    props.onCreateRoom(newRoom);
    props.close();
  };

  const MyIcon = (icon) => {
    return (
      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
          backgroundColor: icon.isSelect
            ? colorOfIcons[icon.iconName].secondary
            : "transparent",
        }}
        onPress={() => {
          icon.onSelect();
        }}
      >
        <Ionicons
          name={icon.isSelect ? icon.iconName : icon.iconName + "-outline"}
          size={24}
          color={
            icon.isSelect ? colorOfIcons[icon.iconName].primary : color.content4
          }
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={modalTheme.centeredView}>
      <Modal transparent={true} animationType={"fade"} visible={props.visible}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="height"
          keyboardVerticalOffset={-(Dimensions.get("window").height * 0.15)}
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
                    setIconName("");
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
                title="Confirm"
                onPress={() => {
                  confirmHandler();
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};
