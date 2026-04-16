require('dotenv').config({path: "./.env"});
const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();
const cors = require('cors');
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/projects.routes');
const userRoutes = require('./routes/users.routes');
const venturRoutes = require('./routes/venture.routes');


app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/users", userRoutes);
app.use("/ventures", venturRoutes);

const port = process.env.PORT || 3001;

app.listen(port, ()=>{
    console.log(`Express app listening at http://localhost:${port}`);
});



