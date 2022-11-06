import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import config from "../assets/api-config"

function formatDate(dateFormat) {
  var dateTime = new Date(dateFormat);
  var date = `${dateTime.getFullYear()}-${(dateTime.getMonth() + 1 + 1000)
    .toString()
    .slice(2)}-${(dateTime.getDate() + 1000).toString().slice(2)}`;
  var time = `${(dateTime.getHours() + 1000).toString().slice(2)}:${(
    dateTime.getMinutes() + 1000
  )
    .toString()
    .slice(2)}:${(dateTime.getSeconds() + 1000).toString().slice(2)}`;
  dateFormat = `${date} ${time}`;
  return dateFormat;
}

function inviteCodeGenerator() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const createNewRoom = async (userId, title, iconName) => {
  //Variables
  var inviteCode = inviteCodeGenerator();
  title = title.trim()
  var newRoom = await axios
    .post(`http://${config.ip}:3000/user/${userId}/room`, {
      room: {
        title: title,
        iconName: iconName,
        inviteCode: inviteCode,
        member: 0,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
    });
  return newRoom;
};
const leaveRoom = async (userId, room) => {
  var leave = await axios
  .put(`http://${config.ip}:3000/participant/${userId}`, {
    room: room
  }).then((res) => {
    console.log(res.data);
    return res.data
  })
  .catch((err) => {
    throw {message : err.response.data}
  });
  return leave
}
const joinRoom = async (userId, inviteCode) => {
  console.log("Controller : ", userId)
  inviteCode = inviteCode.trim();

  var isNullInviteCode = inviteCode.length <= 0;

  if (isNullInviteCode) {
    throw { message: "Invite code cannot be empty" };
  }

  var newJoinedRoom = await axios
    .post(`http://${config.ip}:3000/user/${userId}/participant`, {
      inviteCode: inviteCode,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw {message : err.response.data}
    });
};

export { createNewRoom, joinRoom, leaveRoom };
