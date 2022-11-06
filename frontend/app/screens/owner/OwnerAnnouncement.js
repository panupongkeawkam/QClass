import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";
import EmptyDataLabel from "../../components/EmptyDataLabel";
import ChatBox from "../../components/ChatBox";

export default (props) => {
  const [message, setMessage] = useState("");
  const data = [
    {
      message: "Just take a break for 15 minutes",
      time: "12:40",
    },
    { message: "See ya!", time: "Yesterday 15:07" },
    { message: "When I'm tired!", time: "Yesterday 16:07" },
    {
      message:
        "How can I find another one like you, then I love to lay down on",
      time: "22 October 15:07",
    },
  ];
  const refsFocus = useRef(null); // ทำเป็นปุ่มกดแชทได้

  const sendMessageHandler = () => {
    console.log("send message: " + message);
    setMessage("")
    Keyboard.dismiss()
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <View style={{ flex: 1 }}>
        <ScrollView style={theme.container}>
          {data.length !== 0 ? (
            data.map((d, index) => {
              return (
                <ChatBox
                  style={{ marginBottom: data.length - 1 === index ? 240 : 0 }}
                  message={d.message}
                  dateTime={d.time} // didn't format
                  alignRight
                  key={index}
                />
              );
            })
          ) : (
            <EmptyDataLabel title="No Announcement" />
          )}
        </ScrollView>
        <View
          style={[
            {
              position: "absolute",
              bottom: 0,
              paddingHorizontal: 12,
              paddingBottom: 28,
            },
          ]}
        >
          <View
            style={{
              backgroundColor: color.base1,
              borderRadius: 32,
              padding: 20,
              flexDirection: "row",
              paddingBottom: 96,
              shadowColor: color.content1,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.075,
              shadowRadius: 10,
              elevation: 0.075,
            }}
          >
            <TextInput
              style={[
                theme.textInput,
                { width: "84%", marginTop: 0, marginBottom: 0 },
              ]}
              placeholderTextColor={color.base3}
              placeholder="Announcement messages"
              value={message}
              onChangeText={(text) => {
                setMessage(text);
              }}
              onFocus={() => {
                console.log("focus!")
              }}
              onSubmitEditing={() => {
                console.log("submit!")
              }}
            />
            <TouchableOpacity
              style={{
                width: "12%",
                marginLeft: "4%",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={sendMessageHandler}
            >
              <Ionicons
                name="paper-plane-outline"
                size={28}
                color={color.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
