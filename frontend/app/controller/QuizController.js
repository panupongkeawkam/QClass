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

function formatDateForResult(dateFormat) {
  var dateTime = new Date(dateFormat);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var date = `${(dateTime.getDate() + 1000).toString().slice(2)} ${
    monthNames[dateTime.getMonth()]
  }`;
  var time = `${(dateTime.getHours() + 1000).toString().slice(2)}:${(
    dateTime.getMinutes() + 1000
  )
    .toString()
    .slice(2)}`;

  return `${date}${" " + dateTime.getFullYear()} ${time}`;
}

const createQuiz = async (newTitle) => {
  newTitle = newTitle.trim();
  let now = new Date();

  let quizzes = JSON.parse(await AsyncStorage.getItem("quizzes"));

  let quizNames = await quizzes.map((quiz) => quiz.title);

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
      createDatetime: now,
    };
    await quizzes.splice(0, 0, newQuiz);
    await AsyncStorage.setItem("quizzes", JSON.stringify(quizzes));
    return newQuiz;
  }
};

const createQuestion = async (data) => {
  var quizTitle = data.quizTitle;
  var questionTitle = data.questionTitle.trim();
  var correct = data.correct;
  var timer = data.timer;
  var type = data.type;

  var quizzes = JSON.parse(await AsyncStorage.getItem("quizzes"));

  var targetQuizIndex = quizzes.findIndex((quiz) => quiz.title === quizTitle);
  var targetQuiz = quizzes[targetQuizIndex];

  var isNoCorrect = correct === null;

  var allQuestionTitle = targetQuiz.questions.map((question) => question.title);

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
      var choices = data.choices.map((choice, index) => {
        return {
          title: choice.title.trim(),
          index: index,
        };
      });

      var choiceNulls = choices
        .map((choice, index) => (choice.title.length <= 0 ? index : ""))
        .filter(String);
      var allChoiceTitle = data.choices.map((choice) => choice.title.trim());
      var setOfChoices = new Array(...new Set(allChoiceTitle));

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

  let quizNames = quizzes.map((quiz) => quiz.title);

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
  let targetQuiz = quizzes[targetQuizIndex];

  if (targetQuizIndex === -1) {
    return null;
  }

  targetQuiz.title = newTitle;
  quizzes[targetQuizIndex] = targetQuiz;
  await AsyncStorage.setItem("quizzes", JSON.stringify(quizzes));
};

const deleteQuestion = async (questions, targetIndex, quizTitle) => {
  var quizzes = JSON.parse(await AsyncStorage.getItem("quizzes"));

  var targetQuizIndex = quizzes.findIndex((quiz) => quiz.title === quizTitle);
  var targetQuiz = quizzes[targetQuizIndex];

  targetQuiz.questions.splice(targetIndex, 1);
  quizzes[targetQuizIndex] = targetQuiz;
  await AsyncStorage.setItem("quizzes", JSON.stringify(quizzes));

  return targetQuiz.questions;
};
const createSurvey = (surveyTitle, choices) => {
  surveyTitle = surveyTitle.trim();
  var isNullSurveyTitle = surveyTitle.length <= 0;

  if (isNullSurveyTitle) {
    throw { message: "Survey title cannot be empty" };
  }

  var allChoiceTitle = choices.map((choice) => choice.title.trim());
  var setOfChoicesTitle = new Array(...new Set(allChoiceTitle));

  var isChoiceNull = allChoiceTitle.some((title) => title.length <= 0);
  var isSameChoice = allChoiceTitle.length !== setOfChoicesTitle.length;

  if (isChoiceNull) {
    throw { message: "Choices title cannot be empty" };
  } else if (isSameChoice) {
    throw { message: "Choice cannot be same as other choice" };
  }
  allChoiceTitle = allChoiceTitle.map((choice, index) => {
    return {
      title: choice,
      index: index,
    };
  });
  var newSurvey = {
    title: surveyTitle,
    choices: allChoiceTitle,
  };
  return newSurvey;
};
const editQuestion = async (data, oldTitle, questionIndex) => {
  var quizTitle = data.quizTitle;
  var questionTitle = data.questionTitle.trim();
  var correct = data.correct;
  var timer = data.timer;
  var type = data.type;

  var quizzes = JSON.parse(await AsyncStorage.getItem("quizzes"));

  var targetQuizIndex = quizzes.findIndex((quiz) => quiz.title === quizTitle);
  var targetQuiz = quizzes[targetQuizIndex];

  var allQuestionTitle = targetQuiz.questions
    .map((question) =>
      question.title.trim() !== oldTitle ? question.title.trim() : ""
    )
    .filter(String);

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

      var allChoiceTitle = data.choices.map((choice) => choice.title.trim());
      var setOfChoicesTitle = new Array(...new Set(allChoiceTitle));

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

  await axios.put(`http://${config.ip}:3000/quiz/${quiz.quizId}`, {
    quiz: {
      state: "attempting",
    },
  });

  return quiz;
};

const onStartSurvey = async (roomId, survey) => {
  var surveyId = await axios.post(`http://${config.ip}:3000/survey`, {
    roomId: roomId,
    title: survey.title,
  });
  survey.surveyId = surveyId.data.surveyId;
  for (const choice of survey.choices) {
    var newChoiceId = await axios.post(
      `http://${config.ip}:3000/survey/${surveyId.data.surveyId}/choice`,
      {
        choice: {
          title: choice.title,
          index: choice.index,
        },
        questionId: null,
      }
    );
    choice.surveyId = surveyId.data.surveyId;
    choice.choiceId = newChoiceId.data.choiceId;
  }

  return survey;
};

const getSurveyResult = async (survey) => {
  const surveyId = survey.surveyId;
  const choices = survey.choices;
  const title = survey.title;

  for (const choice of choices) {
    var newChoiceResult = await axios.get(
      `http://${config.ip}:3000/survey/${surveyId}/surveyResponse/${parseInt(
        choice.index
      )}`
    );
    choice.response = newChoiceResult.data.response;
  }

  return {
    surveyId: surveyId,
    surveyTitle: title,
    choices: choices,
    surveyId: surveyId,
  };
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
  formatDateForResult,
  createSurvey,
  onStartSurvey,
  getSurveyResult,
};
