import React, { useState, useRef, useEffect } from "react";
import { Text, View, ScrollView, TextInput } from "react-native";
import Constants from "expo-constants";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";
import PrimaryButton from "../../components/button/PrimaryButton";
import Choice from "../../components/Choice";

export default (props) => {
  const [surveyTitle, setSurveyTitle] = useState(
    props.route.params.survey.title
  );
  const [choices, setChoices] = useState(props.route.params.survey.choices);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(-1);

  useEffect(() => {
    props.navigation.setOptions({
      title: null,
      gestureEnabled: false,
      headerShown: false,
      headerLeft: () => {
        return <></>;
      },
    });
  });

  const submitHandler = () => {
    // do something
    props.navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.base2 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[theme.container, { paddingTop: Constants.statusBarHeight }]}
      >
        <View
          style={[
            theme.blurShadow,
            { marginVertical: 8, paddingTop: 60, paddingBottom: 200 },
          ]}
        >
          <View
            style={[
              {
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderBottomWidth: 1,
                backgroundColor: color.base1,
                borderColor: color.base2,
                flexDirection: "row",
              },
            ]}
          >
            <View style={{ width: "100%" }}>
              <Text style={theme.textHeader2}>{surveyTitle}</Text>
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
            {choices.map((choice, index) => {
              return (
                <Choice
                  key={index}
                  title={choice.title}
                  isDeletable={false}
                  isCorrect={selectedChoiceIndex === index}
                  index={index}
                  onSetCorrect={() => {
                    setSelectedChoiceIndex(
                      index === selectedChoiceIndex ? -1 : index
                    );
                  }}
                  onDelete={(index) => {}}
                  onTitleChange={(newTitle) => {}}
                  isReadOnly
                />
              );
            })}
          </View>
        </View>
        {/*  */}
      </ScrollView>
      <View style={theme.tabBarContainer}>
        <View style={theme.tabBar}>
          <PrimaryButton
            backgroundColor={color.correct}
            title={"Submit"}
            onPress={submitHandler}
          />
        </View>
      </View>
    </View>
  );
};
