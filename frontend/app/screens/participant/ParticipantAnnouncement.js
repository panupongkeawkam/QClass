import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import { theme, color } from "../../assets/theme/Theme";
import EmptyDataLabel from "../../components/EmptyDataLabel";
import ChatBox from "../../components/ChatBox";

export default (props) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const data = [
    {
      message: "Just take a break for 15 minutes",
      time: "12:40",
    },
    { message: "See ya!", time: "Yesterday 15:07" },
  ];

  return (
    <ScrollView
      style={[theme.container]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {data.length !== 0 ? (
        data.map((d, index) => {
          return (
            <ChatBox
              style={{ marginBottom: data.length - 1 === index ? 240 : 0 }}
              message={d.message}
              dateTime={d.time} // didn't format
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
