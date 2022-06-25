const hataAyiklama = (error, req, res, next) => {
  if (error.name === "CastError") {
    res.json({
      hataCode: error.statusCode,
      mesaj: "Lütfen geçerli bir id giriniz.",
    });
  } else {
    res.json({
      hataCode: error.statusCode,
      mesaj: error.message,
    });
  }
};

module.exports = hataAyiklama;
