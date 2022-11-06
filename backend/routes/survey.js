const express = require("express");
const pool = require("../config");

router = express.Router();

// owner start survey
router.post("/survey", async (req, res) => {
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

// owner start survey
router.post("/survey/:surveyId/choice", async (req, res) => {
  // questionId = null
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

// owner stop survey
router.put("/survey/:surveyId", async (req, res) => {
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

exports.router = router;
