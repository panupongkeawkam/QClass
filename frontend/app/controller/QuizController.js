import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import config from "../assets/api-config";

function formatDate(dateFormat) {
  var dateTime = new Date(dateFormat);
  var date = `${dateTime.getFullYear()}-${(dateTime.getMonth() + 1 + 1000)
    .toString()
    .slice(2)}-${(dateTime.getDate() + 1000).toString().slice(2)}`;
  var time = `${(dateTime.getHours() + 1000).toString().slice(2)}:${(
    dateTime.getMinutes() + 1000
  )
    .toString()
    .slice(2)}:${(dateTime.getSeconds() + 1000).toString().slice(2)}`;
  dateFormat = `${date} ${time}`;
  return dateFormat;
}

//need to apply auto refreshing
const createQuiz = async (newTitle) => {
  //Variable
  newTitle = newTitle.trim();

  // All quiz
  let quizzes = JSON.parse(await AsyncStorage.getItem("quizzes"));

  // All quiz name
  let quizNames = await quizzes.map((quiz) => quiz.title);

  // Boolean check title name
  let isUsed = await quizNames.some((title) => title === newTitle);
  let isNull = newTitle.trim().length <= 0;

  if (isNull) {
    throw { message: "Quiz title cannot be empty" };
  } else if (isUsed) {
    throw { message: "Quiz title is used" };
  } else {
    var newQuiz = {
      title: newTitle,
      questions: [],
    };
    await quizzes.push(newQuiz);
    await AsyncStorage.setItem("quizzes", JSON.stringify(quizzes));
    return newQuiz;
  }
};

const createQuestion = async (data) => {
  // Variables
  var quizTitle = data.quizTitle;
  var questionTitle = data.questionTitle.trim();
  var correct = data.correct;
  var timer = data.timer;
  var type = data.type;

  // All quizzes
  var quizzes = JSON.parse(await AsyncStorage.getItem("quizzes"));

  // Target quiz and index
  var targetQuizIndex = quizzes.findIndex((quiz) => quiz.title === quizTitle);
  var targetQuiz = quizzes[targetQuizIndex];

  // Boolean data of question
  var isNoCorrect = correct === null;

  // Question titles
  var allQuestionTitle = targetQuiz.questions.map((question) => question.title);

  // Boolean question title
  var isNullQuestionTitle = questionTitle.length <= 0;
  var isSameQuestionTitle = allQuestionTitle.some(
    (title) => title === questionTitle
  );

  if (isNullQuestionTitle) {
    throw { message: "Question title cannot be empty" };
  } else if (isSameQuestionTitle) {
    throw { message: "Question title already used in this quiz" };
  } else if (isNoCorrect) {
    throw {
      message:
        type === "choice"
          ? "No correct choice answer in this question"
          : "Answer cannot be empty",
    };
  } else {
    if (type === "choice") {
      // Variable choice titles
      var choices = data.choices.map((choice, index) => {
        return {
          title: choice.title.trim(),
          index: index,
        };
      });

      // Checking data
      var choiceNulls = choices
        .map((choice, index) => (choice.title.length <= 0 ? index : ""))
        .filter(String);
      var allChoiceTitle = data.choices.map((choice) => choice.title.trim());
      var setOfChoices = new Array(...new Set(allChoiceTitle));

      // Boolean choice
      var isChoiceNull = choiceNulls.length > 0;
      var isSameChoice = allChoiceTitle.length !== setOfChoices.length;

      if (isChoiceNull) {
        throw {
          message: "Choices title cannot be empty",
          choiceNulls: choiceNulls,
        };
      } else if (isSameChoice) {
        throw { message: "Choice cannot be same as other choice" };
      }
      var newQuestion = {
        title: questionTitle,
        correct: correct,
        timer: timer,
        choices: choices,
        type: type,
      };
      targetQuiz.questions.push(newQuestion);
      quizzes[targetQuizIndex] = targetQuiz;
      await AsyncStorage.setItem("quizzes", JSON.stringify(quizzes));
      return newQuestion;
    }
    var newQuestion = {
      title: questionTitle,
      correct: correct,
      timer: timer,
      choices: null,
      type: type,
    };
    targetQuiz.questions.push(newQuestion);
    quizzes[targetQuizIndex] = targetQuiz;
    await AsyncStorage.setItem("quizzes", JSON.stringify(quizzes));
    return newQuestion;
  }
};

const editQuizName = async (newTitle, oldTitle) => {
  let title = newTitle.trim();

  let quizzes = JSON.parse(await AsyncStorage.getItem("quizzes"));

  //All quiz name
  let quizNames = quizzes.map((quiz) => quiz.title);

  //Boolean
  let isSameWithParent = title !== oldTitle;
  let isUsed = quizNames.some((quiz) => quiz === title);
  let isNull = title.length <= 0;

  if (isNull) {
    throw { message: "Title cannot be empty" };
  } else if (isUsed && isSameWithParent) {
    throw { message: "Title is used" };
  } else {
    return title;
  }
};

const saveNewTitle = async (newTitle, oldTitle) => {
  let quizzes = JSON.parse(await AsyncStorage.getItem("quizzes"));
  let targetQuizIndex = quizzes.findIndex((quiz) => quiz.title === oldTitle);
  // let targetQuiz = quizzes.find((quiz) => quiz.title === oldTitle);
  let targetQuiz = quizzes[targetQuizIndex];

  // เวลากด Delete ตอนเปลี่ยนชื่อมันจะหาจาก Asyncstorage ไม่เจอ
  if (targetQuizIndex === -1) {
    return null;
  }

  targetQuiz.title = newTitle;
  quizzes[targetQuizIndex] = targetQuiz;
  await AsyncStorage.setItem("quizzes", JSON.stringify(quizzes));
};

const deleteQuestion = async (questions, targetIndex, quizTitle) => {
  // All quizzes
  var quizzes = JSON.parse(await AsyncStorage.getItem("quizzes"));

  // Find quiz
  var targetQuizIndex = quizzes.findIndex((quiz) => quiz.title === quizTitle);
  var targetQuiz = quizzes[targetQuizIndex];

  // Set data
  targetQuiz.questions.splice(targetIndex, 1);
  quizzes[targetQuizIndex] = targetQuiz;
  await AsyncStorage.setItem("quizzes", JSON.stringify(quizzes));

  return targetQuiz.questions;
};

const editQuestion = async (data, oldTitle, questionIndex) => {
  // Variables
  var quizTitle = data.quizTitle;
  var questionTitle = data.questionTitle.trim();
  var correct = data.correct;
  var timer = data.timer;
  var type = data.type;

  // All quizzes
  var quizzes = JSON.parse(await AsyncStorage.getItem("quizzes"));

  // Find quiz and index
  var targetQuizIndex = quizzes.findIndex((quiz) => quiz.title === quizTitle);
  var targetQuiz = quizzes[targetQuizIndex];

  // All name question title
  var allQuestionTitle = targetQuiz.questions
    .map((question) =>
      question.title.trim() !== oldTitle ? question.title.trim() : ""
    )
    .filter(String);

  // Boolean
  var isNullQuestionTitle = questionTitle.length <= 0;
  var isSameQuestionTitle = allQuestionTitle.some(
    (title) => title === questionTitle
  );
  var isNoCorrect = correct === null;

  if (isNullQuestionTitle) {
    throw { message: "Question title cannot be empty" };
  } else if (isSameQuestionTitle) {
    throw { message: "Question title already used in this quiz" };
  } else if (isNoCorrect) {
    throw {
      message:
        type === "choice"
          ? "No correct choice answer in this question"
          : "Answer cannot be empty",
    };
  } else {
    if (type === "choice") {
      var choices = data.choices.map((choice, index) => {
        return {
          title: choice.title.trim(),
          index: index,
        };
      });

      // Choices data
      var allChoiceTitle = data.choices.map((choice) => choice.title.trim());
      var setOfChoicesTitle = new Array(...new Set(allChoiceTitle));

      // Boolean
      var isChoiceNull = allChoiceTitle.some((title) => title.length <= 0);
      var isSameChoice = allChoiceTitle.length !== setOfChoicesTitle.length;

      if (isChoiceNull) {
        throw { message: "Choices title cannot be empty" };
      } else if (isSameChoice) {
        throw { message: "Choice cannot be same as other choice" };
      }
      var newQuestion = {
        title: questionTitle,
        correct: correct,
        timer: timer,
        choices: choices,
        type: type,
      };
      targetQuiz.questions[questionIndex] = newQuestion;
      quizzes[targetQuizIndex] = targetQuiz;
      await AsyncStorage.setItem("quizzes", JSON.stringify(quizzes));
      return targetQuiz.questions;
    }
    var newQuestion = {
      title: questionTitle,
      correct: correct,
      timer: timer,
      choices: null,
      type: type,
    };

    targetQuiz.questions[questionIndex] = newQuestion;
    quizzes[targetQuizIndex] = targetQuiz;
    await AsyncStorage.setItem("quizzes", JSON.stringify(quizzes));
    return targetQuiz.questions;
  }
};

const startQuiz = async (quiz, room, user) => {
  quiz.questionLength = quiz.questions.length;

  const newQuiz = await axios.post(`http://${config.ip}:3000/quiz`, {
    quiz: { questionLength: quiz.questions.length, title: quiz.title },
    roomId: room.roomId,
  });

  quiz.quizId = newQuiz.data.quizId;

  var newQuestion;
  for (const question of quiz.questions) {
    newQuestion = await axios.post(
      `http://${config.ip}:3000/quiz/${quiz.quizId}/question`,
      {
        question: {
          correct: question.correct,
          timer: question.timer,
          title: question.title,
          type: question.type,
        },
      }
    );

    question.questionId = newQuestion.data.questionId;
    question.quizId = quiz.quizId;

    if (question.type === "choice") {
      var newChoice;
      for (const choice of question.choices) {
        newChoice = await axios.post(
          `http://${config.ip}:3000/question/${question.questionId}/choice`,
          {
            choice: {
              title: choice.title,
              index: choice.index,
            },
            surveyId: null,
          }
        );

        choice.choiceId = newChoice.data.choiceId;
        choice.questionId = question.questionId;
        choice.surveyId = null;
      }
    }
  }

  return quiz;
};

export {
  createQuiz,
  createQuestion,
  formatDate,
  editQuizName,
  saveNewTitle,
  deleteQuestion,
  editQuestion,
  startQuiz,
};
