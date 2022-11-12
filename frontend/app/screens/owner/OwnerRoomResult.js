import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import axios from "axios";

import { theme, color } from "../../assets/theme/Theme";

import QuizResult from "../../components/QuizResult";
import config from "../../assets/api-config";
import SurveyResult from "../../components/SurveyResult";

export default (props) => {
  const roomId = props.route.params.room.roomId;
  const [results, setResults] = useState([]);

  const fetchAllResult = async () => {
    var allResult = await axios.get(
      `http://${config.ip}:3000/room/${roomId}/result`
    );
    setResults(allResult.data);
  };

  useEffect(() => {
    props.navigation.addListener("focus", async () => {
      fetchAllResult();
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={theme.container}>
        {results.map((result, index) =>
          result.jsonData.type === "quiz" ? (
            <QuizResult
              key={index}
              quizTitle={result.jsonData.quizTitle}
              questionLength={result.jsonData.questionLength}
              fullScore={result.jsonData.fullScore}
              minScore={result.jsonData.minScore}
              meanScore={result.jsonData.averageScore}
              maxScore={result.jsonData.maxScore}
              createDate={result.jsonData.createDate}
            />
          ) : (
            <SurveyResult
            key={index}
            surveyTitle={result.jsonData.surveyTitle}
            createDate={result.jsonData.createDate}
            choices={result.jsonData.choices}
            />
          )
        )}
      </ScrollView>
    </View>
  );
};
