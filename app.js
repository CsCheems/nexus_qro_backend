require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const port = process.env.PORT;

app.listen(port, ()=>{
    console.log(`Espress app listening at http://localhost:${[port]}`);
})