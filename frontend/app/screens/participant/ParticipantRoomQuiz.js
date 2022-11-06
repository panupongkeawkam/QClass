import React, { useState } from "react";
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

export default (props) => {
  const [attempt, setAttempt] = useState({ type: "quiz", key: "value" }); // { data } or null
  const [refreshing, setRefreshing] = useState(false);
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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const attemptHandler = () => {
    if (attempt.type === "quiz") {
      props.navigation.navigate("ParticipantAttemptingQuiz", {
        quiz: {
          title: "HID Week 7",
          questions: [
            {
              title: "ไม่เข้าใจจริงๆ เล๊ย",
              correct: "2",
              timer: 0,
              choices: [
                {
                  title: "ทั้งเด็ก",
                  index: 0,
                },
                {
                  title: "ทั้งผู้ใหญ่",
                  index: 1,
                },
                {
                  title: "ตะโกนหา",
                  index: 2,
                },
                {
                  title: "สรรหา",
                  index: 3,
                },
                {
                  title: "สรรหา",
                  index: 3,
                },
                {
                  title: "สรรหา",
                  index: 3,
                },
                {
                  title: "สรรหา",
                  index: 3,
                },
                {
                  title: "สรรหา",
                  index: 3,
                },
              ],
              type: "choice",
            },
            {
              title: "ไม่เข้าใจจริงๆ เล๊ย 2",
              correct: "1",
              timer: 0,
              choices: [
                {
                  title: "ทั้งเด็ก",
                  index: 0,
                },
                {
                  title: "fasfasfasf",
                  index: 1,
                },
                {
                  title: "ตะโกนหา",
                  index: 2,
                },
              ],
              type: "choice",
            },
            {
              title: "ครูบาอาจารย์มึงช่วยไรได้",
              correct: "ไอ่เหี้ยยย",
              timer: 20,
              choices: null,
              type: "text",
            },
            {
              title: "ครูบาอาจารย์มึงช่วยไรได้ 2",
              correct: "ไอ่เหี้ยยย",
              timer: 19,
              choices: null,
              type: "text",
            },
          ],
        },
        questionIndex: 0,
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
            attemptTitle={"HID Week 7"}
            questionLength={10}
            onAttempt={() => {
              Alert.alert(`Start Attempting "${"HID Week 7"}" Quiz?`, "", [
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
  );
};
