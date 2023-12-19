// Importing packages
const cron = require("node-cron");
const nodemailer = require("nodemailer");
var emailUpdates = require("./models/emailupdates");
const express = require("express");

app = express();
// Calling sendEmail() function every 1 minute
cron.schedule("*/1 * * * *", function() {
    sendMail();
    });

  
// Send Mail function using Nodemailer
async function sendMail() {
    console.log("asdf");
    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
        user: "miningtaramemsa@gmail.com",
        pass: "rczkvolhkxngeoes"
        }
    });
    console.log("asdf1");
    try
    {
        let emailUpdates_obj = await emailUpdates.find({status: 1}).catch(function (err) {
            console.log(err);
          });
          console.log("asdf2");
        if (emailUpdates_obj && emailUpdates_obj.length > 0) {
            console.log("asdf3",emailUpdates_obj.length);
        emailUpdates_obj.forEach((emailobj) => {
            let mailDetails = {
                from: 'miningtaramemsa@gmail.com',
                to: emailobj.to,
                subject: emailobj.emailSubject,
                html: emailobj.emailCotnent
            };                          
            // Sending Email
            mailTransporter.sendMail(mailDetails, function(err, data) {
                if (err) {
                    console.log("Error Occurs", err);
                    fs.appendFile("logs.txt", err + " on " + new Date().toUTCString() +"\n", function(err) {          
                        if (err) throw err;                          
                        console.log("Status Logged!");
                    });
                } else {
                    console.log("Email sent successfully");
                    fs.appendFile("logs.txt", mailDetails.to + " mail sent. on " + new Date().toUTCString() +"\n", function(err) {          
                        if (err) throw err;                          
                        console.log("Status Logged!");
                    });
                }
            });
        });          
       }
    }
    catch(ex){
        console.log(ex);
    }    
}

app.listen(3000);