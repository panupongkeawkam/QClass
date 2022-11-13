import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";
import Choice from "../../components/Choice";
import AddChoiceButton from "../../components/button/AddChoiceButton";
import PrimaryButton from "../../components/button/PrimaryButton";
import Loading from "../../components/Loading";

import * as Controller from "../../controller/QuizController";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default (props) => {
  const [surveyTitle, setSurveyTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const addChoiceHandler = () => {
    var newChoices = choices;
    newChoices.push({
      title: "",
      isDeletable: true,
      isCorrect: false,
    });
    setChoices([...newChoices]);
  };

  const titleChangeHandler = (newTitle, index) => {
    const newChoices = choices;
    newChoices[index].title = newTitle;
    setChoices([...newChoices]);
  };

  const deleteHandler = (index) => {
    var newChoices = choices;
    newChoices.splice(index, 1);
    setChoices([...newChoices]);
  };

  const startHandler = async () => {
    try {
      setIsLoading(true);
      var newSurvey = Controller.createSurvey(surveyTitle, choices);
      var survey = await Controller.onStartSurvey(
        props.route.params.room.roomId,
        newSurvey
      );

      setSurveyTitle("");
      setChoices([
        {
          title: "",
          isDeletable: false,
        },
        {
          title: "",
          isDeletable: false,
        },
      ]);

      setIsLoading(false);
      props.onStart({
        survey: survey,
        type: "survey",
      });
    } catch (error) {
      setIsLoading(false);
      Alert.alert("", error.message, [{ text: "Retry", style: "cancel" }]);
    }
  };

  return (
    <>
      <Loading active={isLoading} />
      <View style={{ flex: 1, backgroundColor: color.base2 }}>
        <View style={[theme.container]}>
          <TextInput
            style={theme.textInput}
            maxLength={60}
            placeholderTextColor={color.base3}
            placeholder="Survey title"
            onBlur={({ nativeEvent }) => {
              setSurveyTitle(nativeEvent.text);
            }}
          />
          <FlatList
            style={{ paddingHorizontal: 4 }}
            showsVerticalScrollIndicator={false}
            data={choices}
            renderItem={({ item, index }) => (
              <Choice
                isDeletable={item.isDeletable}
                index={index}
                title={item.title}
                onSetCorrect={() => {
                  // do nothing
                }}
                onDelete={(index) => {
                  deleteHandler(index);
                }}
                onTitleChange={(newTitle) => {
                  titleChangeHandler(newTitle, index);
                }}
              />
            )}
            keyExtractor={(choice, index) => index}
            ListFooterComponent={() => (
              <View style={{ paddingBottom: 240 }}>
                {choices.length < 8 ? (
                  <AddChoiceButton onAddChoice={addChoiceHandler} />
                ) : null}
              </View>
            )}
          />
        </View>
        <View style={theme.tabBarContainer}>
          <View style={theme.tabBar}>
            <PrimaryButton title={"Start Survey"} onPress={startHandler} />
          </View>
        </View>
      </View>
    </>
  );
};
