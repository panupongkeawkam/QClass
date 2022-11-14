import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  RefreshControl,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

import { theme, color } from "../../assets/theme/Theme";
import QuizResult from "../../components/QuizResult";
import Attempt from "../../components/Attempt";
import SurveyResult from "../../components/SurveyResult";
import EmptyDataLabel from "../../components/EmptyDataLabel";
import config from "../../assets/api-config";
import Loading from "../../components/Loading";
import * as Controller from "../../controller/UserController";

export default (props) => {
  const participantId = props.route.params.participantId;
  const room = props.route.params.room;

  const [results, setResults] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState("all");
  const [displayedResults, setDisplayedResults] = useState([]);

  const getResults = async () => {
    var resultsVar = await Controller.fetchResults(room.roomId, participantId);
    setResults([...resultsVar]);
    if (category === "quiz") {
      resultsVar = resultsVar.filter((result) => result.type === "quiz");
    } else if (category === "survey") {
      resultsVar = resultsVar.filter((result) => result.type === "survey");
    }
    setDisplayedResults([...resultsVar]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getResults();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    props.navigation.addListener("focus", async () => {
      setCategory("all");
      await getResults();
    });
  }, []);

  const Category = ({ isFocus, title, onSelect }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onSelect();
        }}
        style={{
          marginRight: 8,
          borderRadius: 40,
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: isFocus ? color.content4 : color.base2,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: color.content4,
          ...theme.blurShadow,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: isFocus ? color.base1 : color.content4,
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          paddingTop: 16,
          backgroundColor: color.base2,
        }}
      >
        <ScrollView horizontal={true} style={[{ flexDirection: "row" }]}>
          <View style={{ marginLeft: 24 }}>
            <Category
              isFocus={category === "all"}
              title="All"
              onSelect={() => {
                setCategory("all");
                setDisplayedResults(results);
              }}
            />
          </View>
          <Category
            isFocus={category === "quiz"}
            title="Quiz"
            onSelect={() => {
              setCategory("quiz");
              setDisplayedResults(
                results.filter((result) => result.type === "quiz")
              );
            }}
          />
          <Category
            isFocus={category === "survey"}
            title="Survey"
            onSelect={() => {
              setCategory("survey");
              setDisplayedResults(
                results.filter((result) => result.type === "survey")
              );
            }}
          />
        </ScrollView>
      </View>
      <View style={[theme.container]}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{ paddingHorizontal: 4, borderRadius: 24 }}
          showsVerticalScrollIndicator={false}
          data={displayedResults}
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
                createDate={item.createDate}
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
          ListFooterComponent={() => (
            <View style={{ marginBottom: 200 }}></View>
          )}
        />
      </View>
    </View>
  );
};
