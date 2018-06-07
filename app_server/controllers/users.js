const bdPath = require('../bdApiCalls');

const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const randomstring = require('randomstring');
const request = require('request');

const secretoCaptcha = '6LcF1V0UAAAAAC0Ls1I-WLWJjcxtySnVzaKDDvcF';
const ethmail = 'ucso5tvh2lduroxg@ethereal.email';
const ethpass ='zfyZVHFC5rqU7uTtXJ';
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: ethmail,
    pass: ethpass
  }
});

const postUsers = function(req,res){
  var googleCaptcha ={
    'secret':secretoCaptcha,
    'response':req.body.gRecaptcha
  };
  request.post({
    uri: "https://www.google.com/recaptcha/api/siteverify",
    form: googleCaptcha,
    json:true
  },function (err,resCaptcha,body) {
    if (err) {
      res.status(500)
      .send(err);
    }
    if (!body.success) {
      console.log(body["error-codes"]);
      res.status(400).send(body["error-codes"]).end();
    } else {

      bdPath.getUsuarios({email: req.body.email},
          function (err, resBd, body) {
            if (err) {
              res.status(500);
              res.send(err);
            }
            if (body.message.length !== 0) {
              res.status(400).send("El usuario ya esta registrado");
            } else {
              var passGenerada = randomstring.generate({charset: 'wody', length: 10});
              var usuario = req.body;
              usuario.primerAcceso = true;
              usuario.password = CryptoJS.SHA256(passGenerada).toString(CryptoJS.enc.Base64);
              bcrypt.hash(usuario.password, 5).then(function (hash) {
                usuario.password = hash;
                bdPath.postUsuarios(usuario, function (err, resPost, body) {
                  if (err) {
                    res.status(500);
                    res.send(err);
                  }
                  var mail = {
                    from: ethmail,
                    to: usuario.email,
                    subject: 'Cuenta creada en WoodyTweetManager',
                    text: 'Se ha creado con exito su cuenta. Su contraseña es ' + passGenerada +
                    '\nEsta contraseña es provisional, se le pedirá que cambie su contraseña cuando acceda por primera ' +
                    'vez a la aplicación',
                  };
                  transporter.sendMail(mail, function (err, info) {
                    if (err) {
                      console.log(err)
                    }
                    console.log(info);
                  });
                  res.status(200);
                  res.end();
                });
              });
            }
          });
    }
  });
};

const nuevaPass = function(req,res){
  bdPath.getUsuarios({email:req.body.email},
      function (err,resBd,body) {
        if(err){
          res.status(500);
          res.send(err);
        }
        var actualizado = body.message[0];
        if(actualizado.primerAcceso){
          actualizado.primerAcceso = false;
        }
        if(req.body.oldPass){
          //TODO: Cambio de contraseña desde perfil
        }
        console.log(req.body);
        bcrypt.hash(req.body.password,5).then(function (hash) {
          console.log("hasheado");
          actualizado.password = hash;
          console.log(actualizado);
          bdPath.putUsuarios(actualizado,
              function (err,resBd,body) {
                if(err){
                  res.status(500);
                  res.send(err);
                }
              })
        });
      });
  res.status(200);
  res.json({next:'/frontend/index'});
};

module.exports = {
    postUsers: postUsers,
    nuevaPass: nuevaPass
};