var mongoose = require('mongoose');
const Usuario = require('../models/user');


const usrPost = function (req, res) {
    console.log("imprimo nuevo user")
    // console.log(req.body);
    var newUser = new Usuario(req.body);
    var response = {};
    newUser.save()
        .then((newUser) => {
            response = {"error": false, "message": newUser};
            console.log(newUser);
            res.json(response);
        }).catch((err) => {
        response = {"error": true, "message": "Error adding data"};
        console.log(err)
        res.json(response);
    });
};

const usrGet = function (req, res) {
    var response = {};
    var query = {};
    console.log(req.query)
    if (req.query.email) {
        query.email = req.query.email;
    }
    if (req.query.origen) {
        query.origen = req.query.origen;
    }
    console.log(query);
    Usuario.find(query, function (err, data) {
        if (err) {
            response = {"error": true, "message": "Error al obtener datos"};
        } else {
            response = {"error": false, "message": data};
        }
        res.json(response);
    });
};

const usrPutEmail = function (req, res) {
    console.log(req.body.nombre);
    var newUser = req.body;
    var response = {};
    var modify = false;
    console.log(newUser);
    Usuario.find({email: req.params.email}).then((user) => {
        console.log(user)
        if (user[0].nombre !== newUser.nombre) {
            modify = true
        }
        else if (user[0].apellidos !== newUser.apellidos) {
            modify = true
        }
        else if (user[0].email !== newUser.email) {
            modify = true
        }
        else if (user[0].password !== newUser.password) {
            modify = true
        }
        console.log(modify)
        if (modify) {
            Usuario.update({email: req.params.email}, newUser, function (err, msg) {
                if (err) {
                    response = {"error": true, "message": "Error adding data"};
                    console.log(msg);
                } else {
                    response = {"error": false, "message": "User has been updated!"};
                    console.log(msg);
                }
                res.json(response);
            });
        }
        else {
            res.json({"error": true, "message": "No fields modified"})
        }
    })
};

const usrPut = function (req, res) {
    console.log(req.body.nombre);
    var newUser = req.body;
    var response = {};
    Usuario.update({email: newUser.email}, newUser, function (err, msg) {
        if (err) {
            response = {"error": true, "message": "Error adding data"};
            console.log(msg);
        } else {
            response = {"error": false, "message": "User has been updated!"};
            console.log(msg);
        }
        res.json(response);
    });
};

const usrDelete = function (req, res) {
    // console.log(req.query)  // Para hacer con postman
    // console.log(req.body)
    Usuario.findOneAndRemove({email: req.body.email})
        .then((user) => {
            response = {"error": false, "message": user};
            res.json(response);
        }).catch((err) => {
        response = {"error": true, "message": "Error deleting data"};
        console.log(err)
        res.json(response);
    })
};

const accDelete = function (req, res) {
    // console.log(req.query)  // Para hacer con postman
    // console.log(req.body)
    Usuario.find({email: req.body.email})
        .then((user) => {
            console.log(user[0].cuentas);
            var usuario = user[0];
            usuario.cuentas.delete(req.body.account);
            Usuario.update({email: req.body.email}, user[0], function (err, msg) {
                if (err) {
                    response = {"error": true, "message": "Error updating data"};
                } else {
                    response = {"error": false, "message": user};
                }
                res.json(response);
            })
        }).catch((err) => {
        response = {"error": true, "message": "Error deleting account"};
        console.log(err)
        res.json(response);
    })
};

const accGet = function (req, res) {
    // console.log(req.query)  // Para hacer con postman
    // console.log(req.body)
    Usuario.find({email: req.query.email})
        .then((user) => {

            if (user.length === 0) {
                response = {"error": true, "message": "Account doesn't exist"};
            }
            else {
                var cuentas = user[0].cuentas;
                var cuenta_query = req.query.account;
                if (cuentas.has(cuenta_query)) {
                    response = {"error": false, "message": cuentas.get(cuenta_query)};
                } else {
                    response = {"error": true, "message": "La cuenta de twitter no esta asociada al usuario"};
                }
            }
            res.json(response);
        }).catch((err) => {
        response = {"error": true, "message": "No existe el usuario"};
        console.log(err)
        res.json(response);
    })
};

const accPosthashtag = function (req,res) {
    Usuario.find({email: req.body.email}, function (err, user) {
        if (err) {
            response = {"error": true, "message": "Error updating data"};
            res.json(response);
        } else if (user.length !== 0) {
            var usuario = user[0];
            var cuenta = usuario.cuentas.get(req.body.cuenta);
            console.log(req.body.hashtags);
            req.body.hashtags.forEach(function (hashtag) {
                if(!cuenta.hashtags.includes(hashtag)) {
                    cuenta.hashtags.push(hashtag);
                }
            });
            Usuario.update({email: usuario.email}, usuario, function (err, msg) {
                if (err) {
                    response = {"error": true, "message": "Error adding data"};
                    console.log(msg);
                } else {
                    response = {"error": false, "message": cuenta.hashtags};
                    console.log(msg);
                }
                res.json(response);
            });
        } else {
            response = {"error": true, "message": "No user found"};
            res.json(response);
        }
    });
};

const accGethashtag = function (req,res) {
    console.log(req.query)
    Usuario.find({email: req.query.email}, function (err, user) {
        var response=[];
        if (err) {
            response = {"error": true, "message": "Error updating data"};
        } else if (user.length !== 0) {
            var usuario = user[0];
            var cuenta = usuario.cuentas.get(req.query.cuenta);
            response = {"error": false, "message": cuenta.hashtags};
        }else{
            response = {"error": true, "message": "No existe el usuario"};
        }
        res.json(response);
      })
    };

const accsGet = function (req,res) {
  // console.log(req.query)  // Para hacer con postman
  // console.log(req.body)
  console.log(req.query)
  Usuario.find({email: req.query.email})
  .then((user) => {

      if (user.length === 0) {
        response = {"error" : true,"message" : "Account doesn't exist"};
      }
      else {
        console.log(user[0].cuentas);
        var cuentas = user[0].cuentas;
        response = {"error": false, "message": cuentas};
      }
      res.json(response);
  }).catch((err)=>{
      response = {"error" : true,"message" : "No existe el usuario"};
      console.log(err)
      res.json(response);
  })
};

// const accPost = function (req,res) {
//   // console.log(req.query)  // Para hacer con postman
//   // console.log(req.body)
//   Usuario.find({email: req.body.email})
//   .then((user) => {
//       var index = user[0].cuentas.map((acc) => { return acc.cuentaTwitter}).indexOf(req.body.account)
//       console.log(index)
//       if (index === -1) {
//         user[0].cuentas.push({cuentaTwitter: req.body.account})
//       }
//       console.log(user[0].cuentas)
//       Usuario.update({email: req.body.email},user[0],function (err,msg) {
//         if(err) {
//           response = {"error" : true,"message" : "Error updating data"};
//         } else {
//           response = {"error" : false,"message" : user};
//         }
//         res.json(response);
//       })
//   }).catch((err)=>{
//       response = {"error" : true,"message" : "Error deleting account"};
//       console.log(err)
//       res.json(response);
//   })
// };

const accDeletehashtag = function (req,res) {
    Usuario.find({email: req.body.email}, function (err, user) {
        if (err) {
            response = {"error": true, "message": "Error updating data"};
            res.json(response);
        } else if (user.length !== 0) {
            var usuario = user[0];
            var cuenta = usuario.cuentas.get(req.body.cuenta);
            const index = cuenta.hashtags.indexOf(req.body.hashtag);
            if (index !== -1) {
                cuenta.hashtags.splice(index, 1);
            }
            Usuario.update({email: usuario.email}, usuario, function (err, msg) {
                if (err) {
                    response = {"error": true, "message": "Error adding data"};
                    console.log(msg);
                } else {
                    response = {"error": false, "message": cuenta.hashtags};
                    console.log(msg);
                }
                res.json(response);
            });
        } else {
            response = {"error": true, "message": "No user found"};
            res.json(response);
        }
    });
};

const accPost = function (req, res) {
    // console.log(req.query)  // Para hacer con postman
    // console.log(req.body)
    Usuario.find({email: req.body.email}, function (err, user) {
        if (err) {
            response = {"error": true, "message": "Error updating data"};
            res.json(response);
        } else if (user.length !== 0) {
            var usuario = user[0];
            usuario.cuentas.set(req.body.cuenta, {
                'account_name': req.body.cuenta,
                'public_name': req.body.public_name,
                'email': req.body.account_email,
                'description': req.body.description,
                'hashtags': [],
                'token': req.body.token,
                'tokenSecret': req.body.tokenSecret
            });
            console.log(usuario);
            Usuario.update({email: usuario.email}, usuario, function (err, msg) {
                if (err) {
                    response = {"error": true, "message": "Error adding data"};
                    console.log(msg);
                } else {
                    response = {"error": false, "message": "User has been updated!"};
                    console.log(msg);
                }
                res.json(response);
            });
        } else {
            response = {"error": true, "message": "No user found"};
            res.json(response);
        }
    });
};

module.exports = {
    usrGet,
    usrPost,
    usrPut,
    usrPutEmail,
    usrDelete,
    accDelete,
    accPost,
    accGet,
    accsGet,
    accPosthashtag,
    accGethashtag,
    accDeletehashtag
};