import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import config from "../assets/api-config";

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

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

// Use for initial project
const userInitialize = async () => {
  let user = JSON.parse(await AsyncStorage.getItem("user"));
  var isNoUser = !user;
  if (isNoUser) {
    user = await axios
      .post(`http://${config.ip}:3000/user`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
      });
    user.registerDatetime = formatDate(user.registerDatetime);
    await AsyncStorage.setItem("user", JSON.stringify(user));
  }
  return user;
};

const fetchResults = async (roomId, participantId = null) => {
  const allResult = await axios.get(
    `http://${config.ip}:3000/room/${roomId}/result`
  );

  const results = [];
  for (const result of allResult.data) {
    result.createDate = timeSince(new Date(result.createDatetime));
    if (participantId) {
      if (result.type === "quiz") {
        var myScore = await axios.get(
          `http://${config.ip}:3000/quiz/${result.quizId}/participant/${participantId}/score`
        );
        result.myScore =
          myScore.data.myScore.length <= 0
            ? null
            : myScore.data.myScore[0].point;
      } else if (result.type === "survey") {
        var myAnswered = await axios.get(
          `http://${config.ip}:3000/participant/${participantId}/survey/${result.surveyId}/surveyResponse`
        );
        result.myAnswered =
          myAnswered.data.length <= 0 ? null : myAnswered.data[0].answered;
      }
    }
    results.push(result);
  }
  return results;
};

export { userInitialize, fetchResults };
