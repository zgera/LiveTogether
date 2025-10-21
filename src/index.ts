import "dotenv/config"
import cookieParser from 'cookie-parser';
import http from "http";

import { userRouter } from "./routes/userRouter";
import { familyRouter } from "./routes/familyRouter";
import { invitationRouter } from "./routes/invitationRouter";
import { taskRouter } from "./routes/taskRouter";
import { webSocketService } from "./ws/webSocketService";
import { TaskSchedulerService } from "./services/taskSchedulerService";


import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Permite las request desde esta direccion en especifico
    credentials: true // por si se usan cookies
}));


const taskScheduler = new TaskSchedulerService()

app.use(express.json())
app.use(cookieParser());

app.use('/user', userRouter)
app.use('/family', familyRouter)
app.use('/invitation', invitationRouter)
app.use('/task', taskRouter)

const server = http.createServer(app)
webSocketService.init(server)


server.listen(8080, () => {
  console.log(`App listening on http://localhost:8080`)
})