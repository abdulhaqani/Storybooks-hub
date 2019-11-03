const mongoose = require('mongoose');

const { Schema } = mongoose;

// Create schema
const UserSchema = new Schema({
  googleID: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  LastName: {
    type: String,
  },
});
mongoose.model('users', UserSchema);
