const express = require("express");
require("./db/dbConnection"); // to use mongoose connection
const useRouter = require("./router/useRouter");
const hataAyiklama = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", useRouter); //Eğer api/users ile başayan istek gelirse Router a git

//Home Page GET
app.get("/", (req, res) => {
  res.status(200).json({ message: "you'r welcome emmi :)" });
});

// eğer hata geldiyse en son middleware e uğraması gerektiği için en alttaki middleware olarak ayarlıyoruz.
app.use(hataAyiklama);

app.listen(3000, (_) => console.log("3000 port is listening"));
