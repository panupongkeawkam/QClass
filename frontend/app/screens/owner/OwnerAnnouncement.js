import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";
import EmptyDataLabel from "../../components/EmptyDataLabel";
import ChatBox from "../../components/ChatBox";
import {
  sendAnnouncement,
  fetchAnnouncements,
} from "../../controller/RoomController";

export default (props) => {
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  const userId = props.route.params.user.userId;
  const roomId = props.route.params.room.roomId;

  const sendMessageHandler = async () => {
    try {
      var newAnnouncement = await sendAnnouncement(userId, roomId, message);
      var announcementsVar = announcements;
      announcementsVar.push(newAnnouncement);
      setMessage("");
      setAnnouncements([...announcementsVar]);
    } catch (err) {
      console.log("Error : ", err);
    }
    Keyboard.dismiss();
  };

  useEffect(() => {
    props.navigation.addListener("focus", async () => {
      try {
        var announcementsVar = await fetchAnnouncements(roomId);
      } catch (error) {
        console.log(error);
      }
      setAnnouncements([...announcementsVar]);
    });
  });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <View style={{ flex: 1 }}>
        <ScrollView style={theme.container}>
          {announcements.length !== 0 ? (
            announcements.map((announcement, index) => {
              return (
                <ChatBox
                  style={{
                    marginBottom: announcements.length - 1 === index ? 240 : 0,
                  }}
                  message={announcement.message}
                  dateTime={announcement.time} // didn't format
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
                console.log("focus!");
              }}
              onSubmitEditing={() => {
                console.log("submit!");
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
