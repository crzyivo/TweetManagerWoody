const bdPath = require('../bdApiCalls');

const request = require('request');

const recover = function(req,res){
    bdPath.getUsuarios({email: req.query.email},
        function (err, resBd, body) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        if (body.message.length === 0) {
            res.status(400).send("El usuario no existe");
        } else {
            var response = {}
            response.cuentas = body.message[0].cuentas
            console.log(response.cuentas)
            res.status(200)
            res.send(body.message[0].cuentas)
        }
    });
};

const InfoCuenta = function(req,res){
    console.log(req)
    console.log(req.params)
    bdPath.getUsuarios({email: req.user.email, cuentas: {cuentaTwitter: req.params.email} },
        function (err, resBd, body) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        if (body.message.length === 0) {
            res.status(400).send("El usuario no existe");
        } else {
            var response = {}
            response.cuentas = body.message[0].cuentas
            res.status(200)
            res.send(body.message[0].cuentas)
        }
    });
};

module.exports = {
    recover: recover,
    InfoCuenta: InfoCuenta
};