import "dotenv/config"
import cookieParser from 'cookie-parser';
import http from "http";

import { userRouter } from "./routes/userRouter";
import { familyRouter } from "./routes/familyRouter";
import { invitationRouter } from "./routes/invitationRouter";
import { taskRouter } from "./routes/taskRouter";

import express from 'express';

const app = express()

app.use(express.json())
app.use(cookieParser());

app.use('/user', userRouter)
app.use('/family', familyRouter)
app.use('/invitation', invitationRouter)
app.use('/task', taskRouter)

const server = http.createServer(app)

server.listen(3000, () => {
  console.log(`App listening on http://localhost:3000`)
})