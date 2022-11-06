import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import config from "../assets/api-config";

function formatDate(dateFormat) {
  var dateTime = new Date(dateFormat);
  var now = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var date = `${(dateTime.getDate() + 1000).toString().slice(2)} ${
    monthNames[dateTime.getMonth()]
  }`;
  var time = `${(dateTime.getHours() + 1000).toString().slice(2)}:${(
    dateTime.getMinutes() + 1000
  )
    .toString()
    .slice(2)}`;
  var diffDate = now.getDate() - dateTime.getDate();
  var diffMonth = now.getMonth() - dateTime.getMonth();
  var diffYear = now.getYear() - dateTime.getYear();
  if (diffDate === 0 && diffMonth === 0 && diffYear === 0) {
    dateFormat = time;
  } else if (diffDate === 1 && diffMonth === 0 && diffYear === 0) {
    dateFormat = `Yesterday ${time}`;
  } else {
    dateFormat = `${date} ${time}`;
  }
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
  title = title.trim();
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
      room: room,
    })
    .then((res) => {
      console.log("Controller :  , when leave room is success : ", res.data);
      return res.data;
    })
    .catch((err) => {
      throw { message: err.response.data };
    });
  return leave;
};

const joinRoom = async (userId, inviteCode) => {
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
      throw { message: err.response.data };
    });
};

const fetchAnnouncements = async (roomId) => {
  var announcements = await axios
    .get(`http://${config.ip}:3000/room/${roomId}/announcement`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw { message: err.response.data };
    });
  announcements = announcements.announcements.map((announcement) => {
    var time = formatDate(announcement.createDatetime);
    return {
      time: time,
      message: announcement.message,
    };
  });
  return announcements;
};

const sendAnnouncement = async (userId, roomId, message) => {
  message = message.trim();

  var isMessageNull = message.length <= 0;

  if (isMessageNull) {
    throw { message: "Message cannot be empty`" };
  }

  var announcement = await axios
    .post(`http://${config.ip}:3000/room/${roomId}/announcement`, {
      userId: userId,
      message: message,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw { message: err.response.data };
    });
  var formatDateTime = formatDate(announcement.announcement.time);
  return {
    message: message,
    time: formatDateTime,
  };
};

export { createNewRoom, joinRoom, leaveRoom, sendAnnouncement, fetchAnnouncements };
