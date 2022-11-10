import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";
import Attempt from "../../components/Attempt";
import EmptyDataLabel from "../../components/EmptyDataLabel";
import config from "../../assets/api-config";
import Loading from "../../components/Loading";

export default (props) => {
  const roomId = props.route.params.room.roomId;
  const participantId = props.route.params.participantId;
  const [attempt, setAttempt] = useState(null); // { data } or null
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAvailableAttempt = async () => {
    var quizResponse = await axios.get(
      `http://${config.ip}:3000/room/${roomId}/quiz`
    );

    if (quizResponse.data.quiz[0]) {
      var myScore = await axios.get(
        `http://${config.ip}:3000/quiz/${quizResponse.data.quiz[0].quizId}/participant/${participantId}/score`
      );
      if (!myScore.data.myScore.length) {
        var quiz = quizResponse.data.quiz[0];
        quiz.type = "quiz";
        setAttempt(quiz);
        return;
      }
    }

    var surveyResponse = await axios.get(
      `http://${config.ip}:3000/room/${roomId}/survey`
    );

    if (surveyResponse.data[0]) {
      var survey = surveyResponse.data[0];
      survey.type = "survey";
      setAttempt(survey);
      return;
    }

    setAttempt(null);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAvailableAttempt();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    props.navigation.addListener("focus", async () => {
      await fetchAvailableAttempt();
    });
  }, []);

  const attemptHandler = async () => {
    if (attempt.type === "quiz") {
      await axios.post(
        `http://${config.ip}:3000/quiz/${attempt.quizId}/score`,
        {
          participantId: participantId,
          questionLength: attempt.questionLength,
        }
      );
      var questionsResponse = await axios.get(
        `http://${config.ip}:3000/quiz/${attempt.quizId}/question`
      );
      for (const question of questionsResponse.data) {
        question.choices = null;
        if (question.type === "choice") {
          question.correct = parseInt(question.correct);
          var choicesResponse = await axios.get(
            `http://${config.ip}:3000/question/${question.questionId}/choice`
          );
          question.choices = choicesResponse.data;
        }
      }
      attempt.questions = questionsResponse.data;
      props.navigation.navigate("ParticipantAttemptingQuiz", {
        quiz: attempt,
        questionIndex: 0,
        participantId: participantId,
        roomId: roomId,
      });
    } else if (attempt.type === "survey") {
      var surveyChoices = await axios.get(
        `http://${config.ip}:3000/survey/${attempt.surveyId}/choice`
      );
      props.navigation.navigate("ParticipantAttemptingSurvey", {
        survey: {
          survey: attempt,
          choices: surveyChoices.data,
          participantId: participantId,
        },
      });
    }
  };

  return (
    <>
      <Loading active={loading} />
      <View style={{ flex: 1 }}>
        <ScrollView
          style={theme.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {attempt ? (
            <Attempt
              type={attempt.type}
              attemptTitle={attempt.title}
              questionLength={attempt.questionLength}
              onAttempt={() => {
                Alert.alert("", "Are you sure to start this attempt?", [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Attempt",
                    style: "default",
                    onPress: () => {
                      attemptHandler();
                    },
                  },
                ]);
              }}
            />
          ) : (
            <EmptyDataLabel
              title={"No Attempt Available Now"}
              description={
                "If attempt is available, attempt will appear here try to pull down to refresh"
              }
            />
          )}
        </ScrollView>
      </View>
    </>
  );
};
