const express = require("express");
const pool = require("../config");

router = express.Router();

// get all own room for user xx
router.get("/user/:userId/room", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  var userId = req.params.userId;

  try {
    const [rooms, rows] = await conn.query(
      `
    SELECT *
    FROM Room
    WHERE userId = ?`,
      [userId]
    );

    await conn.commit();
    res.json({ rooms: rooms });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// get all joined room for user xx
router.get("/participant/:userId/room", async (req, res) => {
  // state = "joined"
  const userId = req.params.userId;
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [rooms, rows] = await conn.query(
      `SELECT r.*
      FROM Room AS r
      JOIN Participant AS p
      USING (roomId)
      WHERE p.userId = ? AND p.state = ?`,
      [userId, "joined"]
    );

    await conn.commit();
    res.json({ rooms: rooms });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// join room with room code by body
router.post("/user/:userId/participant", async (req, res) => {
  // if rejoin then set state to "joined"
  // { body: { inviteCode: "value", state: "joined" } }
  // get room by inviteCode
  // room member += 1
  const userId = req.params.userId;
  const inviteCode = req.body.inviteCode;

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [room, rows1] = await conn.query(
      ` SELECT *
      FROM Room
      WHERE inviteCode = ?`,
      [inviteCode]
    );

    if (room.length === 0) {
      console.log("Error InvalidCode");
      await conn.rollback();
      return res.status(400).send("Invalid join code");
    }

    const [ownRoom, rows3] = await conn.query(
      `SELECT *
      FROM Room
      WHERE userId = ? AND inviteCode = ?`,
      [userId, inviteCode]
    );

    const [user, rows4] = await conn.query(
      `SELECT *
      FROM Participant
      WHERE userId = ? AND roomId = ? AND state != ?`,
      [userId, room[0].roomId, "left"]
    );

    if (user.length > 0) {
      console.log("You join same room");
      await conn.rollback();
      return res.status(404).send("Cannot join same room");
    } else if (ownRoom.length > 0) {
      console.log("Own Room");
      await conn.rollback();
      return res.status(400).send("Cannot join your own room");
    }
    const [rejoinUser, rows5] = await conn.query(
      `SELECT * FROM Participant WHERE userId = ? AND roomId = ? AND state = ?`,
      [userId, room[0].roomId, "left"]
    );
    if (rejoinUser.length > 0) {
      const [participant, rows] = await conn.query(
        `UPDATE Participant
        SET state = ?
        WHERE userId = ?
        and roomId = ?`,
        ["joined", userId, room[0].roomId]
      );
    } else {
      const [participant, rows] = await conn.query(
        `INSERT INTO Participant (roomId, userId, joinedDatetime, name, state)
      VALUES (?, ?, NOW(), ?, ?)`,
        [room[0].roomId, userId, "Anonymous", "joined"]
      );
    }
    const [updateRoom, rows2] = await conn.query(
      `UPDATE Room 
        SET member = member + 1
        WHERE roomId = ?
        `,
      [room[0].roomId]
    );

    await conn.commit();
    res.status(200).send("Created");
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// create new own room for user xx
router.post("/user/:userId/room", async (req, res) => {
  // { body: { title, iconName } }
  // generate inviteCode
  // room member is 0 default
  const newRoom = req.body.room;
  const userId = req.params.userId;
  const title = req.body.room.title;
  const iconName = req.body.room.iconName;
  const inviteCode = req.body.room.inviteCode;
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [room, rows] = await conn.query(
      `
    INSERT INTO Room (userId, title, iconName, inviteCode, createDatetime, member)
    VALUES (?, ?, ?, ?, NOW(), 0)`,
      [userId, title, iconName, inviteCode]
    );

    newRoom.roomId = room.insertId;
    newRoom.userId = userId;

    await conn.commit();
    res.json(newRoom);
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// enter to room (any role)
router.get("/user/:userId/room/:roomId", async (req, res) => {
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

// get quiz available of room xx
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
    res.json({ quiz: quiz });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// get survey available of room xx
router.get("/room/:roomId/survey", async (req, res) => {
  // find survey state = "attempting"
  const roomId = req.params.roomId
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {

    const [survey, rows]  = await conn.query(
      `SELECT *
      FROM \`Survey\`
      WHERE \`roomId\` = ? AND \`state\` = ?`,
      [roomId, "attempting"]
    )

    await conn.commit()
    res.json(survey);
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// get all announcement of room xx
router.get("/room/:roomId/announcement", async (req, res) => {
  const roomId = req.params.roomId;

  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const [announcements, rows] = await conn.query(
      `
    SELECT * FROM Announcement
    WHERE roomId = ?`,
      [roomId]
    );

    await conn.commit();
    res.json({ announcements: announcements });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// send announcement to room xx (by owner)
router.post("/room/:roomId/announcement", async (req, res) => {
  // { body: { message } }
  const roomId = req.params.roomId;
  const userId = req.body.userId;
  const message = req.body.message;
  const now = new Date();
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [isOwnRoom, rows1] = await conn.query(
      `SELECT *
      FROM Room
      WHERE userId = ? AND roomId = ?`,
      [userId, roomId]
    );

    var isNotOwnRoom = isOwnRoom.length <= 0;

    if (isNotOwnRoom) {
      console.log("You cannot post announcement");
      await conn.rollback();
      res.status(401).send("Your cannot send a post");
    }

    const [updateAnnouncement, rows2] = await conn.query(
      `INSERT INTO Announcement (roomId, message, createDatetime)
      VALUES (?, ?, ?)`,
      [roomId, message, now]
    );

    await conn.commit();
    console.log(`"From Backend" : New announcement (${message})`);
    res.json({
      announcement: {
        message: message,
        time: now,
      },
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});

// leave room or rejoin
router.put("/participant/:participantId", async (req, res) => {
  const userId = req.params.participantId;
  const roomId = req.body.room.roomId;
  // { body: { state: "left" || "join" } }

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [room, rows] = await conn.query(
      `
    UPDATE Participant
    SET state = ?
    WHERE userId = ?
    AND roomId = ?`,
      ["left", userId, roomId]
    );
    const [updateRoom, rows2] = await conn.query(
      `
    UPDATE Room
    SET member = member - 1
    WHERE roomId = ?`,
      [roomId]
    );
    await conn.commit();
    res.status(200).send("Left Success");
  } catch (err) {
    await conn.rollback();
    res.status(500).send(err);
  } finally {
    conn.release();
  }
});


exports.router = router;
