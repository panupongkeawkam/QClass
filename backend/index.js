const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.static("public"));
app.use(express.json()); // for parsing application/json !important
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded !important
app.use(cors());

const quizRouter = require('./routes/quiz')
const roomRouter = require('./routes/room')
const userRouter = require('./routes/user')

app.use(quizRouter.router)
app.use(roomRouter.router)
app.use(userRouter.router)

app.listen(3000, () => {
  console.log(`QClass backend server running at http://localhost:3000`);
});
