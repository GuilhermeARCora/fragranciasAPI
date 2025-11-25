const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({

  name: {
    type: String,
    trim: true,
    maxlength: [40, 'O nome não pode ter mais de 40 caracteres'],
    required: [true, 'Nome é obrigatório']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor, insira um email válido']
  },
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client'
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatório'],
    minlength: [8, 'A senha deve ter pelo menos 8 caracteres'],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/,
      'A senha deve ter pelo menos 8 caracteres, incluindo 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial'
    ],
    trim: true,
    select: false
  },
  active: {
    type: Boolean,
    default: true
  },
  passwordChangedAt: Date
}, {
  strict: true,
  collection: 'users',
  timestamps: true,
  toJSON: { virtuals: true },
  id: false
});

userSchema.virtual('confirmPassword').set(function (value) {
  this.confirmPasswordTemp = value;
});

userSchema.virtual('confirmEmail').set(function (value) {
  this.confirmEmailTemp = value;
});

userSchema.pre('validate', function (next) {
  if (this.isModified('password') && this.password !== this.confirmPasswordTemp) {
    this.invalidate('confirmPassword', 'As senhas não são iguais!');
  }

  if (this.isModified('email') && this.email !== this.confirmEmailTemp) {
    this.invalidate('confirmEmail', 'Os emails não são iguais');
  }

  next();
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  return this.passwordChangedAt;
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return bcrypt.compare(candidatePassword, userPassword);
};

const User = model('users', userSchema);

module.exports = User;
