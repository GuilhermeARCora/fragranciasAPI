const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new Schema({
    
    name:{
        type:String,
        trim:true,
        maxlength: [40, 'The name must not have more than 40 characters'],
        minlength: [2,'The name must have at least 2 characters'],
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique:true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password:{
        type:String,
        required:[true, 'Password is required'],
        minlength: [6,'The password must have at least 6 characters'],
        trim:true,
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
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
    this.invalidate('confirmPassword', 'Passwords do not match');
  }

  if (this.isModified('email') && this.email !== this._confirmEmail) {
    this.invalidate('confirmEmail', 'Emails do not match');
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

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  //10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = model('users', userSchema);

module.exports = User;