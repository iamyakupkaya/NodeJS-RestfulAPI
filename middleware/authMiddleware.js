var jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  //console.log(req.header("Authorization")); req header bölümünde böyle bir başlık ara ve value değerini döndür demektir
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const result = jwt.verify(token, "mysecretkey");
    console.log("BURADAYIZZZZ");
    console.log("Gelen Sonuc: ", result);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
