import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { color, theme } from "../assets/theme/Theme";
import Label from "./Label";

export default (props) => {
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
          { backgroundColor: color.base1, justifyContent: "space-between" },
        ]}
      >
        <Ionicons name={props.room.iconName} size={24} color={color.base3} />
        <View>
          <Text
            style={[theme.textHeader2, { marginLeft: 4 }]}
            numberOfLines={2}
          >
            {props.room.title}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Label
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
