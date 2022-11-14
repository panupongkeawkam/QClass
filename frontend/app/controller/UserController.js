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
    if (participantId) {
      if (result.jsonData.type === "quiz") {
        var myScore = await axios.get(
          `http://${config.ip}:3000/quiz/${result.jsonData.quizId}/participant/${participantId}/score`
        );
        result.jsonData.myScore = myScore.data.myScore.length <= 0 ? null : myScore.data.myScore[0].point;
      }
    }
    results.push(result.jsonData);
  }
  return results;
};

export { userInitialize, fetchResults };
