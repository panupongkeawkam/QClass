import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
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

  const scrollView = useRef(null);

  const userId = props.route.params.user.userId;
  const roomId = props.route.params.room.roomId;

  const sendMessageHandler = async () => {
    if (!message.trim()) {
      return;
    }

    try {
      var newAnnouncement = await sendAnnouncement(userId, roomId, message);
      var announcementsVar = announcements;
      announcementsVar.push(newAnnouncement);
      setMessage("");
      setAnnouncements([...announcementsVar]);
    } catch (error) {
      Alert.alert(error.message, "", [{ text: "Retry", style: "cancel" }]);
    }
    Keyboard.dismiss();
  };

  useEffect(() => {
    props.navigation.addListener("focus", async () => {
      try {
        var announcementsVar = await fetchAnnouncements(roomId);
      } catch (error) {
        Alert.alert(error.message, "", [{ text: "Retry", style: "cancel" }]);
      }
      setAnnouncements([...announcementsVar]);
    });
  });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <View style={{ flex: 1 }}>
        <ScrollView ref={scrollView} style={theme.container}>
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
            />
            <TouchableOpacity
              activeOpacity={message.trim() ? 0.2 : 1}
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
                color={message.trim() ? color.secondary : color.base3}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
