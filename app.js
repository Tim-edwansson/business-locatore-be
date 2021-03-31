const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require('cors');
const mongoose = require("mongoose");
const users = require("./routes/users");
const auth = require("./routes/auth");
const cards = require("./routes/cards");


mongoose.connect('mongodb+srv://admin:Badran00@cluster0.lnrsf.mongodb.net/test',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch(() => console.log("Error Connecting to MongoDB"));

app.use( cors() );    
app.use(express.json());

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/cards", cards);

const port = 3900;
http.listen(port, () => console.log(`listen to port ${port}`));