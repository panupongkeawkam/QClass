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
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    res.json();
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// owner start quiz
router.post("/quiz/:quizId/question", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    res.json();
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// owner start quiz
router.post("/question/:questionId/choice", async (req, res) => {
  // surveyId = null
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    res.json();
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// owner stop quiz
router.put("/quiz/:quizId", async (req, res) => {
  // { body: { state: "ended" } }
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    res.json();
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
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    res.json();
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// get all response for each question xx
router.get("/question/:questionId/response", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    res.json();
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// get all choice in question xx
router.get("/question/:questionId/choice", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    res.json();
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
    res.json();
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

exports.router = router;
