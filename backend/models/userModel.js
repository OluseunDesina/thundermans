const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  posts: [
    {
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      },
      content: { type: String },
      created: { type: Date, default: new Date() }
    }
  ]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
