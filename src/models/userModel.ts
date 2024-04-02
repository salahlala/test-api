import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcrypt';
const passwordValidator = function (
  this: { password: string },
  passwordConfirm: string,
) {
  return passwordConfirm === this.password;
};

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    select: false,
  },
  passwordConfirm: {
    type: String,
    select: false,
    validate: {
      validator: passwordValidator,
      message: 'Passwords do not match',
    },
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(this.password as string, salt);
  this.password = hash;
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = models.User || model('User', userSchema);
export default User;
