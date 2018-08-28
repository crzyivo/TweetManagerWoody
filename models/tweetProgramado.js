const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const request = require('request');
const urlPath = require('../config/herokuSettings');
const User = require('./user');

//require('request-debug')(request);
var timeout;
function trigger(doc) {
    console.log(doc.cuenta + ' Boom');
    var updated = doc;
    updated.status='enviado';
    console.log(urlPath.urlPath+'/acc/twits/newTweet/'+doc.cuenta+'/'+doc.usuario);
    User.find({email:doc.usuario},function (err,data) {
        if(!err){
            console.log(data);
            var cuenta = data[0].cuentas.get(doc.cuenta);
            var body = {
                text:doc.text,
                token:cuenta.token,
                tokenSecret:cuenta.tokenSecret
            };
            request.post({
                url: urlPath.urlPath+'/acc/twits/newProgTweet/'+doc.cuenta+'/'+doc.usuario,
                body:body,
                json:true,
                rejectUnauthorized: false
            },function (err,resTw,body) {
                mongoose.model('Tweet_Programado', tweetSchema).update({'_id':doc._id},updated,function () {
                });
            });
        }
    })

}
var tweetSchema = new Schema({
    usuario: String,
    cuenta: String,
    public_name:String,
    text: String,
    creado: Date,
    trigger: Date,
    status: String

});

tweetSchema.post('save',function (doc) {
    var time = new Date(doc.trigger).getTime() - new Date().getTime();
    console.log(time);
    timeout = setTimeout(trigger,time,doc);
});
tweetSchema.methods.log = function(){
    var mensaje = "Usuario: "+this.usuario+",\n"+
        "Cuenta: "+this.cuenta+",\n"+
        "Texto: "+this.text+",\n"+
        "Creado: "+this.creado+",\n"+
        "Trigger: "+this.trigger+",\n"+
        "Status: "+this.status+",\n";
    console.log(mensaje);
};
module.exports = mongoose.model('Tweet_Programado', tweetSchema);