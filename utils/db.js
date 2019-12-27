const mongoose = require("mongoose");
const uri = process.env.db;

const db = mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) console.log(err);
    console.log("Connect successfully");
  }
);

module.exports = db;
