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

//get available quiz in room xx
router.get("/room/:roomId/quiz", async (req, res) => {
  const roomId = req.params.roomId;
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [quiz, rows] = await conn.query(
      `SELECT *
      FROM \`Quiz\`
      WHERE \`roomId\` = ? AND \`state\` = ?`,
      [roomId, "attempting"]
    );

    await conn.commit();
    res.json({ quiz: quiz[0] });
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
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    await conn.commit();
    res.json();
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// add new score for quiz xx (do when submit)
router.post("/quiz/:quizId/score", async (req, res) => {
  // { body: { participantId } }
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    await conn.commit();
    res.json();
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
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    await conn.commit();
    res.json();
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

exports.router = router;
