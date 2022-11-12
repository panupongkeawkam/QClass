const { json } = require("body-parser");
const express = require("express");
const pool = require("../config");

router = express.Router();

// get all quiz
router.get("/quiz", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const quiz = await conn.query(
      `SELECT *
        FROM Quiz`,
      []
    )[0];

    res.json({ quiz: quiz });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }

  return;
});

// owner start quiz
router.post("/quiz", async (req, res) => {
  const title = req.body.quiz.title;
  const questionLength = req.body.quiz.questionLength;
  const roomId = req.body.roomId;

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [quiz, rows1] = await conn.query(
      `INSERT INTO Quiz (\`roomId\`, \`title\`, \`questionLength\`, \`createDatetime\`, \`state\`)
      VALUES (?, ?, ?, NOW(), ?)`,
      [roomId, title, questionLength, "attempting"]
    );

    await conn.commit();
    res.status(200).json({ quizId: quiz.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

router.post("/survey", async (req, res) => {
  const roomId = req.body.roomId;
  const title = req.body.title;

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [survey, rows] = await conn.query(
      `INSERT INTO \`Survey\`
      (roomId, \`title\`, createDatetime, \`state\`)
      VALUES(?, ?, NOW(), ?)`,
      [roomId, title, "attempting"]
    );

    await conn.commit();
    res.json({ surveyId: survey.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

//create choice from survey xx
router.post("/survey/:surveyId/choice", async (req, res) => {
  const surveyId = req.params.surveyId;
  const questionId = req.body.questionId;
  const title = req.body.choice.title;
  const index = req.body.choice.index;

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [choice, rows] = await conn.query(
      `INSERT INTO \`Choice\` (surveyId, questionId, \`title\`, \`index\`)
      VALUES (?, ?, ?, ?)`,
      [surveyId, questionId, title, index]
    );

    await conn.commit();

    res.json({ choiceId: choice.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// owner start quiz
router.post("/quiz/:quizId/question", async (req, res) => {
  const quizId = req.params.quizId;
  const correct = req.body.question.correct;
  const timer = req.body.question.timer;
  const title = req.body.question.title;
  const type = req.body.question.type;

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [question, rows] = await conn.query(
      `INSERT INTO Question (\`quizId\`, \`title\`, \`type\`, \`timer\`, \`correct\`)
      VALUES (?, ?, ?, ?, ?)`,
      [quizId, title, type, timer, correct]
    );

    await conn.commit();
    res.status(200).json({ questionId: question.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// owner start quiz
router.post("/question/:questionId/choice", async (req, res) => {
  const questionId = req.params.questionId;
  const surveyId = req.body.surveyId;
  const title = req.body.choice.title;
  const index = req.body.choice.index;

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [choice, rows] = await conn.query(
      `INSERT INTO Choice (\`surveyId\`, \`questionId\`, \`title\`, \`index\`)
      VALUES (?, ?, ?, ?)`,
      [surveyId, questionId, title, index]
    );

    await conn.commit();
    res.status(200).json({ choiceId: choice.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// owner stop quiz
router.put("/quiz/:quizId", async (req, res) => {
  const quizId = req.params.quizId;
  const state = req.body.quiz.state;

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [quiz, rows] = await conn.query(
      `UPDATE Quiz SET \`state\` = ?
      WHERE quizId = ?`,
      [state, quizId]
    );

    await conn.commit();
    res.status(200).send("Success");
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// get all score for quiz xx
router.get("/quiz/:quizId/score", async (req, res) => {
  const quizId = req.params.quizId;
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [scores, rows] = await conn.query(
      `
    SELECT * 
    FROM \`Score\`
    WHERE quizId = ?`,
      [quizId]
    );

    console.log(scores);

    await conn.commit();
    res.json(scores);
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// create score for quiz xx (do when start)
router.post("/quiz/:quizId/score", async (req, res) => {
  // { body: { participantId } }
  const quizId = req.params.quizId;
  const participantId = req.body.participantId;
  const fullScore = req.body.questionLength;

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [score, rows] = await conn.query(
      `INSERT INTO \`Score\` (quizId, participantId, point, totalAttempting, fullScore, createDatetime)
      VALUES (?, ?, 0, 0, ?, NOW())`,
      [quizId, participantId, fullScore]
    );

    await conn.commit();
    res.json({ scoreId: score.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// put new score for quiz xx (do when next)
router.put("/quiz/:quizId/score", async (req, res) => {
  // { body: { participantId, point } }
  const quizId = req.params.quizId;
  const participantId = req.body.participantId;
  const point = req.body.point ? 1 : 0;
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [score, rows] = await conn.query(
      `UPDATE score
      SET point = point + ?
      WHERE quizId = ? AND participantId = ?`,
      [point, quizId, participantId]
    );

    const [attempting, field] = await conn.query(
      `UPDATE score
      SET totalAttempting = totalAttempting + 1
      WHERE quizId = ? AND participantId = ?`,
      [quizId, participantId]
    );

    await conn.commit();
    res.json({ scoreId: score.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// get all question in quiz xx
router.get("/quiz/:quizId/question", async (req, res) => {
  const quizId = req.params.quizId;
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [questions, rows] = await conn.query(
      `SELECT *
      FROM Question
      WHERE \`quizId\` = ?`,
      [quizId]
    );

    await conn.commit();
    res.json(questions);
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// get all response for each question xx
router.post("/question/:questionId/response", async (req, res) => {
  const questionId = req.params.questionId;
  const participantId = req.body.participantId;
  const answered = req.body.answered;
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [response, rows] = await conn.query(
      `INSERT INTO \`Response\` (\`questionId\` , \`participantId\`, \`answered\`, \`createDatetime\`)
      VALUES (?, ?, ?, NOW())`,
      [questionId, participantId, answered]
    );

    await conn.commit();
    res.status(200).json({ responseId: response.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

router.get("/survey/:surveyId/choice", async (req, res) => {
  const surveyId = req.params.surveyId;
  console.log(surveyId);
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [choices, rows] = await conn.query(
      `SELECT *
      FROM Choice
      WHERE surveyId = ?`,
      [surveyId]
    );
    await conn.commit();
    res.json(choices);
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});
// get all choice in question xx
router.get("/question/:questionId/choice", async (req, res) => {
  const questionId = req.params.questionId;
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [choices, rows] = await conn.query(
      `SELECT *
      FROM Choice
      WHERE questionId = ?`,
      [questionId]
    );

    await conn.commit();
    res.json(choices);
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// get all result (any role)
router.get("/room/:roomId/result", async (req, res) => {
  const roomId = req.params.roomId
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    
    const [results, rows] = await conn.query(
      `SELECT jsonData
      FROM \`result\`
      WHERE roomId = ?`,
      [roomId]
    )

    for (const result of results){
      result.jsonData = JSON.parse(result.jsonData)
    }

    await conn.commit();
    res.json(results)
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

router.post("/room/:roomId/result", async (req, res) => {
  const roomId = req.params.roomId;
  const jsonData = req.body.jsonData;
  const jsonDataString = JSON.stringify(req.body.jsonData);
  const now = new Date();
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [result, rows] = await conn.query(
      `INSERT INTO \`Result\` (roomId, jsonData, createDatetime)
      VALUES (?, ?, ?)`,
      [roomId, jsonDataString, now]
    );

    await conn.commit();
    res.json(jsonData);
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

router.put("/survey/:surveyId", async (req, res) => {
  const surveyId = req.params.surveyId;
  const state = "ended";

  const conn = await pool.getConnection();
  conn.beginTransaction();

  try {
    const [survey, rows] = await conn.query(
      `UPDATE \`Survey\`
      SET \`state\` = ?
      WHERE surveyId = ?`,
      [state, surveyId]
    );

    await conn.commit();
    res.status(200).send("Success");
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

//add response survey
router.post("/participant/:participantId/survey/:surveyId", async (req, res) => {
  const participantId = req.params.participantId
  const index = req.body.index
  const surveyId = req.params.surveyId
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [result, rows] = await conn.query(
      `INSERT INTO \`SurveyResponse\` (participantId, surveyId, answered, createDatetime)
      VALUES (?, ?, ?, NOW())`,
      [participantId, surveyId, index]
    );
    await conn.commit();
    res.status(200).send("Insert into SurveyResponse Success");
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

//get all survey response in survey xx
router.get("/survey/:surveyId/surveyResponse/:answered", async (req, res) => {
  const surveyId = req.params.surveyId
  const answered = req.params.answered

  const conn = await pool.getConnection()
  await conn.beginTransaction()

  try{

    const [survey, rows] = await conn.query(
      `SELECT COUNT(answered) AS \`response\`
      FROM \`surveyResponse\`
      WHERE surveyId = ? and answered = ?`,
      [surveyId, answered]
    )

    console.log(survey)

    await conn.commit()
    res.json(survey[0])
  }catch(err){
    await conn.rollback()
    res.status(500).send(err)
  }finally{
    conn.release()
  }
})

exports.router = router;
