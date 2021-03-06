const mongoose = require("mongoose");

const config = require("config");

const db = config.get("mongodb");

const connectionToDb = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Db connection success....");
  } catch (err) {
    console.log(err.message, 123);
    process.exit(1);
  }
};

module.exports = connectionToDb;
