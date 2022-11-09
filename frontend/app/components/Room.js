import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { color, theme } from "../assets/theme/Theme";
import Label from "./Label";

export default (props) => {
  const colorOfIcons = {
    "ios-musical-notes": { primary: "#ff8f85", secondary: "#ffecec" },
    "ios-flask": { primary: "#ca97d4", secondary: "#f9eef8" },
    "game-controller": { primary: "#c48bd3", secondary: "#f6ebf8" },
    "ios-camera": { primary: "#70b5d9", secondary: "#e8f2f8" },
    "document-text": { primary: "#75c2ee", secondary: "#e9f5fc" },
    "ios-earth": { primary: "#4cdbc2", secondary: "#e5f8f6" },
    "pie-chart": { primary: "#5fd39c", secondary: "#e7f6ef" },
    "ios-fast-food": { primary: "#fbdc59", secondary: "#fff9e7" },
    "ios-baseball": { primary: "#ffc15f", secondary: "#fef5e5" },
    "color-palette": { primary: "#f19458", secondary: "#fceee5" },
  };

  return (
    <TouchableOpacity
      style={[theme.boxOuter, theme.blurShadow]}
      onPress={() => {
        props.onSelect();
      }}
    >
      <View
        style={[
          theme.boxInner,
          {
            backgroundColor: color.base1,
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          {!props.room.iconName || (
            <View
              style={{
                paddingVertical: 4,
                paddingHorizontal: 6,
                borderRadius: 8,
                marginBottom: 12,
                backgroundColor: colorOfIcons[props.room.iconName]?.secondary,
              }}
            >
              <Ionicons
                name={props.room.iconName}
                size={32}
                color={colorOfIcons[props.room.iconName]?.primary}
              />
            </View>
          )}
          <Text
            style={[theme.textHeader2, { marginLeft: 4, textAlign: "center" }]}
            numberOfLines={2}
          >
            {props.room.title}
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <Label
              style={{ marginRight: 0 }}
              text={
                props.room.member === 0
                  ? "No member"
                  : props.room.member + " Member"
              }
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
