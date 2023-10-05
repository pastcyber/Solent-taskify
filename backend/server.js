const express = require('express')
const cors = require('cors')
const app = express();

//cors 
app.use(cors({origin:"*"}))
// middleware
app.use(express.json())

//routes
const taskRoutes = require('./routes/taskRoute')
const todoRoutes = require('./routes/todoRoute')
const eventRoutes = require('./routes/eventRoute')
app.use('/task',taskRoutes)
app.use('/todo',todoRoutes)
app.use('/event',eventRoutes)



// app running
app.listen(8000,()=>{
    console.log("app working on http://localhost:8000")
})