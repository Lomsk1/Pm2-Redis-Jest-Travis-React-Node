const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");

require("./models/User");
require("./models/Blog");
require("./services/passport");
require("./services/cache");

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/blogRoutes")(app);

if (["production", "ci"].includes(process.env.NODE_ENV)) {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});

/* pm2 start server.ts -i 0 */
/* pm2 list */
/* pm2 monit */
/* pm2 show */ // server (just name)
/* pm2 delete */ // server (just name)

// const redis = require('redis')
// const redisURL = "redis://127.0.0.1:3679"
// const client = redis.createClient(redisURL)
// client.set('hi','there', "EX", 5) // 1- key; 2- value; 3- expired 4- expired time with SECONDS
// client.get('hi',(err, value)=>console.log(value))
// client.get("hi", console.log)
// client.hset("german", "red", "rot") //hash
// client.hget("german", "red", console.log)
// client.flushall() // clean data in redis
