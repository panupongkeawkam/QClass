import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import Constants from "expo-constants";
import axios from "axios";

import { theme, color } from "../assets/theme/Theme";
import Room from "../components/Room";
import CreateRoomModal from "../components/modals/CreateRoomModal";
import HeaderButton from "../components/button/HeaderButton";
import EmptyDataLabel from "../components/EmptyDataLabel";

import { userInitialize } from "../controller/UserController";
import config from "../assets/api-config";

export default (props) => {
  const [ownedRoom, setOwnedRoom] = useState([]);
  const [joinedRoom, setJoinedRoom] = useState([]);
  const [createRoomModalVisible, setCreateRoomModalVisible] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(true);
  const [category, setCategory] = useState("joined");
  const [user, setUser] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchJoinedRooms = async (userId) => {
    if (userId) {
      var newJoinedRooms = await axios
        .get(`http://${config.ip}:3000/participant/${userId}/room`)
        .then((res) => res.data.rooms)
        .catch((err) => console.error(err));
      setJoinedRoom(newJoinedRooms);
    }
  };

  const fetchOwnedRooms = async (userId) => {
    if (userId) {
      var newOwnedRooms = await axios
        .get(`http://${config.ip}:3000/user/${userId}/room`)
        .then((res) => res.data.rooms)
        .catch((err) => console.error(err));
      setOwnedRoom(newOwnedRooms);
    }
  };

  const fetchRoomsByCategory = async (userId) => {
    if (category === "joined") {
      await fetchJoinedRooms(userId);
    } else if (category === "owned") {
      await fetchOwnedRooms(userId);
    }
  };

  useEffect(() => {
    async function userInitial() {
      var userVar = await userInitialize();
      setUser(userVar);
    }
    userInitial();
  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          style={{ marginRight: 12 }}
          title={"Room"}
          onPress={() => {
            setCreateRoomModalVisible(true);
          }}
          iconName="add"
        />
      ),
    });

    props.navigation.addListener("focus", async () => {
      await fetchRoomsByCategory(user.userId);
    });
    fetchRoomsByCategory(user.userId);
  }, [user]);

  const selectJoinedRoomHandler = async (room, index) => {
    // เปิดหน้า QuestionOverview พร้อมกับดึงข้อมูลไปแสดง

    const fetchParticipantId = async () => {
      const participantIdVar = await axios.get(
        `http://${config.ip}:3000/user/${user.userId}/room/${room.roomId}/participant`
      );
      return participantIdVar.data.participantId;
    };

    const participantId = await fetchParticipantId();

    props.navigation.navigate("ParticipantRoomTabsNavigator", {
      room: room,
      user: user,
      participantId: participantId,
    });
  };

  const selectOwnedRoomHandler = (room, index) => {
    // เปิดหน้า QuestionOverview พร้อมกับดึงข้อมูลไปแสดง
    props.navigation.navigate("OwnerRoomTabsNavigator", {
      room: room,
      user: user,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRoomsByCategory(user.userId);

    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const Category = ({ isFocus, title, onSelect }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onSelect();
        }}
        style={{
          marginRight: 8,
          borderRadius: 40,
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: isFocus ? color.content4 : color.base2,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: color.content4,
          ...theme.blurShadow,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: isFocus ? color.base1 : color.content4,
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const GetStarted = () => {
    return (
      <View style={{ padding: 10, width: "100%" }}>
        <View
          style={[
            theme.blurShadow,
            {
              borderTopRightRadius: 24,
              borderBottomRightRadius: 24,
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
              paddingVertical: 16,
              paddingHorizontal: 24,
              backgroundColor: color.primaryTransparent,
              paddingBottom: 48,
              borderLeftWidth: 4,
              borderColor: color.primary,
            },
          ]}
        >
          <Text style={[theme.textHeader2, { color: color.primary }]}>
            Get Started
          </Text>
          <Text
            style={[
              {
                color: color.primary,
                fontSize: 18,
              },
            ]}
          >
            Join Room to start an activity!
          </Text>
        </View>
      </View>
    );
  };

  const renderJoinedRoom = ({ item, index }) => {
    return (
      <Room
        room={item}
        onSelect={() => {
          selectJoinedRoomHandler(item, index);
        }}
      />
    );
  };

  const renderOwnedRoom = ({ item, index }) => {
    return (
      <Room
        room={item}
        onSelect={() => {
          selectOwnedRoomHandler(item, index);
        }}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.base2,
      }}
    >
      <View style={[theme.container]}>
        <View style={{ paddingHorizontal: 10, marginBottom: 16 }}>
          <ScrollView
            horizontal={true}
            style={[{ flexDirection: "row", borderRadius: 20 }]}
          >
            <Category
              isFocus={category === "joined"}
              title="Joined"
              onSelect={() => {
                setCategory("joined");
                fetchJoinedRooms(user.userId);
              }}
            />
            <Category
              isFocus={category === "owned"}
              title="Owned"
              onSelect={() => {
                setCategory("owned");
                fetchOwnedRooms(user.userId);
              }}
            />
          </ScrollView>
        </View>
        <View style={{ width: "100%" }}>
          <CreateRoomModal
            visible={createRoomModalVisible}
            user={user}
            onCreateRoom={(newRoom) => {
              setCategory("owned");
              setOwnedRoom((currentRoom) => {
                currentRoom.splice(0, 0, newRoom);
                return currentRoom;
              });
            }}
            close={() => {
              setCreateRoomModalVisible(false);
            }}
          />
          {category === "joined" ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={joinedRoom}
              initialNumToRender={4}
              key={"joined"}
              renderItem={renderJoinedRoom}
              keyExtractor={(room) => room.roomId}
              ListEmptyComponent={() => <GetStarted />}
              ListFooterComponent={() => (
                <View style={{ marginBottom: 200 }}></View>
              )}
            />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={ownedRoom}
              initialNumToRender={4}
              key={"owned"}
              numColumns={2}
              renderItem={renderOwnedRoom}
              keyExtractor={(room) => room.roomId}
              ListEmptyComponent={() => (
                <EmptyDataLabel
                  title={"No Created Room"}
                  description={
                    "Use create room button on the top right of this page"
                  }
                />
              )}
              ListFooterComponent={() => (
                <View style={{ marginBottom: 200 }}></View>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
};
