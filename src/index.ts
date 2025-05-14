import "dotenv/config"

import express from 'express';

const app = express()

app.use(express.json())

app.listen(8000, () => {
  console.log(`App listening on http://localhost:8000`)
})