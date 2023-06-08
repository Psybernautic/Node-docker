const express = require("express");
const mongoose = require("mongoose");

const app = express()

mongoose.connect("mongodb://sebastian:admin123@172.22.0.3:27017/database?authSource=admin")
.then(() => console.log("Successfully connected to Database"))
.catch((e) => console.log(e));

app.get("/",(req, res) =>{
    res.send("<h2>Changes made</h2>");
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`))


