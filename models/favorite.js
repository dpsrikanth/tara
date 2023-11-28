const mongoose = require("mongoose");

// const favoriteSchema = new mongoose.Schema({
//   author: {
//     id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     username: String,
//   },
//   parent: { id: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment" } },
// }, { timestamps: true });

// const Favorite = mongoose.model("favorite", favoriteSchema);

// module.exports.Equipment = Favorite;


const favoriteSchema = new mongoose.Schema({
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: String,
  },
  parent: { id: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment" } },
  status: { type: String },
  isFav: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('favorite', favoriteSchema);
