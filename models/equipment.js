var mongoose = require("mongoose");
const Joi = require("@hapi/joi");

var equipmentSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  eqtype: { type: String, required: true },
  type: { type: String },
  oem: { type: String, required: true },
  description: { type: String ,required:true},
  trl:  {type: String, required: true },
  visibility: String,
  approvalStatus: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending' },
  comment: { type: String },
  mineActivity: { type: String },
  mineral: { type: String },
  miningMethod: { type: String },
  miningCycle: { type: String },
  verified: String,
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: String,
  },
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }],
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
  datasheets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Datasheet" }],
  specifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Specification" },
  ],
  created_date: { type: Date, default: Date.now },
  energySource:{ type: String },
  LogisticsAndMaterials:{ type: String },
  ITComms:{ type: String },
  reefType:{ type: String },
});

equipmentSchema.index(
  {
    "$**": "text",
  },
  {
    weights: {
      name: 1,
      eqtype:1,
      type: 1,
      oem: 1,
      description: 1,
      trl: 1,
      mineActivity: 1,
      mineral: 1,
      miningMethod: 1,
      miningCycle: 1,
      energySource:1,
      LogisticsAndMaterials:1,
      ITComms:1,
      reefType:1
    },
  }
);

function validateEquipmentData(equipment) {
  const schema = {
    name: Joi.string().required(),
    eqtype:Joi.string().required(),    
    type: Joi.string().allow(""),
    oem: Joi.string().required(),
    description: Joi.string().required(),
    miningCycle: Joi.string().allow(''),
    mineActivity: Joi.string().allow(''),
    miningMethod: Joi.string().allow(''),
    mineral: Joi.string().allow(''),
    trl: Joi.string()
      .regex(/^TRL[1-9]$/)
      .required(),    
    visibility: Joi.string().allow(""),
    verified: Joi.string().allow(""),
    energySource: Joi.string().allow(''),
    LogisticsAndMaterials: Joi.string().allow(''),
    ITComms: Joi.string().allow(''),
    reefType: Joi.string().allow(''),
  };
  return Joi.validate(equipment, schema);
}

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports.Equipment = Equipment;
module.exports.validateEquipmentData = validateEquipmentData;
// module.exports = mongoose.model("Equipment", equipmentSchema);
