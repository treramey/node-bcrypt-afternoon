require("dotenv").config();
const express = require("express"),
    massive = require("massive"),
    session = require("express-session"),
    { register, login, logout } = require("./controllers/authController"),
    { dragonTreasure, getUserTreasure, addUserTreasure, getAllTreasure } = require('./controllers/treasureController'),
    { usersOnly, adminsOnly } = require('./middleware/authMiddleware'),
    { SESSION_SECRET, CONNECTION_STRING, SERVER_PORT } = process.env,
    app = express();

app.use(express.json());

massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
}).then(dbInstance => {
    app.set("db", dbInstance);
    console.log("Connected to SkyNet.")
    app.listen(SERVER_PORT, () => console.log(`Running on PORT ${SERVER_PORT}.`))
})

app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: SESSION_SECRET,
    })
);


app.post("/auth/register", register);
app.post("/auth/login", login);
app.get("/auth/logout", logout);

app.get('/api/treasure/dragon', dragonTreasure);
app.get('/api/treasure/user', getUserTreasure, usersOnly);
app.post('/api/treasure/user', usersOnly, addUserTreasure);
app.get('/api/treasure/all', usersOnly, adminsOnly, getAllTreasure);
