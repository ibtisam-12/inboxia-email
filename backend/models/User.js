import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  accessToken: { type: String, required: true }, //will be stored on frontend
  refreshToken: { type: String, required: false },
  email: { type: String, required: true },
  name: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
export default User;
