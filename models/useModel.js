const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      lowercase: true,
      maxLength: 30,
    },
    userName: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 100,
    },
  },
  { collection: "users" }
);

// using joi Validation with create a schema methods :)
// that's goal is validate objects data before database. Also database has a validation system in itself
// our method name will be joiValidation
// never use arrow function because of bidning this keyword
//moelden önce bu kodları kullanmalıyız ki ilk bu kodlar valdation yapsın diye
userSchema.methods.joiValidation = function (userObject) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).trim().required(),
    userName: Joi.string().min(3).max(30).trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
  });
  return schema.validate(userObject);
};

// kullanıcı bilgileri girip gönderdiğinde json olarak yayınlanmadan önce res.json dan bahsediyorum
// müdahale edebiliriz. hazır bir fonksiyonumuz vr json diye onunla müdahale edeceğiz.

userSchema.methods.toJSON = function () {
  //objeye cevirmeden önceki hali..
  console.log("Objeye çevirmedik: ", this);
  const user = this.toObject(); // gelen veriyi objeye çeviriyoruz.
  delete user._id; // yani bu gönderilmeyecek res.jsona
  delete user.password;
  delete user.__v;

  return user;
};

// lets create a model from UserSchema
const User = mongoose.model("User", userSchema);

module.exports = User;
