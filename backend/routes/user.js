const express = require("express");
const pool = require("../config");

router = express.Router();

// get all user
router.get("/user/:userId", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const [users, rows] = await conn.query(
      `SELECT *
        FROM User
        WHERE ? = userId`,
      [req.params.userId]
    );

    res.send(!users[0]);
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// create new user
router.post("/user", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [newUser, rows] = await conn.query(
      `INSERT INTO User (registerDatetime) VALUES (NOW())`,
      []
    );

    const [[user]] = await conn.query(
      `SELECT *
        FROM User
        WHERE userId = ?`,
      [newUser.insertId]
    );

    await conn.commit();

    res.json({
      userId: user.userId,
      registerDatetime: user.registerDatetime,
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// get participant xx (1) for room xx by user xx
router.get("/user/:userId/room/:roomId/participant", async (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.params.userId;
  const state = "left";

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [participant, rows] = await conn.query(
      `SELECT participantId
      FROM Participant
      WHERE userId = ? AND roomId = ? AND state != ?`,
      [userId, roomId, state]
    );

    await conn.commit();
    res.json({ participantId: participant[0].participantId });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// get participant xx's score for quiz xx
router.get(
  "/quiz/:quizId/participant/:participantId/score",
  async (req, res) => {
    const quizId = req.params.quizId;
    const participantId = req.params.participantId;
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      const [score, rows] = await conn.query(
        `SELECT *
        FROM \`Score\`
        WHERE \`quizId\` = ? AND \`participantId\` = ?`,
        [quizId, participantId]
      );

      await conn.commit();
      res.json({ myScore: score });
    } catch (err) {
      await conn.rollback();
      res.status(500).send(err);
    } finally {
      conn.release();
    }
  }
);

exports.router = router;
