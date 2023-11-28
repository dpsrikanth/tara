const Joi = require("@hapi/joi");
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  // password: { type: String, required: true },
  image: String,
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  companyName: { type: String, required: true },
  address: {
    street1: { type: String },
    street2: { type: String },
    city: { type: String },
    province: { type: String },
    code: { type: String },
  },
  phone: { type: String, required: true },
  website: { type: String },
  companyReg: { type: String },
  vatNumber: { type: String },
  created_date: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  userType: { type: String, default: 'normal' },
  status: { type: String, enum: ['active','approved', 'pending', 'rejected'], default: 'pending' },
  comment: { type: String },
  favourites:[],
  mesmaId: { type: String },
  countrycode:{type:String},
  country:{type:String}
});

function validateNewUserData(user) {
  const schema = {
    username: Joi.string().required(),
    password: Joi.string().required(),
    image: Joi.string().allow(""),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string().required(),
    companyName: Joi.string().required(),
    address: {
      street1: Joi.string().allow(""),
      street2: Joi.string().allow(""),
      city: Joi.string().allow(""),
      province: Joi.string().allow(""),
      code: Joi.string().allow(""),
    },
    website: Joi.string().allow(""),
    companyReg: Joi.string().allow(""),
    vatNumber: Joi.string().allow(""),
    adminCode: Joi.string().allow(""),
    countrycode: Joi.string().allow(""),
    country: Joi.string().allow(""),
  };
  return Joi.validate(user, schema);
}

function validateUpdatedUserData(user) {
  const schema = {
    username: Joi.string().required(),
    status: Joi.string().allow(""),
    image: Joi.string().allow(""),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string().required(),
    companyName: Joi.string().required(),
    address: {
      street1: Joi.string().allow(""),
      street2: Joi.string().allow(""),
      city: Joi.string().allow(""),
      province: Joi.string().allow(""),
      code: Joi.string().allow(""),
    },
    website: Joi.string().allow(""),
    companyReg: Joi.string().allow(""),
    vatNumber: Joi.string().allow(""),
    adminCode: Joi.string().allow(""),
    userType: Joi.string().required().valid("normal", 'memsa', 'admin'),
    mesmaId: Joi.string().allow(""),
    countrycode: Joi.string().allow(""),
    country: Joi.string().allow(""),
  };
  return Joi.validate(user, schema);
}

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);

module.exports.User = User;
module.exports.validateNewUserData = validateNewUserData;
module.exports.validateUpdatedUserData = validateUpdatedUserData;

// module.exports = mongoose.model("User", UserSchema);
