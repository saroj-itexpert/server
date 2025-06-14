import express from 'express'
const app = express()
app.use(express.json())
import authRoute from "./route/globals/auth/authRoute"
import instituteRoute from "./route/institute/instituteRoute"

app.use("/api/",authRoute);
app.use("/api/institute", instituteRoute);
export default app