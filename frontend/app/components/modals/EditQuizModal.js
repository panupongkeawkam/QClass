import {
  Alert,
  Modal,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons, EvilIcons } from "react-native-vector-icons";

import { theme, modalTheme, color } from "../../assets/theme/Theme";
import SecondaryButton from "../button/SecondaryButton";

import { editQuizName } from "../../controller/QuizController";

export default (props) => {
  const [editQuizModalVisible, setEditQuizModalVisible] = useState(false);
  const [title, setTitle] = useState(props.title);

  const confirmHandler = async () => {
    try {
      let newTitleDetail = await editQuizName(title, props.title);
      props.onEditQuiz(newTitleDetail);
      setEditQuizModalVisible((current) => !current);
    } catch (error) {
      Alert.alert(error.message, "", [{ text: "Retry", style: "cancel" }]);
    }
  };

  return (
    <View>
      <View style={modalTheme.centeredView}>
        <Modal
          transparent={true}
          animationType={"fade"}
          visible={editQuizModalVisible}
        >
          <KeyboardAwareScrollView
            style={{
              flex: 1,
            }}
            extraHeight={Dimensions.get("window").height * 0.25}
          >
            <View
              style={[
                modalTheme.centeredView,
                { height: Dimensions.get("window").height },
              ]}
            >
              <View style={modalTheme.modalView}>
                <View style={modalTheme.header}>
                  <Text style={modalTheme.textHeader}>Edit Quiz</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setTitle((current) => props.title);
                      setEditQuizModalVisible(false);
                    }}
                  >
                    <Ionicons name="ios-close" size={28} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  autoFocus={true}
                  maxLength={20}
                  placeholderTextColor={color.base3}
                  value={title}
                  style={theme.textInput}
                  placeholder="New quiz name"
                  onChangeText={(text) => setTitle((current) => text)}
                />
                <SecondaryButton
                  disabled={!title?.trim()}
                  title={"Confirm"}
                  onPress={confirmHandler}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Modal>
      </View>
      <TouchableOpacity
        onPress={() => {
          setEditQuizModalVisible(true);
        }}
        style={{
          backgroundColor: "#eee",
          borderRadius: "50%",
          width: 32,
          height: 32,
          ...theme.centered,
          ...theme.blurShadow,
        }}
      >
        <EvilIcons name="pencil" size={28} color={color.base4} />
      </TouchableOpacity>
    </View>
  );
};
