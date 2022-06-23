/* const express = require("express");
const router = express.Router(); */
const router = require("express").Router();
const User = require("../models/useModel");

//GETs
router.get("/", async (req, res) => {
  const allUsers = await User.find({}); // bu json döndürecek
  res.json(allUsers);
});

router.get("/:id", async (req, res) => {
  const user = await User.find({ _id: req.params.id });
  console.log(req.params.id);
  res.json(user);
});

// POSTs
router.post("/", async (req, res) => {
  try {
    const addUser = new User(req.body);
    const sonuc = await addUser.save();
    res.json(sonuc);
  } catch (err) {
    console.log("We have an error: " + err);
  }
});

// UPDATE - PATCH
router.patch("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
  try {
    const result = await User.findByIdAndDelete({ _id: req.params.id });
    if (result) {
      return res.json({
        message: `${req.params.id} idli kullanıcı silicenecektir`,
      });
    } else {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
  } catch (error) {
    console.log("Kullanıcı silerken hata oluştu: " + error);
  }
});
module.exports = router;
