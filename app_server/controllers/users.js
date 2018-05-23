const bdPath = require('../../bin/bdApiCalls');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const ethmail = 'ucso5tvh2lduroxg@ethereal.email';
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: ethmail,
    pass: 'zfyZVHFC5rqU7uTtXJ'
  }
});

const postUsers = function(req,res){
  bdPath.getUsuarios({email: req.body.email},
      function (err,resBd,body) {
        if(err){
          res.status(500);
          res.send(err);
        }
        if(body.message.length !== 0){
          res.status(400);
          res.send("El usuario ya esta registrado");
        }else{
          var passGenerada = randomstring.generate({charset: 'wody',length: 10});
          var usuario = req.body;
          usuario.password = passGenerada;
          bdPath.postUsuarios(usuario,function (err,resPost,body){
            if(err){
              res.status(500);
              res.send(err);
            }
            var mail = {
              from: ethmail ,
              to: usuario.email,
              subject: 'Cuenta creada en WoodyTweetManager',
              text: 'Se ha creado con exito su cuenta. Su contraseña es '+passGenerada+
                    '\nEsta contraseña es provisional, se le pedirá que cambie su contraseña cuando acceda por primera' +
                    'vez a la aplicación',
            }
            transporter.send(mail, function (err,info) {
              if(err){console.log(err)}
              console.log(info);
            })
          });
        }
      })
}

module.exports = {
    postUsers: postUsers
};