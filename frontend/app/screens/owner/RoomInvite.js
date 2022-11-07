import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import * as Clipboard from "expo-clipboard";

import { theme, color } from "../../assets/theme/Theme";

export default (props) => {
  const QRCode = `https://quickchart.io/qr?text=${props.route.params.roomCode}Roti&ecLevel=H&size=1080`;

  useEffect(() => {
    props.navigation.setOptions({
      title: null,
    });
  });

  const copyHandler = async () => {
    await Clipboard.setStringAsync(props.route.params.roomCode);
    Alert.alert("Copy room code to clipboard");
  };

  return (
    <View style={[theme.container, theme.centered]}>
      <Image
        style={{
          width: Dimensions.get("window").width * 0.8,
          height: Dimensions.get("window").width * 0.8,
          maxWidth: 360,
          borderRadius: 32,
          resizeMode: "contain",
        }}
        source={{ uri: QRCode }}
        loadingIndicatorSource={{ uri: "https://i.gifer.com/8EeP.gif" }}
      />
      <TouchableOpacity
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 20,
          marginVertical: 32,
          borderWidth: 1,
          borderColor: color.base3,
          borderRadius: 24,
          width: Dimensions.get("window").width * 0.8,
          maxWidth: 360,
          flexDirection: "row",
        }}
        onPress={copyHandler}
      >
        <Ionicons
          name="clipboard-outline"
          size={32}
          style={{ opacity: 0 }}
          color={color.content2}
        />
        <Text
          style={[theme.textHeader2, { fontWeight: "500", marginBottom: 0 }]}
        >
          {props.route.params.roomCode}
        </Text>
        <Ionicons name="clipboard-outline" size={24} color={color.content2} />
      </TouchableOpacity>
    </View>
  );
};
