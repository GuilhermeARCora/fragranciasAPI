const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new Schema({
    
    name:{
        type:String,
        trim:true,
        maxlength: [40, 'O nome não pode ter mais de 40 caracteres'],
        required: [true, 'Nome é obrigatório']
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique:true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor, insira um email válido']
    },
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'
    },
    password:{
        type:String,
        required:[true, 'Password é obrigatório'],
        minlength: [6,'A senha precisa ter pelo menos 6 caracteres'],
        trim:true,
        select: false
    },
    passwordChangedAt: Date,
    active:{
      type: Boolean,
      default: true
    }
}, { strict: true });

//VIRTUAL PROPERTIES
userSchema.virtual('confirmPassword').set(function (value) {
    this._confirmPassword = value;
  });

userSchema.virtual('confirmEmail').set(function (value) {
    this._confirmEmail = value;
  });

//MONGOOSE MIDDLEWARE 
userSchema.pre('validate', function (next) {
  if (this.isModified('password') && this.password !== this._confirmPassword) {
    this.invalidate('confirmPassword', 'As senhas não são iguais!');
  }

  if (this.isModified('email') && this.email !== this._confirmEmail) {
    this.invalidate('confirmEmail', 'Os emails não são iguais');
  }

  next();
});

userSchema.pre('save', async function () {

  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.pre('save', async function (next) {

  if(!this.isModified('password') || this.isNew ) return next();

  this.passwordChangedAt = Date.now() - 1000;
  
});

// INSTANCE METHODS
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){

  if(this.passwordChangedAt){
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        
    return JWTTimestamp < changedTimestamp;
  };

  //false means NOT changed
  return false;
};

const User = model('users', userSchema);

module.exports = User;