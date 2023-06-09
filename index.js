const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const redis = require("redis");


// Constants and environment variables 
const { MONGO_USER, MONGO_PASS, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config");

let RedisStore = require('connect-redis')(session)
// Initialize client.
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_IP}:${MONGO_PORT}/database?authSource=admin`;

const connectWithRetry = () => {
    mongoose.connect(mongoURL)
    .then(() => console.log("Successfully connected to database"))
    .catch((e) => {
        console.log(e);
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Initialize sesssion storage.
app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: SESSION_SECRET,
      cookie: {
        resave: false,
        httpOnly: true,
        maxAge: 30000,
        secure: false,
        saveUninitialized: false
      }
}))

// Middleware
app.use(express.json());




app.get("/",(req, res) =>{
    res.send("<h2>Changes made</h2>");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
