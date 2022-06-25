const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

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

const schema = Joi.object({
  name: Joi.string().min(2).max(30).trim(),
  userName: Joi.string().min(3).max(30).trim(),
  email: Joi.string().trim().email(),
  password: Joi.string().trim(),
});

// using joi Validation with create a schema methods :)
// that's goal is validate objects data before database. Also database has a validation system in itself
// our method name will be joiValidation
// never use arrow function because of bidning this keyword
//moelden önce bu kodları kullanmalıyız ki ilk bu kodlar valdation yapsın diye
userSchema.methods.joiValidation = function (userObject) {
  schema.required(); // varolan joi schemasına extra tüm alanalra reqired ekler
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

// for Login
userSchema.statics.loginAccount = async (email, password) => {
  const { error, value } = schema.validate({ email, password });
  if (error) {
    throw createError(error);
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    // eğer kullanıcı yoksa
    throw createError(400, "Email veya Şifre hatalı");
  } else {
    console.log("Else içerisindeyiz");
    const passwordChecking = await bcrypt.compare(password, user.password);
    if (!passwordChecking) {
      throw createError(400, "Email veya Şifre hatalı");
    } else {
      return user;
    }
  }
};

// lets create a model from UserSchema
const User = mongoose.model("User", userSchema);

module.exports = User;
