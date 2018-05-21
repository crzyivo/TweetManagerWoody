var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    nombre: String,
    apellidos: String,
    email: String,
    password: String,
    admin: Boolean,
    cuentas: [{cuentaTwitter: String}]
});

userSchema.methods.log = function(){
    var mensaje = "Nombre: "+this.nombre+",\n"+
        "Apellidos: "+this.apellidos+",\n"+
        "email: "+this.email+",\n"+
        "Contraseña: "+this.password+",\n"+
        "admin: "+this.admin+",\n"+
        "Cuentas: "+this.cuentas+",\n";
    console.log(mensaje);
};
module.exports = mongoose.model('Usuario',userSchema);