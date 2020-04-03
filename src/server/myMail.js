const express = require('express');
const app = express();
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'requestme.project.system',
    pass: 'pleasedontstealthisacc1' //i know this is unsecure, but come on- let me have some shortcuts and please dont steal it :) 
  }
});

function createMailOptions(toAdress, id, owner, request){
var mailOptions = {
  from: 'requestme.project.system@gmail.com',
  to: toAdress,
  subject: 'Your request (id:'+id+') was fulfilled!',
  text: 'Hello '+owner+' \nyour request (id:'+id+') was fulfilled: \n\"'+request+'\"'
  
};
return mailOptions;
}

module.exports = {
    sendMail: function (toAdress, id, owner, request){


transporter.sendMail(createMailOptions(toAdress, id, owner, request), function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}
);

console.log(request);


}
}