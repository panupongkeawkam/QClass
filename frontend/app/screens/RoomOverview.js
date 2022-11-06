import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import Constants from "expo-constants";
import axios from "axios";

import { theme, color } from "../assets/theme/Theme";
import Room from "../components/Room";
import CreateRoomModal from "../components/modals/CreateRoomModal";
import CreatorButton from "../components/button/CreatorButton";
import EmptyDataLabel from "../components/EmptyDataLabel";

import { userInitialize } from "../controller/UserController";
import config from "../assets/api-config";

export default (props) => {
  // const data = [];
  const [ownRoom, setOwnRoom] = useState([]);
  const [joinedRoom, setJoinedRoom] = useState([]);
  const [createRoomModalVisible, setCreateRoomModalVisible] = useState(false);
  const [user, setUser] = useState({});

  const selectOwnRoomHandler = (room, index) => {
    // เปิดหน้า QuestionOverview พร้อมกับดึงข้อมูลไปแสดง
    props.navigation.navigate("OwnerRoomTabsNavigator", {
      room: room,
      user: user
    });
  };

  const fetchRooms = async (userId) => {
    if (userId) {
      var newOwnRooms = await axios
        .get(`http://${config.ip}:3000/user/${userId}/room`)
        .then((res) => res.data.rooms)
        .catch((err) => console.error(err));
      var newJoinedRooms = await axios
        .get(`http://${config.ip}:3000/participant/${userId}/room`)
        .then((res) => res.data.rooms)
        .catch((err) => console.error(err));
      setOwnRoom(newOwnRooms);
      setJoinedRoom(newJoinedRooms);
    }
  };

  useEffect(() => {
    //fetchUser
    async function userInitial() {
      var userVar = await userInitialize();
      setUser(userVar);
    }
    userInitial();
  }, []);

  useEffect(() => {
    props.navigation.addListener("focus", () => {
      fetchRooms(user.userId);
    });
    fetchRooms(user.userId);
  }, [user]);

  const selectMyRoomHandler = (room, index) => {
    // เปิดหน้า QuestionOverview พร้อมกับดึงข้อมูลไปแสดง
    props.navigation.navigate("ParticipantRoomTabsNavigator", {
      roomTitle: room.title,
      room: room,
      user: user,
    });
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRooms(user.userId);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.base2,
        paddingTop: Constants.statusBarHeight,
      }}
    >
      <ScrollView
        style={[theme.container]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <CreateRoomModal
          visible={createRoomModalVisible}
          user={user}
          onCreateRoom={(newRoom) => {
            setOwnRoom((currentRoom) => {
              currentRoom.push(newRoom);
              return currentRoom;
            });
          }}
          close={() => {
            setCreateRoomModalVisible(false);
          }}
        />
        <Text style={theme.textLabel}>MY ROOM</Text>
        <View style={[theme.boxContainer]}>
          <CreatorButton
            title="Create Room"
            onCreate={() => {
              setCreateRoomModalVisible(true);
            }}
          />
          {ownRoom.length > 0 ? (
            ownRoom.map((room, index) => (
              <Room
                room={room}
                onSelect={() => {
                  selectOwnRoomHandler(room, index);
                }}
                key={index}
              />
            ))
          ) : (
            <EmptyDataLabel title={"No room"} isSmall />
          )}
        </View>
        <Text style={theme.textLabel}>JOINED ROOM</Text>
        <View style={[theme.boxContainer, { paddingBottom: 200 }]}>
          {joinedRoom.length > 0 ? (
            joinedRoom.map((room, index) => (
              <Room
                room={room}
                onSelect={() => {
                  selectMyRoomHandler(room, index);
                }}
                key={index}
              />
            ))
          ) : (
            <EmptyDataLabel title={"No room"} isSmall />
          )}
        </View>
      </ScrollView>
    </View>
  );
};
