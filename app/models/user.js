// UserModel
// =========
// Este modelo é o encargado de relacionar os usuarios cós seus respectivos
// datos na base de datos e tamén de xestionar as suas relacións.

'use strict';

// ##Dependencias do módulo
var config = global.config,
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    DBUtils = require(config.paths.utils + 'database.js'),
    crypto = require('crypto');

// ##Esquema de datos do modelo
var UserSchema = new Schema({
    'group': { 'type': Number, 'requires': true },
    'username': { 'type': String, 'required': true, 'index': true },
    'hashed_password': { 'type': String, 'required': true },
    'salt': { 'type': String, 'required': true },
    'token': { 'type': String },
    'mail': { 'type': String, 'required': true, 'index': true },
    'firstname': { 'type': String, 'required': true },
    'lastname': { 'type': String, 'required': true },
    'image': String,
    'phone': String,
    'city': String,
    'zipcode': String,
    'address': String,
    'company': String,
    'sex': String,
    'picture': String,
    'document': { 'type': String, 'number': String },
    'newsletter': Boolean,
    'created_at': { 'type': Date, 'default': Date.now() },
    'modified_at': Date,

    /** Relacións **/
    'country': {'type': Schema.Types.ObjectId, ref: 'Country'}
});

// ##Campos virtuais
// O campo password non existe na base de datos xa que este se garda
// como unha cadena encriptada polo tanto, esta función serve para
// encriptar o password é gardalo no campo hashed_password sen ter que
// manexar estos datos no controlador ou componente.
UserSchema.virtual('password').set(function(password) {
    // Creamos unha nova salt (frase secreta)
    this.salt = this.makeSalt();
    // Codificamos o password
    this.hashed_password = this.encryptPassword(password);
});
UserSchema.virtual('commercial_name').get(function() {
    if (this.company) return this.company;
    return this.firstname+' '+this.lastname;
});

// ##Callbacks
// Funcións que executaremos antes de gardar, validar, etc...
UserSchema.pre('save', DBUtils.update_document_dates);

// ##Validacións
// Configuramos as validacións adicionais necesarias

// ###O nome de usuario debe ser único
UserSchema.path('username').validate(function(val, callback) {
    DBUtils.validate_uniqueness.apply(this, ['User', 'username', val, callback]);
}, 'Username should be unique');

// ###O e-mail debe ser único
UserSchema.path('mail').validate(function(val, callback) {
    DBUtils.validate_uniqueness.apply(this, ['User', 'username', val, callback]);
}, 'Mail should be unique');

// ##Métodos
// Definimos os métodos utilizados polo modelo
UserSchema.methods = {
    // Función para crear unha nova cadea para usar de frase secreta.
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },
    // Función para encriptar o password coa "salt" asignada no modelo
    encryptPassword: function(password) {
        if ( ! password || ! this.salt) { return ''; }
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    },
    // Función para autenticar o usuario é decir, comprobar se as credenciais son correctas
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    }
};

// Exportamos o modelo
module.exports = mongoose.model('User', UserSchema);