require('dotenv').config({path: "./config/.env"});
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');

app.use("/auth", authRoutes);

const port = process.env.PORT || 3001;

app.listen(port, ()=>{
    console.log(`Express app listening at http://localhost:${port}`);
});



