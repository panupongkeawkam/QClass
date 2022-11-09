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
import QuizResult from "../../components/QuizResult";
import Attempt from "../../components/Attempt";
import SurveyResult from "../../components/SurveyResult";
import EmptyDataLabel from "../../components/EmptyDataLabel";
import config from "../../assets/api-config";
import Loading from "../../components/Loading";

export default (props) => {
  const roomId = props.route.params.room.roomId;
  const participantId = props.route.params.participantId;
  const [attempt, setAttempt] = useState(null); // { data } or null
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([
    {
      quizId: 99999,
      type: "quiz",
      quizTitle: "Why are you running ajdsahfkhsadfhaslkdfhkjsdhfkjsdhf",
      questionLength: 10,
      fullScore: 10,
      minScore: 2,
      meanScore: 7.5,
      maxScore: 9,
      createDate: "22 October 2565 19:30",
      myScore: 10, // optional
    },
    {
      type: "survey",
      surveyId: 8888,
      surveyTitle: "ทำไมคนไทยรุ่นใหม่ไม่อยากมีลูก?",
      createDate: "23 October 2565 19:30",
      choices: [
        {
          title: "รัฐบาลห่วยแตก",
          response: 50,
        },
        {
          title: "ค่านิยมต่างชาติ",
          response: 1,
        },
        {
          title: "Mindset เปลี่ยนไป",
          response: 0,
        },
        {
          title: "ประยุทธ์โง่",
          response: 287,
        },
      ],
    },
  ]);

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
    setAttempt(null);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAvailableAttempt();
    setRefreshing(false);
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
      props.navigation.navigate("ParticipantAttemptingSurvey", {
        survey: {
          title: "What T-shirt color would you like?",
          choices: [{ title: "Black" }, { title: "Pink" }],
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
          <Text style={theme.textLabel}>AVAILABLE QUIZ</Text>
          {attempt ? (
            <Attempt
              type={attempt.type}
              attemptTitle={attempt.title}
              questionLength={attempt.questionLength}
              onAttempt={() => {
                Alert.alert(`Start Attempting "${attempt.title}" Quiz?`, "", [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Confirm",
                    style: "destructive",
                    onPress: () => {
                      attemptHandler();
                      // props.navigation.navigate("OwnerQuizResult", {});
                    },
                  },
                ]);
              }}
            />
          ) : (
            <EmptyDataLabel title={"No Quiz Available Now"} isSmall />
          )}
          <Text style={theme.textLabel}>FINISHED QUIZ</Text>

          {results.map((result, index) => (
            <View
              key={index}
              style={{ marginBottom: index === results.length - 1 ? 200 : 0 }}
            >
              {result.type === "quiz" ? (
                <QuizResult
                  quizTitle={result.quizTitle}
                  questionLength={result.questionLength}
                  fullScore={result.fullScore}
                  minScore={result.minScore}
                  meanScore={result.meanScore}
                  maxScore={result.maxScore}
                  createDate={"22 October 2565 19:30"}
                  myScore={result.myScore}
                />
              ) : (
                <SurveyResult
                  surveyTitle={result.surveyTitle}
                  createDate={result.createDate}
                  choices={result.choices}
                />
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
};
