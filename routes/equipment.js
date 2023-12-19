var express = require("express");
var router = express.Router();
var { Equipment, validateEquipmentData } = require("../models/equipment");
var { Feature } = require("../models/feature");
var { User } = require("../models/user");
var middleware = require("../middleware");
var fs = require("fs");
var config = require("../config");
let mail = require("../helpers/mail");
const equipmentService = require("../services/equipment.service");
const ObjectId = require("mongoose").Types.ObjectId;
const Favorite = require("../models/favorite");

async function searchEquipment(searchString) {
  let wildcard = RegExp(".[*]$");
  let wildcardTerms = [];
  let equipmentArray = []; // array of objects {equipment, score}
  let orderedArray = [];
  let unique = false;
  let uniqueEquipment = []; // array of objects {equipment}

  // Separate wildcard terms from regular search terms
  if (searchString.includes("*")) {
    let searchTerms = searchString.split(" ");
    for (let i = 0; i < searchTerms.length; i++) {
      if (wildcard.test(searchTerms[i])) {
        wildcardTerms.push(searchTerms[i].slice(0, -1));
        searchTerms.splice(i, 1);
      }
    }
  }

  // Search for wildcard terms
  if (wildcardTerms.length > 0) {
    for (let t of wildcardTerms) {
      //console.log(t);
      let equipment = await Equipment.find(
        { approvalStatus: "approved" },
        //{ name: t }
        // ,
        { name: { $regex: "^" + t, $options: "i" } },
        // { type: { $regex: new RegExp(t, "gi") } },
        // { description: { $regex: new RegExp(t, "gi") } },
        // { oem: { $regex: new RegExp(t, "gi") } },
        // { miningCycle: { $regex: new RegExp(t, "gi") } },
        // { mineActivity: { $regex: new RegExp(t, "gi") } },        
        // { mineral: { $regex: new RegExp(t, "gi") } },
        // { miningMethod: { $regex: new RegExp(t, "gi") } },
      )
        .limit(config.equip.maxSearchResults)
        .populate("images")
        .exec()
        .catch(function (err) {
          req.flash("error", "Equipment search encountered an error");
          return res.redirect("/equipment");
        });
        //console.log(equipment);
      if (equipment && equipment.length > 0) {
        equipment.forEach((equip) => {
          equipmentArray.push({ equipment: equip, score: 1 });
        });
      }
    }
  }

  const regex = new RegExp(escapeRegex(searchString), "gi");
  // Search for the regular terms in Equipment
  let equipment = await Equipment.find(    
    { $text: { $search: regex } },
    { score: { $meta: "textScore" } }
  )
    .sort({
      score: { $meta: "textScore" },
    })
    .limit(config.equip.maxSearchResults)
    .populate("features images datasheets specifications")
    .exec()
    .catch(function (err) {
      req.flash({ status: "Failure", message: "Failed" });
    });

  if (equipment && equipment.length > 0) {
    equipment.forEach((equip) => {
      equipmentArray.push({ equipment: equip, score: equip._doc.score });
    });
  }

  // Search for the regular terms in Features
  let features = await Feature.find(
    { $text: { $search: regex } },
    { score: { $meta: "textScore" } }
  )
    .sort({
      score: { $meta: "textScore" },
    })
    .limit(config.equip.maxSearchResults)
    .exec()
    .catch(function (err) {
      req.flash("error", "Equipment search encountered an error");
      return res.redirect("/equipment");
    });

  if (features && features.length > 0) {
    for (const feature of features) {
      let equip = await Equipment.findById(feature.parent.id)
        .populate("features images datasheets specifications")
        .exec()
        .catch(function (err) {
          req.flash("error", "Equipment search encountered an error");
          return res.redirect("/equipment");
        });
      if (equipmentArray.length > 0) {
        for (let e of equipmentArray) {
          if (JSON.stringify(equip._id) === JSON.stringify(e.equipment._id)) {
            e.score = e.score + feature._doc.score;
            unique = false;
            break;
          } else {
            unique = true;
          }
        }
      }
      if (equipmentArray.length === 0 || unique) {
        equipmentArray.push({ equipment: equip, score: feature._doc.score });
      }
    }
  }

  compare = (a, b) => b.score - a.score;
  equipmentArray.sort(compare);

  orderedArray = equipmentArray.map((e) => {
    return e.equipment;
  });

  uniqueEquipment = Array.from(new Set(orderedArray.map((a) => a.id))).map(
    (id) => {
      return orderedArray.find((a) => a.id === id);
    }
  );

  return [uniqueEquipment, uniqueEquipment.length];
}

router.get("/home/search", async function (req, res) {
  let noMatch;
  let pageSize = config.equip.maxResultsPerPage;
  let equipmentCount = 0;
  let equipment = [];
  let pageType = "all";
  let pageNumber = req.query.pageNumber || 1;
  // req.query.search = req.query.search;
  if (req.query.search) {
    let equipmentCount = 0;
    let equipment = [];
    let pageType = "search";
    [equipment, equipmentCount] = await searchEquipment(req.query.search);

    if (equipment.length > 0) {
      noMatch = null;
    } else {
      noMatch = "Sorry, there are no results for that query, please try again.";
    }
    res.render("equipment/index", {
      equipment: equipment,
      pageType: pageType,
      noMatch: noMatch,
      pageNumber: Number(pageNumber),
      numPages: Math.ceil(equipment.length / pageSize),
      numPages: 1,
      filters: {
        miningMethod: [],
        mineral: [],
        miningType: [],
        miningActivity: [],
        miningCycle: [],
      },


    })
    // res.send({
    //   equipment: equipment,
    //   pageType: pageType,
    //   noMatch: noMatch,
    // });
  } else {
    req.flash("error", "Please select one or more inputs to search");
  }
});
router.get("/partial/search", async function (req, res) {
  let names = [];
  // return;

  Equipment.find(
    { name: { $regex: req.query.name, $options: "i" } },
    (err, searchedItems) => {
      if (searchedItems.length > 0) {
        //console.log(searchedItems);
        searchedItems.forEach(function (s) {
          names.push(s._id +"##"+s.name);
        });
        // return names

        res.send({ status: "Success", message: names });
        // res.render("equipment/search",{
        //   suggestion: names,
        //   enable: "Hyee",
        // })
        // res.send({ status: "Success", message: names });
      } else {
        res.send({ status: "Failure", message: "No equipments found" });
      }
    }
  );
});
router.get("/favourites/:_id", async function (req, res) {
  let favEquipments = [];
  const Fav = await User.findOne(
    {
      "_id": req.params._id
      //_id of the author
    });

  //console.log("EQUIPMENTS FAV", Fav);
  if (Fav && Fav.favourites.length > 0) {
    Fav.favourites.forEach(function (s) {
      const text = (s).toString();
      //console.log(typeof text)

      // console.log(text)
      const text1 = text.replace("new ", "")
      //console.log(text1)
      favEquipments.push(text);
    });
    //console.log(favEquipments);
    let equipments = await Equipment.find({
      _id: { $in: favEquipments },
    }).populate("features images datasheets specifications");

    res.render("equipment/favs", {
      equipment: equipments
    })
    // res.send({ status: "Success", message: equipments });
    // res.render("")
  } else {
    req.flash("error", "No Favs Found");
    return res.redirect("/equipment");
    // res.send({ status: "Failure", message: "No Favourites added yet" });
  }

});
router.post("/add/favourites/:_id/:equipment_id/:star", async function (req, res) {
  if (!req.params._id == "XX") {
    res.redirect("/login")
    return
  }
  if (req.params.star == "true") {
    let test = await User.updateOne({ _id: req.params._id }, { $push: { favourites: req.params.equipment_id } });
  } else if (req.params.star == "false") {
    let test = await User.updateOne({ _id: req.params._id }, { $pull: { favourites: req.params.equipment_id } });
  }

  req.flash("success", req.params.star == "true" ? "Added To Favorites" : "Removed from Favorites");
  res.redirect("/equipment")
  // res.send({ status: "Success" });

  // let favEquipments = [];
  // console.log(req.params._id, req.params.equipment_id);
  // // return
  // const favouriteSearch = await Favorite.findOne({
  //   $and: [
  //     { "author.id": new ObjectId(req.params._id) },
  //     { "parent.id": req.params.equipment_id },
  //   ],
  // });
  // if (!favouriteSearch) {
  //   const Fav = new Favorite({
  //     "author.id": new ObjectId(req.params._id), //_id of the author
  //     "parent.id": req.params.equipment_id
  //   });
  //   Fav.save(function (err, saved) {
  //     if (saved) {
  //       req.flash("success", "Added To Fav");
  //       res.redirect("/equipment")
  //       // res.send({ status: "Success" });
  //     } else {
  //       req.flash("error", "Something went wrong.");
  //     }
  //   });
  // } else {
  //   req.flash("error", "Already Added to fav");
  //   res.redirect("/equipment")
  //   // res.send({ status: "Success" });
  // }
});
router.get("/", async function (req, res) {
  let pageSize = config.equip.maxResultsPerPage;
  let equipmentCount = 0;
  let equipment = [];
  let pageType = "all";
  let pageNumber = req.query.pageNumber || 1;

  let filters = {};

  if (req.query.miningMethod) {
    filters.miningMethod = { $in: req.query.miningMethod.split(",") };
  }
  if (req.query.mineral) {
    filters.mineral = { $in: req.query.mineral.split(",")};
  }
  if (req.query.miningType) {
    filters.miningType = { $in: req.query.miningType.split(",")};
  }
  if (req.query.miningActivity) {
    filters.mineActivity = { $in: req.query.miningActivity.split(",") };
  }
  if (req.query.miningCycle) {
    filters.miningCycle = { $in: req.query.miningCycle.split(",") };
  }

  if (req.query.energySource) {
    filters.energySource = { $in: req.query.energySource.split(",") };
  }
  if (req.query.LogisticsAndMaterials) {
    filters.LogisticsAndMaterials = { $in: req.query.LogisticsAndMaterials.split(",") };
  }
  if (req.query.ITComms) {
    filters.ITComms = { $in: req.query.ITComms.split(",") };
  }
  if (req.query.reefType) {
    filters.reefType = { $in: req.query.reefType.split(",") };
  }
  //console.log("Filters" , filters);  
  [equipment, equipmentCount] = await equipmentService.getEquipments(
    pageNumber,
    pageSize,
    req.user,
    filters
  );

  equipment = await equipmentService.addFavoriteField(equipment, req);  
  let noMatch;
  if (equipment.length > 0) {
    noMatch = null;
  } else {
    noMatch = "Sorry, there are no results for that query, please try again.";
  }
  //console.log("LISSSSST", pageNumber, noMatch,equipmentCount,pageSize,equipment);
  res.render("equipment/index", {
    equipment: equipment,
    pageType: pageType,
    pageNumber: Number(pageNumber),
    numPages: Math.ceil(equipmentCount / pageSize),
    noMatch: noMatch,
    filters: {
      miningMethod: filters.miningMethod ? filters.miningMethod.$in : [],
      mineral: filters.mineral ? filters.mineral.$in : [],      
      miningType: filters.miningType ? filters.miningType.$in : [],  
      miningActivity: filters.mineActivity ? filters.mineActivity.$in : [],
      miningCycle: filters.miningCycle ? filters.miningCycle.$in : [],
      energySource: filters.energySource ? filters.energySource.$in : [],
      LogisticsAndMaterials: filters.LogisticsAndMaterials ? filters.LogisticsAndMaterials.$in : [],
      ITComms: filters.ITComms ? filters.ITComms.$in : [],
      reefType: filters.reefType ? filters.reefType.$in : [],
    },
  });
});

async function getEquipmentById(equipmentIds, req, res) {
  let equipment = [];
  let tempArr;
  if (Array.isArray(equipmentIds)) {
    tempArr = equipmentIds;
  } else {
    if (!equipmentIds) {
      tempArr = [];
      return;
    }
    tempArr = equipmentIds.split(",");
  }
  //console.log("LAST", tempArr);
  for (let id of tempArr) {
    let foundEquipment = await Equipment.findById(id)
      .populate("features images datasheets specifications")
      .exec()
      .catch(function (err) {
        req.flash("error", "Product compare encountered an error");
        return res.redirect("/equipment");
      });
    if (foundEquipment) {
      equipment.push(foundEquipment);
    }
  }

  return equipment;
}

router.post("/compare", async function (req, res) {
  let ids = req.body.id;
  let equipments = await getEquipmentById(ids, req, res);
  if (equipments.length > 1) {
    //console.log("FINAL", equipments);
    res.render("equipment/compare", {
      productList: equipments,
    });
  } else {
    req.flash({
      status: "Failure",
      message: "Please select more than one equipment to compare.",
    });
    return res.redirect("/equipment");
  }
});

router.get("/all", async function (req, res) {
  let equipments = await Equipment.find().populate(
    "features images datasheets specifications"
  );
  let approved = [];
  let pending = [];
  let rejected = [];
  if (equipments.length > 0) {
    for (const element of equipments) {
      if (element.approvalStatus == "rejected") {
        rejected.push(element);
      } else if (
        element.approvalStatus == "pending" ||
        !element.approvalStatus ||
        element.approvalStatus == undefined ||
        (element.approvalStatus == null && element.isAdmin == false)
      ) {
        pending.push(element);
      } else if (element.approvalStatus == "approved") {
        approved.push(element);
      }
    }
    res.send({
      status: "Success",
      approved: approved,
      pending: pending,
      rejected: rejected,
    });
  } else {
    res.send({ status: "Failure", message: "No Equipments added yet." });
  }
});
router.get("/related/products", async function (req, res) {
  // let searchedKey = new RegExp(req.params.miningtype, "i");
  let all = []
  let Drilling = []
  let Blasting = []
  let Cleaning = []
  let Supporting = []
  let equipments = await Equipment.find({
    $and: [{ approvalStatus: "approved" }],
  })
    .sort({ created_date: 1 })
    .populate("features images datasheets specifications");
  equipments.forEach(function (s) {
    //console.log(s.mineActivity)
    if (s.mineActivity.includes("Drilling")) {
      Drilling.push(s);
    } else if (s.mineActivity.includes("Blasting")) {
      Blasting.push(s);
    } else if (s.mineActivity.includes("Cleaning")) {
      Cleaning.push(s);
    } else if (s.mineActivity.includes("Supporting")) {
      Supporting.push(s);
    }
  })
  if (equipments.length > 0) {
    res.send({ status: "Success", all: equipments, Drilling: Drilling, Blasting: Blasting, Cleaning: Cleaning, Supporting: Supporting });
  } else {
    res.send({
      status: "Failure",
      message: "No Related products found.",
    });
  }
});
router.post("/applyFilters", async function (req, res) {
  let all = []
  let keyArray = req.body.keyArray
  //console.log(keyArray, typeof keyArray);
  let equipments = await Equipment.find({
    $and: [{ approvalStatus: "approved" }],
  })
    .sort({ created_date: 1 })
    .populate("features images datasheets specifications");
  equipments.forEach(function (s) {
    //   console.log(s.mineActivity)
    keyArray.forEach(function (u) {
      if (!s.mineralArr || !s.miningCycleArr || !s.miningMethodArr || !s.mineActivityArr) {
        if (s.mineral.includes(u) || s.miningMethod.includes(u) || s.mineActivity.includes(u) || s.miningCycle.includes(u)) {
          all.push(s)
        }
      } else if (s.mineral.includes(u) || s.miningMethod.includes(u) || s.mineActivity.includes(u) || s.miningCycle.includes(u) || { mineralArr: { "$in": [u] } } || { miningCycleArr: { "$in": [u] } } || { mineActivityArr: { "$in": [u] } } || { miningMethodArr: { "$in": [u] } }) {

        all.push(s)

      } else {
        all = []
      }
      // console.log(s.mineral.includes(u), s.miningMethod.includes(u), s.mineActivity.includes(u), s.miningCycle.includes(u), s.mineralArr.filter(o => o == u), s.miningCycleArr.filter(o => o == u), s.mineActivityArr.filter(o => o == u), s.miningMethodArr.filter(o => o == u))
    })
  })
  if (equipments.length > 0) {
    res.send({ status: "Success", all: all });
  } else {
    res.send({
      status: "Failure",
      message: "No Equipments found.",
    });
  }
});

router.get("/search", async function (req, res) {
  let searchedKey = new RegExp(req.query.search, "i");
  let searchedNames = [];
  let equipments = await Equipment.find({
    $or: [
      { name: { $regex: new RegExp(searchedKey, "i") } },
      { type: { $regex: new RegExp(searchedKey, "i") } },
      { oem: { $regex: new RegExp(searchedKey, "i") } },
      { miningCycle: { $regex: new RegExp(searchedKey, "i") } },
      { mineActivity: { $regex: new RegExp(searchedKey, "i") } },      
      { mineral: { $regex: new RegExp(searchedKey, "i") } },
      { miningMethod: { $regex: new RegExp(searchedKey, "i") } },
    ],
  }).populate("features images datasheets specifications");
  if (equipments.length > 0) {
    for (const element of equipments) {
      if (element.name.search(new RegExp(req.query.search, "i")) !== -1) {
        searchedNames.push(element.name);
      }
      if (element.type.search(new RegExp(req.query.search, "i")) !== -1) {
        searchedNames.push(element.type);
      }
      if (element.oem.search(new RegExp(req.query.search, "i")) !== -1) {
        searchedNames.push(element.oem);
      }
      if (
        element.miningCycle.search(new RegExp(req.query.search, "i")) !== -1
      ) {
        searchedNames.push(element.miningCycle);
      }
      if (
        element.mineActivity.search(new RegExp(req.query.search, "i")) !== -1
      ) {
        searchedNames.push(element.mineActivity);
      }
      if (element.mineral.search(new RegExp(req.query.search, "i")) !== -1) {
        searchedNames.push(element.mineral);
      }
      if (
        element.miningMethod.search(new RegExp(req.query.search, "i")) !== -1
      ) {
        searchedNames.push(element.miningMethod);
      }
    }
    res.send({ status: "Success", records: equipments, list: searchedNames });
  } else {
    res.send({ status: "Failure", message: "Matching Records Not Found" });
  }
});

//NEW - Displays a form to create new equipment
router.get("/new",
  middleware.isLoggedIn,
  middleware.isActive,
  function (req, res) {
    res.render("equipment/new");
  }
);

// CREATE - Add a new element to DB
router.post("/",
  middleware.isLoggedIn,
  middleware.isActive,
  middleware.isApprovedMemsaUser,
  middleware.sanitizeEquipmentData,
  function (req, res) {
    const { error } = validateEquipmentData(req.body.equipment);
    if (error) {
      req.flash("error", error.details[0].message);
      return res.status(400).redirect("/equipment/new");
    }

    req.body.equipment.author = {
      id: req.user._id,
      username: req.user.username,
    };

    req.body.equipment.verified = "No";
    if (
      req.user.isAdmin == true ||
      (req.user.status == "approved" && req.user.userType == "memsa")
    ) {
      Equipment.create(req.body.equipment, function (err, newlyCreated) {
        if (err && err.code === 11000) {
          req.flash(
            "error",
            "Equipment name already exists. Please use a different name."
          );
          return res.redirect("/equipment/new");
        }
        if (err) {
          req.flash("error", err.message);
          return res.redirect("/equipment/new");
        }
        res
          .status({
            status: "Success",
            message: "Equipment added successfully ",
          })
          .redirect("/equipment/");
      });
    } else {
      req.flash(
        "error",
        "User status is in pending state and doesnt have rights to add equipment ."
      );
      res.send({
        status: "Failure",
        message:
          "User status is in pending state and doesnt have rights to add equipment .",
      });
    }
  }
);

// SHOW - Display more information about an element
// router.get("/compare", async function (req, res) {
//   // let equipments = await getEquipmentById(ids);
//   console.log("ZZZZZZZZZZZZZZ", equipments);

//   res.render("equipment/compare", {
//     filters: {
//       miningType: [],
//       miningMethod: [],
//       mineral: [],
//       miningActivity: [],
//       miningCycle: [],
//     },
//   });
// });

router.get("/:id", async function (req, res) {
  await Equipment.findById(req.params.id)
    .populate("features images datasheets specifications")
    .exec(async function (err, foundEquipment) {
      if (err || !foundEquipment) {
        req.flash(
          "error",
          "Sorry, show equipment details error encountered. Equipment not found."
        );
        res.redirect("back");
      } else {
        //Find equipment with same Mining Activity and Mining Method for a given/shown id
        let relatedEquipment;
        if(foundEquipment.mineActivity && foundEquipment.miningMethod)
        {
          var queryStringActivity =  foundEquipment.mineActivity.split(';');
          var queryStringMethod =  foundEquipment.miningMethod.split(';');
          relatedEquipment = await Equipment.find({ $or:[{"mineActivity" : { $in : queryStringActivity}},{"miningMethod" : { $in : queryStringMethod}}]}).limit(3).populate("features images datasheets specifications").then(res => {return res}).catch(err => {
            console.log(err)
            return [{"error" : err}]
          });
        }    
       
  

        //

        await User.findById(foundEquipment.author.id).exec(function (
          err,
          foundUser
        ) {
          if (err || !foundUser) {
            req.flash(
              "error",
              "Show equipment details error. Supplier details not found."
            );
            res.redirect("back");
          } else {
            foundUser.username = "";
            foundUser.password = "";
            foundUser.status = "";
            foundUser.companyReg = "";
            foundUser.vatNumber = "";
            res.render("equipment/show", {
              equipment: foundEquipment,
              user: foundUser,    
              relatedEquipment
            });
          }
        });
      }
    });
});

// UDATE Equipment Form
router.get(
  "/:id/edit",
  middleware.isLoggedIn,
  middleware.isActive,
  middleware.checkEquipmentOwnership,
  async function (req, res) {
    //console.log("loading Equipment Form using get");
    await Equipment.findById(req.params.id)
      .populate("features images datasheets specifications")
      .exec(async function (err, foundEquipment) {
        if (err || !foundEquipment) {
          req.flash(
            "error",
            "Sorry, show equipment details error encountered. Equipment not found."
          );
          res.redirect("back");
        } else {
          await User.findById(foundEquipment.author.id).exec(function (
            err,
            foundUser
          ) {
            if (err || !foundUser) {
              req.flash(
                "error",
                "Show equipment details error. Supplier details not found."
              );
              res.redirect("back");
            } else {
              foundUser.username = "";
              foundUser.password = "";
              foundUser.status = "";
              foundUser.companyReg = "";
              foundUser.vatNumber = "";
              res.render("equipment/edit", {
                equipment: foundEquipment,
                user: foundUser,
              });
            }
          });
        }
      });
  }
);

// UPDATE equipment ROUTE
router.put(
  "/:id",  
  middleware.isLoggedIn,
  function (req, res) {
    //console.log("updating Equipment Form using put");
    //console.log("UPDATE equipment ROUTE");
    const { error } = validateEquipmentData(req.body.equipment);
    if (error) {
      console.log("Update equipment error: "+ error);
      req.flash("error", error.details[0].message);
      return res.status(400).redirect("/equipment/" + req.params.id + "/edit");
    }

    Equipment.updateOne(
      { _id: req.params.id },
      { $set: req.body.equipment },
      function (err, updatedEquipment) {
        if (err) {
          req.flash(
            "error",
            "Update equipment error. Could not update equipment details."
          );
          console.log("Update equipment error1: "+ err);
          return res
            .status(400)
            .redirect("/equipment/" + req.params.id + "/edit");
        } else {
          console.log("Update Success");
          req.flash(
            "Success",
            "Updated equipment successfully."
          );
          res.redirect("/equipment/" + req.params.id);
        }
      }
    );
  }
);

//approve or reject equipment
router.put(
  "/approve/equipment",
  // middleware.isAdmin,
  async function (req, res) {
    console.log("equipment approve or reject form");
    let equipment = await Equipment.findOne({ _id: req.query.id });
    //console.log(equipment)
    if (!equipment) {
      req.flash(
        "error",
        "Update equipment error. Could not update equipment status."
      );
      return res.status(400);

    }
    let user = await User.findOne({ _id: equipment.author.id });
    let text;
    let status;
    await Equipment.updateOne(
      { _id: req.query.id },
      {
        $set: { approvalStatus: req.query.status, comment: req.query.reason },
      },
      async function (err, updatedEquipment) {
        if (err) {
          req.flash(
            "error",
            "Update equipment error. Could not update equipment status."
          );
          return res.status(400);
          // .redirect("/equipment/" + req.params.id + "/edit");
        } else {
          if (req.query.status == "approved") {
            text =
              "<p>Hello , Your Equipment " +
              equipment.name +
              " have been " +
              req.query.status +
              " by TARA .</p>";
            status = "Approved";
          } else {
            text =
              "<p>Hello , Your Equipment " +
              equipment.name +
              " have been " +
              req.query.status +
              " by TARA .</p> <br>Reason-" +
              req.query.comment +
              "</br>";
            status = "Rejected";
          }
          let subject = "Equipment Status - " + status;
          let body = text;
          let toMail = user.email;
          console.log(toMail);
          try {
            mail.sendEmail(subject, body, toMail);
          } catch (e) {
            console.log("mail not sent");
          }
          res.send({
            status: "Success",
            message: "Equipment Succesfully " + req.query.status,
          });
        }
      }
    );
  }
);

// DESTROY equipment ROUTE - cascade deletes through the Feature, Images, and Datasheets
router.delete(
  "/:id",
  function (req, res) {
    console.log("equipment delete by id using delete in equipment js");
    Equipment.findById(req.params.id)
      .populate("features images datasheets specifications")
      .exec(function (err, foundEquipment) {
        if (err || !foundEquipment) {
          req.flash(
            "error",
            "Delete equipment error. Could not find equipment."
          );
          res.redirect("/equipment");
        } else {
          try {
            for (let i = 0; i < foundEquipment.datasheets.length; i++) {
              fs.unlink(
                "./public" + foundEquipment.datasheets[i].file,
                function (err) {
                  if (err) {
                    req.flash(
                      "error",
                      `Delete equipment error. Error deleting datasheet file.`
                    );
                    return res.redirect("/equipment");
                  } else {
                    foundEquipment.datasheets[i].remove(function (err) {
                      if (err) {
                        req.flash(
                          "error",
                          `Delete equipment error. Error deleting datasheet.`
                        );
                        return res.redirect("/equipment");
                      }
                    });
                  }
                }
              );
            }
            for (let i = 0; i < foundEquipment.images.length; i++) {
              fs.unlink(
                "./public" + foundEquipment.images[i].file,
                function (err) {
                  if (err) {
                    req.flash(
                      "error",
                      `Delete equipment error. Error deleting image file.`
                    );
                    return res.redirect("/equipment");
                  } else {
                    foundEquipment.images[i].remove(function (err) {
                      if (err) {
                        req.flash(
                          "error",
                          `Delete equipment error. Error deleting image file.`
                        );
                        return res.redirect("/equipment");
                      }
                    });
                  }
                }
              );
            }
            for (let i = 0; i < foundEquipment.features.length; i++) {
              foundEquipment.features[i].remove(function (err) {
                if (err) {
                  req.flash(
                    "error",
                    `Delete equipment error. Error deleting feature.`
                  );
                  return res.redirect("/equipment");
                }
              });
            }
            for (let i = 0; i < foundEquipment.specifications.length; i++) {
              foundEquipment.specifications[i].remove(function (err) {
                if (err) {
                  req.flash(
                    "error",
                    `Delete equipment error. Error deleting specification.`
                  );
                  return res.redirect("/equipment");
                }
              });
            }
          } catch (err) {
            req.flash("error", "Delete equipment error.");
            return res.redirect("/equipment");
          }
          try {
            foundEquipment.remove();
            req.flash("success", "Equipment deleted");
            res.redirect("/equipment");
            req.flash("success", "Equipment deleted");
          } catch (err) {
            req.flash(
              "error",
              "Delete equipment error. Error deleting equipment."
            );
            res.redirect("/equipment");
          }
        }
      });
  }
);

// THIS WAS THE PREVIOUS VERSION - ONE ABOVE HAS BETTER ERROR CHECK, LEAVING IT HERE FOR NOW
// // DESTROY equipment ROUTE - cascade deletes through the Feature, Images, and Datasheets
// router.delete("/:id",
//     middleware.isLoggedIn,
//     middleware.isActive,
//     middleware.checkEquipmentOwnership,
//     function (req, res) {

//         Equipment.findById(req.params.id).populate('features images datasheets specifications').exec(function (err, foundEquipment) {
//             if (err || !foundEquipment) {
//                 req.flash("error", "Delete equipment error. Could not find equipment data.");
//                 res.redirect("/equipment");
//             } else {
//                 try {
//                     for (let i = 0; i < foundEquipment.datasheets.length; i++) {
//                         fs.unlink('./public' + foundEquipment.datasheets[i].file, function (err) {
//                             if (err) {
//                                 req.flash("error", `Delete equipment error. Error deleting datasheet file.`);
//                                 return res.redirect("/equipment");
//                             }
//                         });
//                         foundEquipment.datasheets[i].remove();
//                     }
//                     for (let i = 0; i < foundEquipment.images.length; i++) {
//                         fs.unlink('./public' + foundEquipment.images[i].file, function (err) {
//                             if (err) {
//                                 req.flash("error", `Delete equipment error. Error deleting image file.`);
//                                 return res.redirect("/equipment");
//                             }
//                         });
//                         foundEquipment.images[i].remove();
//                     }
//                     for (let i = 0; i < foundEquipment.features.length; i++) {
//                         foundEquipment.features[i].remove();
//                     }
//                     for (let i = 0; i < foundEquipment.specifications.length; i++) {
//                         foundEquipment.specifications[i].remove();
//                     }
//                 } catch (err) {
//                     req.flash("error", "Delete equipment error.");
//                     return res.redirect("/equipment");
//                 }
//                 try {
//                     foundEquipment.remove();
//                     req.flash("success", "Equipment deleted");
//                     res.redirect("/equipment");
//                 } catch (err) {
//                     req.flash("error", "Error deleting equipment");
//                     res.redirect("/equipment");
//                 }
//             }
//         });
//     }
// );

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
