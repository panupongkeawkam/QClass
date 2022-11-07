import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

import { theme, color } from "../../assets/theme/Theme";

import QuizResult from "../../components/QuizResult";

export default (props) => {
  const [results, setResults] = useState([
    {
      type: "quiz",
      quizTitle: "Why are you running ajdsahfkhsadfhaslkdfhkjsdhfkjsdhf",
      questionLength: 10,
      fullScore: 10,
      minScore: 2,
      meanScore: 7.5,
      maxScore: 9,
      createDate: "22 October 2565 19:30",
    },
  ]);

  useEffect(() => {
    props.navigation.addListener("focus", async () => {
    });
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={theme.container}>
        <Text style={theme.textLabel}>FINISHED QUIZ</Text>
        {results.map((result, index) =>
          result.type === "quiz" ? (
            <QuizResult
              key={index}
              quizTitle={result.quizTitle}
              questionLength={result.questionLength}
              fullScore={result.fullScore}
              minScore={result.minScore}
              meanScore={result.meanScore}
              maxScore={result.maxScore}
              createDate={result.createDate}
            />
          ) : (
            <View key={index}>
              <Text>This result type survey</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};
