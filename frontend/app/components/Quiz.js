import { Text, View, TouchableOpacity } from "react-native";

import { color, theme } from "../assets/theme/Theme";
import Label from "./Label";

export default (props) => {
  return (
    <TouchableOpacity
      style={theme.boxOuter}
      onPress={() => {
        props.onSelect();
      }}
    >
      <View
        style={[
          theme.boxInner,
          theme.blurShadow,
          { backgroundColor: color.base1, justifyContent: "space-between" },
        ]}
      >
        <View>
          <Text style={[theme.textHeader2]}>{props.title}</Text>
          <Text
            style={{ color: color.content4, fontSize: 12, marginBottom: 16 }}
          >
            22 October 2565
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Label
            text={
              props.questionLength === 0
                ? "No question"
                : props.questionLength === 1
                ? props.questionLength + " Question"
                : props.questionLength + " Questions"
            }
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
