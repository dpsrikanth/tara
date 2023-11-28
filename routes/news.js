var express = require("express");
var router = express.Router();
var Newsall = require("../models/news");
var fs = require("fs");
var config = require("../config");
const ObjectId = require("mongoose").Types.ObjectId;
var middleware = require("../middleware");
var emailUpdates = require("../models/emailupdates");
var Newsletters = require("../models/newsletter");
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: config.mail.service,
  auth: config.mail.auth,
});

//render all news posts
router.get("/", async function (req, res) {
  const filter = {};
  const newsitems = await Newsall.find(filter,null,{sort: {editedOn: -1}})
  res.render("news/allnews", { newsitems: newsitems });
});

//render all news posts
router.get("/allnews", async function (req, res) {
  const filter = {};
  const newsitems = await Newsall.find(filter);
  res.render("news/allnews", newsitems);
});

//render add page
router.get("/add", function (req, res) {
  res.render("news/add");
});

//render edit page
router.get("/:id", async function (req, res) {
  const filter = { _id: req.query.id };
  const newsitem = await Newsall.find(filter);
  res.render("news/edit", { newsitem: newsitem });
});
const decodeEscapedHTML = (html) =>{
  html = html.replace(/&nbsp;/gi, " ");
  html = html.replace(/&amp;/gi, "&");
  html = html.replace(/&quot;/gi, `"`);
  html = html.replace(/&lt;/gi, "<");
  html = html.replace(/&gt;/gi, ">");
  return html;
}


//adding a post
router.post("/add",
  middleware.isLoggedIn,
  middleware.isActive,
  middleware.isAdmin,
  async function (req, res) {
    //console.log(typeof req.body);
    let _Newsletters = Newsletters.Newsletter;
    let newNewsItem = req.body
    if (req.user.isAdmin == true && req.user.status == "approved") {
      newNewsItem['createdBy'] = req.user.username;
      newNewsItem['createdOn'] = new Date().toISOString();
      newNewsItem['editedBy'] = req.user.username;
      newNewsItem['editedOn'] = new Date().toISOString();
      try {
        await Newsall.create({
          newsTitle: newNewsItem.newsTitle,
          newsContent: newNewsItem.newsContent,
          createdOn: new Date().toString(),
          createdBy: req.user.username,
          editedOn: new Date().toString(),
          editedBy: req.user.username
        }).then(async result => {          
          let Newsletters_obj = await _Newsletters.find({}).catch(function (err) {
            console.log(err);
          });
          if (Newsletters_obj && Newsletters_obj.length > 0) {
            Newsletters_obj.forEach(async (obj) => {
              const emailObj = new emailUpdates({
                emailSubject: newNewsItem.newsTitle,
                emailCotnent: newNewsItem.newsContent,
                to: obj.email,
                status: 1
              });
              await emailObj.save();
            });
          }          
          try {
            let emailUpdates_obj = await emailUpdates.find({ status: 1 }).catch(function (err) {
              console.log(err);
            });

            if (emailUpdates_obj && emailUpdates_obj.length > 0) {
              emailUpdates_obj.forEach((emailobj1) => {
                let mailOptions = {
                  from: 'miningtaramemsa@gmail.com',
                  to: emailobj1.to,
                  subject: emailobj1.emailSubject,
                  html: decodeEscapedHTML(emailobj1.emailCotnent)
                };
                // Sending Email
                transporter.sendMail(mailOptions, function (err, info) {
                  if (err) {
                    emailobj1.status=3;
                    emailobj1.statusDescription=err;                    
                    emailobj1.save();
                    fs.appendFile("logs.txt", err + " on " + new Date().toUTCString() + "\n", function (err) {
                      if (err) throw err;
                      //console.log("Status Logged!");
                    });
                  } else {
                    console.log("Email sent successfully");
                    emailobj1.status=2;
                    emailobj1.statusDescription=err;
                    emailobj1.sentOn=new Date().toISOString();
                    emailobj1.save();
                    fs.appendFile("logs.txt", mailOptions.to + " mail sent. on " + new Date().toUTCString() + "\n", function (err) {
                      if (err) throw err;
                      //console.log("Status Logged!");
                    });
                  }
                });
              });
            }
          }
          catch (ex) {
            console.log(ex);
          }

        });
        return res.status(200).send({ status: "Success", message: "news item added successfully " });
      } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
      }
    }
    else {
      res.status(502).send({ status: "Failure", message: "Only admin users can add news items", });
    }
  });

//updating newsitem based on item
router.post("/edit",
  middleware.isLoggedIn,
  middleware.isActive,
  middleware.isAdmin,
  async function (req, res) {
    //console.log(req.body);
    let newNewsItem = req.body
    let _Newsletters = Newsletters.Newsletter;
    if (req.user.isAdmin == true && req.user.status == "approved") {
      try {
        await Newsall.findByIdAndUpdate(newNewsItem.id, {
          newsTitle: newNewsItem.newsTitle,
          newsContent: newNewsItem.newsContent,          
          editedOn: new Date().toString(),
          editedBy: req.user.username
        }).then(async result => {          
          let Newsletters_obj = await _Newsletters.find({}).catch(function (err) {
            console.log(err);
          });
          if (Newsletters_obj && Newsletters_obj.length > 0) {
            Newsletters_obj.forEach(async (obj) => {
              const emailObj = new emailUpdates({
                emailSubject: newNewsItem.newsTitle,
                emailCotnent: newNewsItem.newsContent,
                to: obj.email,
                status: 1
              });
              await emailObj.save();
            });
          }

          try {
            let emailUpdates_obj = await emailUpdates.find({ status: 1 }).catch(function (err) {
              console.log(err);
            });

            if (emailUpdates_obj && emailUpdates_obj.length > 0) {
              emailUpdates_obj.forEach((emailobj2) => {                
                let mailOptions = {
                  from: 'miningtaramemsa@gmail.com',
                  to: emailobj2.to,
                  subject: emailobj2.emailSubject,
                  html: decodeEscapedHTML(emailobj2.emailCotnent)
                };
                // Sending Email
                transporter.sendMail(mailOptions, function (err, info) {
                  if (err) {
                    emailobj2.status=3;
                    emailobj2.statusDescription=err;                    
                    emailobj2.save();
                    fs.appendFile("logs.txt", err + " on " + new Date().toUTCString() + "\n", function (err) {
                      if (err) throw err;
                      //console.log("Status Logged!");
                    });
                  } else {
                    console.log("Email sent successfully");
                    emailobj2.status=2;
                    emailobj2.statusDescription=err;
                    emailobj2.sentOn=new Date().toISOString();
                    emailobj2.save();
                    fs.appendFile("logs.txt", mailOptions.to + " mail sent. on " + new Date().toUTCString() + "\n", function (err) {
                      if (err) throw err;
                      //console.log("Status Logged!");
                    });
                  }
                });
              });
            }
          }
          catch (ex) {
            console.log(ex);
          }

        });
        return res.status(200).send({ status: "Success", message: "news item updated successfully" });
      } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
      }
    }
    else {
      res.status(502).send({ status: "Failure", message: "Only admin users can add news items", });
    }
  });

//delete item based on id
router.post("/delete",
  middleware.isLoggedIn,
  middleware.isActive,
  middleware.isAdmin,
  async function (req, res) {
    let newNewsItem = req.body
    if (req.user.isAdmin == true && req.user.status == "approved") {
      try {
        Newsall.findOneAndDelete({ _id: newNewsItem.id }, function (err, docs) {
          if (err) {
            console.log(err.message);
            return res.status(500).send({ status: "error", message: err });
          }
          else {
            return res.status(200).send({ status: "Success", message: "news item deleted successfully" });
          }
        });

      } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
      }
    }
    else {
      res.status(502).send({ status: "Failure", message: "Only admin users can add news items", });
    }
  });


//get all news items in descending order
module.exports = router;