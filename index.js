const express = require("express")
const mongoose = require("mongoose")
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config")
const session = require("express-session")
const RedisStore = require("connect-redis").default // تغییر این قسمت
const { createClient } = require("redis")
const cors = require("cors")
// ایجاد Redis client با نسخه جدید
let redisClient = createClient({
    url: `redis://${REDIS_URL}:${REDIS_PORT}`
})

redisClient.connect().then(() => {
    console.log("redis connected!!!");

}).catch(console.error)

const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")
const app = express()
app.enable("trust proxy")
app.use(cors())
app.use(session({
    store: new RedisStore({ client: redisClient }), // استفاده از RedisStore بدون تابع
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // اگر از HTTPS استفاده می‌کنید، این مقدار را به true تغییر دهید
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // زمان اعتبار کوکی در میلی‌ثانیه
    }
}))

// برای دریافت داده‌های JSON
app.use(express.json())

// اتصال به MongoDB

//for recieve post and ...
// ip address mongo => docker inspect name_CONTAINOR_MONGO=> "Network = > ip address"
// mongoose.connect("mongodb://amirhossein:amgh1383@172.20.0.2:27017/?authSource=admin")



const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    mongoose.connect(mongoUrl)
        .then(() => {
            console.log("Successfully connected to MongoDB")
        })
        .catch((err) => {
            console.log("Failed to connect to MongoDB, retrying...", err)
            setTimeout(connectWithRetry, 5000) // تلاش مجدد بعد از 5 ثانیه
        })
}

app.get("/api/v1", (req, res) => {
    res.send("<h2>HI THERE</h2>")
    console.log("yeah it run");

})

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)

connectWithRetry()

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on port ${port}`))
