// Imports
const express = require("express");
const mongoose = require("mongoose");

// Connection string for database
const { MONGO_USER, MONGO_PASS, MONGO_IP, MONGO_PORT } = require("./config/config");

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_IP}:${MONGO_PORT}/database?authSource=admin`

const connectWithRetry = () => {
    mongoose.connect(mongoURL)
    .then(() => console.log("Successfully connected to database"))
    .catch((e) => {
        console.log(e)
        setTimeout(connectWithRetry, 5000)
    });
};

connectWithRetry();

app.use(express.json());

app.get("/",(req, res) =>{
    res.send("<h2>Changes made</h2>");
});


app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));


