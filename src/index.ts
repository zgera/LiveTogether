import "dotenv/config"
import { userRouter } from "./routes/userRouter";
import cookieParser from 'cookie-parser';

import express from 'express';

const app = express()

app.use(express.json())
app.use(cookieParser());

app.use('/user', userRouter)

app.listen(8000, () => {
  console.log(`App listening on http://localhost:8000`)
})