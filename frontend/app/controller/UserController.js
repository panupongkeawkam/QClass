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

export { userInitialize };
