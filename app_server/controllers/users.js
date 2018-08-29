const bdPath = require('../bdApiCalls');
const statsApi = require('../statsApiCalls');

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
              usuario.cuentas = {}
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
  if(req.body.email !== "admin"){
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
  } else{
    res.status(400)
    res.send(" Escriba un email válido ")
  }
};

const nuevaPass = function(req,res){
  bdPath.getUsuarios({email:req.body.email},
      function (err,resBd,body) {
        if(err){
            console.log('usuario no encontrado');
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
              else{
                if(!body.error){
                  statsApi.createStat({id: actualizado._id, email: actualizado.email, fecha: actualizado.entradaApp},
                  function(){
                    statsApi.updateAccess({id: actualizado._id}, function(){
                      res.status(200);
                      res.json({next:'/frontend/pages/index'});
                    })          
                  })
                }
                else{
                  res.status(500);
                  res.send(error);
                }
              }
            }
          )
        });
      });
};

function check (req,res, actualizado) {
  var passModified = false
  if(req.body.nombre !== undefined && req.body.nombre !== ""){
    actualizado.nombre = req.body.nombre
  }
  if(req.body.apellidos !== undefined && req.body.apellidos !== ""){
    actualizado.apellidos = req.body.apellidos
  }
  if(req.body.newEmail !== undefined && req.body.newEmail !== ""){
    actualizado.email = req.body.newEmail
  }
  if(req.body.password !== undefined && 
    req.body.password !== CryptoJS.SHA256("").toString(CryptoJS.enc.Base64)){
    passModified = true
  }
  bcrypt.hash(req.body.password,5).then(function (hash) {
    if(passModified === true){
      actualizado.password = hash
    }
    bdPath.putUsuariosEmail(actualizado,req.body.email,
      function (err,resBd,body) {
        console.log(body)
        if(err){
          res.status(500);
          res.send(err);
        }
        else{
          if(body.error === false){
            res.status(200);
            res.json(body);
          }
          else{
            if(body.message === "Error adding data"){
              res.status(400);
              res.send({"error": "Los datos no se han modificado correctamente en la base de datos"})
            }
            else{
              res.status(400);
              res.send({"error": "No se ha modificado ningún campo. Rellene los campos e intentelo de nuevo"})
            }
          }
        }
      })
  })
  
}

const editUser = function(req,res){
  bdPath.getUsuarios({email: req.body.email},
      function (err,resBd,body) {
        if(err){
            console.log('usuario no encontrado');
          res.status(500);
          res.send(err);
        }
        console.log(req.body)
        var actualizado = body.message[0];
        if(req.body.newEmail !== req.body.email){
          console.log(req.body.newEmail)
          bdPath.getUsuarios({email: req.body.newEmail}, function (err,resBd,bod){
            if(err){
              res.status(400);
              res.send({"error": "Error en la base de datos"});
            }
            else if(bod.message[0] !== undefined){
              console.log(bod)
              res.status(400);
              res.send({"error": "El email solicitado ya existe, vuelva a intentarlo con un nuevo email."})
            }
            else{
              check(req,res,actualizado)
            }
          })
        }
        else{
          check(req,res,actualizado)
        }
  });
};


/**
 * Eliminar el usuario.
 * @param req
 * @param res
 */
const deleteUser = function(req, res){
  console.log("He entrado en deleteUser")
  console.log(req.query)
  var query = {}
  if(req.user.email !== undefined){  // Local
    query = {
      email: req.user.email
    };
  }
  else if(req.user.emails !== undefined){ // google no va???
    query = {
      email: req.user.emails[0]
    };
  }
  if(req.query.email !== undefined){ // llamadas desde controlador
    query = {
      email: req.query.email
    };
  }
  console.log(query)
  bdPath.deleteUsuarios(query,
    function (err, resbd,body) {
      if (err) {
        console.log(err);
        return;
      }
      else{
        if(!body.error){
          statsApi.updateBaja({id: body.message._id, fecha: new Date()});
        }
      }
  });
  if(!req.user.admin){
    if(req.cookies.user_sid){
      res.clearCookie('user_sid');
    }
    res.redirect('/');
  }
  else{
    bdPath.getUsuarios({},function (err, resBd,body) {
      if (err) {
        console.log(err);
        return;
      }
      else{
        res.json(body.message);
      }
    })
  }
};

/**
 * Información de perfil de usuario.
 * @param req
 * @param res
 */
const getUser = function(req,res){
  var user = ""
  if(req.user !== undefined){
    user = req.user.email !== undefined ? req.user.email : req.user.emails[0];
  }
  if(req.query.email !== undefined && req.query.email !== ""){
    user = req.query.email
  }
  console.log(user);
  bdPath.getUsuarios({email: user},function (err,resBd,body) {
      if(err){
          res.status(500);
          res.send(err);
      }else{
          res.json(body.message[0]);
      }

  })
};

/**
 * Información de perfil de usuario.
 * @param req
 * @param res
 */
const getUsers = function(req,res){
  bdPath.getUsuarios({},function (err,resBd,body) {
      if(err){
          res.status(500);
          res.send(err);
      }else{
          console.log(body)
          res.json(body.message);
      }

  })
};

module.exports = {
    postUsers: postUsers,
    deleteUser: deleteUser,
    nuevaPass: nuevaPass,
    recoverPass: recoverPass,
    getUser: getUser,
    getUsers: getUsers,
    editUser: editUser
};