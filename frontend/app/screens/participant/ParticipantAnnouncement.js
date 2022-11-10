import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { theme, color } from "../../assets/theme/Theme";
import EmptyDataLabel from "../../components/EmptyDataLabel";
import ChatBox from "../../components/ChatBox";
import { fetchAnnouncements } from "../../controller/RoomController";

export default (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const roomId = props.route.params.room.roomId;

  const fetchAnnouncementsData = async () => {
    try {
      var announcementsVar = await fetchAnnouncements(roomId);
    } catch (error) {
      Alert.alert("", error.message, [{ text: "Retry", style: "cancel" }]);
    }
    setAnnouncements([...announcementsVar]);
  };

  useEffect(() => {
    props.navigation.addListener("focus", () => {
      fetchAnnouncementsData();
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnnouncementsData();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  return (
    <ScrollView
      style={[theme.container]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {announcements.length !== 0 ? (
        announcements.map((announcement, index) => {
          return (
            <ChatBox
              style={{
                marginBottom: announcements.length - 1 === index ? 240 : 0,
              }}
              message={announcement.message}
              dateTime={announcement.time} // didn't format
              key={index}
            />
          );
        })
      ) : (
        <EmptyDataLabel title="No Announcement" />
      )}
    </ScrollView>
  );
};
