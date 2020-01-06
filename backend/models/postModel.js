const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  // title: {
  //   type: String,
  //   required: true
  // },
  content: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  username: {
    type: String,
    default: ""
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      username: {
        type: String,
        default: ""
      },
      comment: {
        type: String,
        default: ""
      },
      createdAt: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  totalLikes: {
    type: Number,
    default: 0
  },
  likes: [
    {
      username: {
        type: String,
        default: ""
      }
    }
  ],
  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Post", postSchema);
