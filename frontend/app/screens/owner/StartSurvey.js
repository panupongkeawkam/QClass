import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import SwitchSelector from "react-native-switch-selector";

import { theme, color } from "../../assets/theme/Theme";
import Choice from "../../components/Choice";
import AddChoiceButton from "../../components/button/AddChoiceButton";
import PrimaryButton from "../../components/button/PrimaryButton";

export default (props) => {
  const [surveyTitle, setSurveyTitle] = useState("");
  const [choices, setChoices] = useState([
    {
      title: "",
      isDeletable: false,
      isCorrect: false,
    },
    {
      title: "",
      isDeletable: false,
      isCorrect: false,
    },
  ]);

  const addChoiceHandler = () => {};

  const titleChangeHandler = (newTitle, index) => {
    var choicesVar = choices;
    choicesVar[index].title = newTitle;
  };

  const deleteHandler = (index) => {};

  const startHandler = () => {
    props.onStart({
      type: "survey",
      survey: {},
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.base2 }}>
      <View style={[theme.container]}>
        <Text style={theme.textLabel}>TITLE</Text>
        <TextInput
          style={theme.textInput}
          maxLength={60}
          placeholderTextColor={color.base3}
          placeholder="Survey title"
          value={surveyTitle}
          onChangeText={(text) => {
            setSurveyTitle(text.trim());
          }}
        />
        <Text style={[theme.textLabel, { marginTop: 8 }]}>CHOICE</Text>
        <View style={{ marginBottom: 48 }}>
          {choices.map((choice, index) => {
            return (
              <Choice
                key={index}
                title={choice.title}
                isDeletable={choice.isDeletable}
                isCorrect={choice.isCorrect}
                index={index}
                onSetCorrect={() => {
                  // no correct choice
                }}
                onDelete={(index) => {
                  deleteHandler(index);
                }}
                onTitleChange={(newTitle) => {
                  titleChangeHandler(newTitle.trim(), index);
                }}
              />
            );
          })}
          <AddChoiceButton onAddChoice={addChoiceHandler} />
        </View>
      </View>
      <View style={theme.tabBarContainer}>
        <View style={theme.tabBar}>
          <PrimaryButton title={"Start Survey"} onPress={startHandler} />
        </View>
      </View>
    </View>
  );
};
