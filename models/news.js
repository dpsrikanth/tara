var mongoose = require("mongoose");

var newsSchema = new mongoose.Schema({
  newsTitle:{type:String,required:true},
  newsContent: { type: String, required: true },  
  createdBy:{type:String},
  createdOn:{type:String},
  editedBy:{type:String},
  editedOn:{type:String}
});

module.exports = mongoose.model("News", newsSchema);
