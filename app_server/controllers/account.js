const bdPath = require('../bdApiCalls');

const request = require('request');

const recover = function(req,res){
    console.log(req.query.email)
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

const getAcc = function(req,res){
    bdPath.getAccount({email: req.params.user, account: req.params.email },
        function (err, resBd, body) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        if (body.message.length === 0) {
            res.status(400).send("La cuenta no existe");
        } else {
            res.status(200)
            res.send(body.message[0])
        }
    });
};

const deleteAcc = function(req,res){
    bdPath.deleteAccount({email: req.body.params.email, account: req.body.params.acc},
        function (err, resBd, body) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        if (body.message.length === 0) {
            res.status(400).send("El usuario no existe");
        } else {
            res.status(200)
            res.send(body.message[0].cuentas)
        }
    });
};

const postAcc = function(req,res){
    bdPath.postAccount({email: req.body.params.email, account: req.body.params.acc},
        function (err, resBd, body) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        if (body.message.length === 0) {
            res.status(400).send("El usuario no existe");
        } else {
            res.status(200)
            res.send(body.message[0].cuentas)
        }
    });
};

module.exports = {
    recover: recover,
    getAcc: getAcc,
    deleteAcc: deleteAcc,
    postAcc: postAcc
};