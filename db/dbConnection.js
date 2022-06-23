const mongoose = require("mongoose");

// connection with database on mongoose
mongoose
  .connect("mongodb://localhost/restful_api", {
    useNewUrlParser: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true, // anlamı otomatik olarak index oluşturur
    // ... bunun nedeni email, vb alanalrda unique true dememiz bu yüzden index oluşrtuması gerekiyor

    useUnifiedTopology: true,
  })
  .then((_) => console.log("Connection is succesful"))
  .catch((_) => console.log("WARN.! Connection is unsuccesful"));
