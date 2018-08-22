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
  console.log("estoy en controllers->users.js->postUsers")
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
              console.log(passGenerada)
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

const recoverPass = function(req,res){
    bdPath.getUsuarios({email: req.body.email},
      function (err, resBd, data) {
        if (err) {
          res.status(500);
          res.send(err);
        }
        console.log(req.body.email)
        console.log(data)
        if (data.message.length === 0) {
          res.status(400).send("El usuario no esta registrado");
        }
        else if (data.message[0].origen.indexOf("local") === -1) {
          console.log(data.message[0].origen)
          res.status(400).send("El usuario no esta registrado via local");
        }else {
          var passGenerada = randomstring.generate({charset: 'wody', length: 10});
          console.log(passGenerada)
          var usuario = data.message[0];
          usuario.primerAcceso = true;
          usuario.password = CryptoJS.SHA256(passGenerada).toString(CryptoJS.enc.Base64);
          bcrypt.hash(usuario.password, 5).then(function (hash) {
            usuario.password = hash;
            bdPath.recoverPassword(usuario, function (err, resPost, body) {
              if (err) {
                res.status(500);
                res.send(err);
              }
              var mail = {
                from: ethmail,
                to: usuario.email,
                subject: 'Recuperación de cuenta',
                text: 'Se ha restaurado con exito su cuenta. Su contraseña es ' + passGenerada +
                '\nEsta contraseña es provisional, se le pedirá que cambie su contraseña cuando acceda nuevamente ' +
                'a la aplicación',
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
          actualizado.entradaApp = new Date()
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
  res.json({next:'/frontend/indexUser'});
};

/**
 * Eliminar el usuario.
 * @param req
 * @param res
 */
const deleteUser = function(req, res){
  console.log("He entrado en deleteUser")
  var query = {error: true}
  if(req.user.email !== undefined){  // Local
    var query = {
      email: req.user.email
    };
  }
  else if(req.user.emails !== undefined){ // google no va???
    var query = {
      email: req.user.emails[0]
    };
  }
  console.log(query)
  bdPath.deleteUsuarios(query,
    function (err, res) {
      if (err) {
        console.log(err);
        return;
      }
  });
  if(req.cookies.user_sid){
    res.clearCookie('user_sid');
  }
  res.redirect('/');
};

module.exports = {
    postUsers: postUsers,
    deleteUser: deleteUser,
    nuevaPass: nuevaPass,
    recoverPass: recoverPass
};