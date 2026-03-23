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

app.use("/auth", authRoutes);

const port = process.env.PORT || 3001;

app.listen(port, ()=>{
    console.log(`Express app listening at http://localhost:${port}`);
});



