/* const express = require("express");
const router = express.Router(); */
const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/useModel");
const createError = require("http-errors");
const authMiddleware = require("../middleware/authMiddleware");

//GETs
router.get("/", async (req, res) => {
  const allUsers = await User.find({}); // bu json döndürecek
  res.json(allUsers);
});

/* router.get("/:id", async (req, res) => {
  const user = await User.find({ _id: req.params.id });
  console.log(req.params.id);
  res.json(user);
}); */

// LOGIN WITH JSON WEB TOKEN JWT
//burada bir middleware kullanıyoruz önce middleware uğrayacak sonra callback fonksiyonuna geçecek
// eğer birden fazla sırasıyla middleware uğraması gerekiyorsa [mid1, mid2] şeklinde array içinde vermemiz lazım
//ÖNEMLİ..! her middleware bir sonraki middleware ile ilişkilidiir yani,
//... ilk middleware request parametresini kullanarak birşeyler eklediysek birsonraki
// ...midlleware de onu kullanabiliriz. Ama respnse dersek o middleware oraya sonlanır.
router.get("/me", authMiddleware, async (req, res, next) => {
  //önce middleware çalışacak sonra buradaki callback çalışacak
  console.log("BURADAYIZ 2");
  next();
});

// POSTs
router.post("/", async (req, res, next) => {
  try {
    const addingUser = new User(req.body);
    addingUser.password = await bcrypt.hash(addingUser.password, 10);
    // şifrenin verdiğimiz şifre ile uyuşup uyuşmadığını bulmak için
    //await bcrypt.compare(şifremiz, hashKODU) şeklinde kullanabilirz. bu bize true ya da false döner.
    // şifre hashKodu ile eşleşiyorsa true, eşleşmiyorsa false değer döner
    const { error, value } = addingUser.joiValidation(req.body);
    if (error) {
      next(error);
    } else {
      const result = await addingUser.save();
      res.json(result);
    }
  } catch (err) {
    console.log("We have an error: " + err);
  }
});

// UPDATE - PATCH
router.patch("/:id", async (req, res) => {
  // kullanıcı şifresini güncellemeye erişemesin diye veritabanı üzerinden gelen değeri siliyorum
  //delete req.body.password;

  if (req.body.hasOwnProperty("password")) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  const result = await User.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true } //runvalidators güncellemede de schemamıza göre validation yapmamızı sağlar
  );
  try {
    if (result) res.json(result);
    else res.status(404).json({ message: "user could not find" });
  } catch (error) {
    console.log("We have an error: " + error);
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await User.findByIdAndDelete({ _id: req.params.id });
    if (result) {
      return res.json({
        message: `${req.params.id} idli kullanıcı silicenecektir`,
      });
    } else {
      console.log("ELSİN İÇİNDEYİZ");
      /* const hataNesnesi = new Error("BAK HATA");
      hataNesnesi.hataKodu = 404;
      throw hataNesnesi; */
      //Aşağıdaki hata id tipinin doğru ama bulunamadığı zaman yollacak hata
      throw createError(404, "Kullanıcı bulunamadı :(");
      //yukarıdaki hataNesnesini fırlatarak catch de yakadım ve middleware gönderdim
      //return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
  } catch (error) {
    next(createError(400, error));
    //nextten sonraki kodlar da çalışır :))
  }
});

// LOGIN
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.loginAccount(req.body.email, req.body.password);
    const token = await user.generateToken();
    res.json({ user, token: token });
  } catch (error) {
    next(error);
  }
});

//EXPORTS
module.exports = router;
