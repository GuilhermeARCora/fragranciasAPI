const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

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
    passwordChangedAt:{
      type: Date,
    }
}, { strict: true });

userSchema.virtual('confirmPassword').set(function (value) {
    this._confirmPassword = value;
  });

userSchema.virtual('confirmEmail').set(function (value) {
    this._confirmEmail = value;
  });

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