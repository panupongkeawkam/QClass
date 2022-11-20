import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Text,
  View,
  ScrollView,
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
  const [attempt, setAttempt] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [attemptAllow, setAttemptAllow] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchAvailableAttempt = async () => {
    setAttemptAllow(true)
    var quizResponse = await axios.get(
      `http://${config.ip}:3000/room/${roomId}/quiz`
    );

    if (quizResponse.data.quiz[0]) {
      var myScore = await axios.get(
        `http://${config.ip}:3000/quiz/${quizResponse.data.quiz[0].quizId}/participant/${participantId}/score`
      );

      var quiz = quizResponse.data.quiz[0];
      quiz.type = "quiz";
      setAttempt(quiz);

      if (!myScore.data.myScore.length) {
        setAttemptAllow(false);
      }

      return;
    }

    var surveyResponse = await axios.get(
      `http://${config.ip}:3000/room/${roomId}/survey`
    );

    if (surveyResponse.data[0]) {
      var mySurveyResponse = await axios.get(
        `http://${config.ip}:3000/participant/${participantId}/survey/${surveyResponse.data[0].surveyId}/surveyResponse`
      );

      var survey = surveyResponse.data[0];
      survey.type = "survey";
      setAttempt(survey);

      if (mySurveyResponse.data.length === 0) {
        setAttemptAllow(false);
      }
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
    setLoading(true);
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
      setLoading(false);
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
      setLoading(false);
      props.navigation.navigate("ParticipantAttemptingSurvey", {
        survey: {
          survey: attempt,
          choices: surveyChoices.data,
          participantId: participantId,
          roomId: roomId,
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
              disabled={attemptAllow}
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
