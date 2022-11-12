import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, RefreshControl, FlatList } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";
import QuizResult from "../../components/QuizResult";
import Attempt from "../../components/Attempt";
import SurveyResult from "../../components/SurveyResult";
import EmptyDataLabel from "../../components/EmptyDataLabel";
import config from "../../assets/api-config";
import Loading from "../../components/Loading";
import { fetchResults } from "../../controller/UserController";

export default (props) => {
  const participantId = props.route.params.participantId;
  const room = props.route.params.room;

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

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    props.navigation.addListener("focus", async () => {
      var resultsVar = await fetchResults(participantId, room.roomId)
      setResults([...resultsVar])
    });
  }, []);

  return (
    <View style={[theme.container]}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ paddingHorizontal: 4, borderRadius: 24 }}
        showsVerticalScrollIndicator={false}
        data={results}
        key={"results"}
        renderItem={({ item, index }) =>
          item.type === "quiz" ? (
            <QuizResult
              quizTitle={item.quizTitle}
              questionLength={item.questionLength}
              fullScore={item.fullScore}
              minScore={item.minScore}
              meanScore={item.averageScore}
              maxScore={item.maxScore}
              createDate={"22 October 2565 19:30"}
              myScore={item.myScore}
            />
          ) : (
            <SurveyResult
              surveyTitle={item.surveyTitle}
              createDate={item.createDate}
              choices={item.choices}
            />
          )
        }
        keyExtractor={(result, index) => index}
        ListEmptyComponent={() => <EmptyDataLabel title={"No Results"} />}
        ListFooterComponent={() => <View style={{ marginBottom: 200 }}></View>}
      />
    </View>
  );
};
