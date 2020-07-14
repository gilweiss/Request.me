const express = require('express');
const app = express();
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'requestme.project.system',
    pass: 'pleasedontstealthisacc2' //i know this is unsecure, but come on- let me have some shortcuts and please dont steal it :) 
  }
});

function createMailOptions(toAdress, id, owner, request, date, purpose){
var mailOptions;
if (purpose === "done"){
mailOptions = {
  from: 'requestme.project.system@gmail.com',
  to: toAdress,
  subject: 'Your request (id:'+id+') from '+date+' was fulfilled!',
  text: 'Hello '+owner+' \nYour request (id:'+id+') from '+date+' was fulfilled: \n\"'+request+'\" \n\n '+
  'https://requestme.herokuapp.com/   \n (To disable updates on your request, please reply to this message)'
  
};
}
if (purpose === "adminComment"){
  mailOptions = {
    from: 'requestme.project.system@gmail.com',
    to: toAdress,
    subject: 'You got a new admin comment on your request (id:'+id+') from '+date+'',
    text: 'Hello '+owner+' \nYou got a new admin comment on your request (id:'+id+') from '+date+':  \n\"'+request+'\" \n \n '+
    'https://requestme.herokuapp.com/  \n (To disable updates on your request, please reply to this message)'
    
  };
  }


return mailOptions;
}

module.exports = {
    sendMail: function (toAdress, id, owner, request, date, purpose){


transporter.sendMail(createMailOptions(toAdress, id, owner, request, date, purpose), function(error, info){
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