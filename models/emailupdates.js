var mongoose = require("mongoose");

var emailUpdatesSchema = new mongoose.Schema({
  emailSubject:{type:String,required:true},
  emailCotnent: { type: String, required: true },  
  to:{type:String},
  status:{type:Number,default:0},
  InsertedOn: { type: Date, default: Date.now },
  sentOn: { type: Date},
  statusDescription:{type:String}
});

module.exports = mongoose.model("emailUpdates", emailUpdatesSchema);
