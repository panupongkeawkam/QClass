import React, { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, modalTheme, color } from "../../assets/theme/Theme";
import { createQuiz } from "../../controller/QuizController";
import SecondaryButton from "../button/SecondaryButton";

export default (props) => {
  const [quizName, setQuizName] = useState("");

  const confirmHandler = async () => {
    try {
      let newQuiz = await createQuiz(quizName);
      props.onCreatedQuiz(newQuiz);
      props.close();
      setQuizName("");
    } catch (error) {
      setQuizName("");
      Alert.alert("", error.message, [{ text: "Retry", style: "cancel" }]);
    }
  };

  return (
    <View style={modalTheme.centeredView}>
      <Modal transparent={true} animationType={"fade"} visible={props.visible}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="height"
          keyboardVerticalOffset={-(Dimensions.get("window").height * 0.25)}
        >
          <View
            style={[
              modalTheme.centeredView,
              { height: Dimensions.get("window").height },
            ]}
          >
            <View style={modalTheme.modalView}>
              <View style={modalTheme.header}>
                <Text style={modalTheme.textHeader}>Create Quiz</Text>
                <TouchableOpacity
                  onPress={() => {
                    setQuizName("");
                    props.close();
                  }}
                >
                  <Ionicons name="ios-close" size={28} />
                </TouchableOpacity>
              </View>
              <TextInput
                autoFocus={true}
                maxLength={20}
                placeholderTextColor={color.base3}
                style={theme.textInput}
                value={quizName}
                placeholder="Quiz name"
                onChangeText={(newValue) => {
                  setQuizName(() => newValue);
                }}
              />
              <SecondaryButton
                disabled={!quizName?.trim()}
                title="Confirm"
                onPress={() => {
                  confirmHandler();
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};
