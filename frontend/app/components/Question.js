import { useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../assets/theme/Theme";

export default (props) => {
  return (
    <TouchableOpacity
      style={[theme.blurShadow, { marginVertical: 8 }]}
      activeOpacity={props.untouchable ? 1 : 0.2}
      onPress={() => {
        props.onSelect();
      }}
    >
      <View
        style={[
          {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 24,
            paddingTop: 16,
            backgroundColor: color.base1,
            borderBottomWidth: 1,
            borderColor: color.base2,
            flexDirection: "row",
          },
        ]}
      >
        <View style={{ width: "90%" }}>
          <Text style={theme.textHeader2}>{props.title}</Text>
        </View>
        <View style={{ width: "10%", alignItems: "flex-end" }}>
          <Ionicons
            name={props.type === "text" ? "text" : "md-git-network-outline"}
            color={color.base4}
            size={20}
          />
        </View>
      </View>
      <View
        style={[
          {
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            paddingHorizontal: 24,
            paddingVertical: 16,
            backgroundColor: color.base1,
          },
        ]}
      >
        <View style={{ marginBottom: 12 }}>
          {props.type === "choice" ? (
            props.choices.map((choice, index) => {
              return (
                <View
                  key={index}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    marginVertical: 6,
                    borderRadius: 16,
                    flexDirection: "row",
                    backgroundColor:
                      index === parseInt(props?.correct)
                        ? color.correct
                        : color.base2,
                  }}
                >
                  <Text
                    key={index}
                    style={{
                      width: "90%",
                      fontSize: 18,
                      color:
                        index === parseInt(props.correct)
                          ? color.base1
                          : color.content4,
                    }}
                  >
                    {choice.title}
                  </Text>
                  {index === parseInt(props.correct) ? (
                    <View style={{ width: "10%", alignItems: "flex-end" }}>
                      <Ionicons
                        name={"md-checkmark"}
                        size={16}
                        color={color.base1}
                      />
                    </View>
                  ) : null}
                </View>
              );
            })
          ) : (
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 16,
                marginVertical: 4,
                borderRadius: 16,
                flexDirection: "row",
                borderColor: color.base3,
                borderWidth: 1,
              }}
            >
              <View style={{ width: "90%" }}>
                <Text
                  style={{
                    fontSize: 18,
                    colro: color.content4,
                  }}
                >
                  {props.correct}
                </Text>
              </View>
              <View style={{ width: "10%", alignItems: "flex-end" }}>
                <Ionicons
                  name={"md-checkmark"}
                  size={16}
                  color={color.correct}
                />
              </View>
            </View>
          )}
        </View>
        {!props.isSurvey ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <Ionicons name="timer-outline" size={20} color={color.base4} />
            <Text
              style={{
                marginLeft: 8,
                fontSize: 20,
                fontWeight: "bold",
                color: color.base4,
              }}
            >
              {props.timer ? props.timer + "s" : "No Limit"}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};
