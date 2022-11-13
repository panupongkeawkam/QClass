import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

import { theme, color } from "../../assets/theme/Theme";

import QuizResult from "../../components/QuizResult";
import config from "../../assets/api-config";
import SurveyResult from "../../components/SurveyResult";
import EmptyDataLabel from "../../components/EmptyDataLabel";

export default (props) => {
  const roomId = props.route.params.room.roomId;

  const [results, setResults] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState("all");
  const [displayedResults, setDisplayedResults] = useState([]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllResult();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const fetchAllResult = async () => {
    var allResult = await axios.get(
      `http://${config.ip}:3000/room/${roomId}/result`
    );
    setResults(allResult.data);
    setDisplayedResults(allResult.data);
  };

  useEffect(() => {
    props.navigation.addListener("focus", async () => {
      fetchAllResult();
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
                results.filter((result) => result.jsonData.type === "quiz")
              );
            }}
          />
          <Category
            isFocus={category === "survey"}
            title="Survey"
            onSelect={() => {
              setCategory("survey");
              setDisplayedResults(
                results.filter((result) => result.jsonData.type === "survey")
              );
            }}
          />
        </ScrollView>
      </View>
      <View style={theme.container}>
        <FlatList
          style={{ paddingHorizontal: 4 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={displayedResults}
          initialNumToRender={4}
          key={"results"}
          renderItem={({ item, index }) =>
            item.jsonData.type === "quiz" ? (
              <QuizResult
                quizTitle={item.jsonData.quizTitle}
                questionLength={item.jsonData.questionLength}
                fullScore={item.jsonData.fullScore}
                minScore={item.jsonData.minScore}
                meanScore={item.jsonData.averageScore}
                maxScore={item.jsonData.maxScore}
                createDate={item.jsonData.createDate}
              />
            ) : (
              <SurveyResult
                surveyTitle={item.jsonData.surveyTitle}
                createDate={item.jsonData.createDate}
                choices={item.jsonData.choices}
              />
            )
          }
          keyExtractor={(result, index) => index}
          ListEmptyComponent={() => <EmptyDataLabel title={"No Result"} />}
          ListFooterComponent={() => (
            <View style={{ marginBottom: 200 }}></View>
          )}
        />
      </View>
    </View>
  );
};
