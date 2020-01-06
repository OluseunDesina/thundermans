const Post = require("../models/postModel");
const User = require("../models/userModel");
const joi = require("@hapi/joi");

exports.createPost = (req, res, next) => {
  // Validate the User Input
  const schema = joi.object({
    // title: joi
    //   .string()
    //   .required(),
    content: joi.string().required()
  });
  // return error message if validation  fails
  const {
    err,
    value
  } = schema.validate(req.body);

  if (err) {
    return res.status(400).json({
      message: err.details
    });
  }
  const url = `${req.protocol}://${req.get("host")}`;
  const post = new Post({
    // title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`,
    user: req.userData.userId,
    username: req.userData.username,
    created: new Date()
  });
  post
    .save()
    .then(async result => {
      await User.update({
        _id: req.userData.userId
      }, {
        $push: {
          posts: {
            postId: result._id,
            post: req.body.content,
            created: new Date()
          }
        }
      });
      // console.log(post);
      res.status(201).json({
        message: "better guy, added your post",
        post: {
          ...result,
          id: result._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: `Oops, Creating Post failed`
      });
    });
};

exports.getPosts = (req, res, next) => {
  const postQuery = Post.find();
  const pageSize = +req.query.pagesize;
  const page = +req.query.page;
  let fetchedPosts;
  // console.log(pageSize, page);
  // if (pageSize && page) {
  //   // console.log(pageSize, page);
  //   postQuery.skip(pageSize * (page - 1)).limit(pageSize);
  // }
  postQuery
    .populate("user")
    .sort({
      created: -1
    })
    .then(docs => {
      this.fetchedPosts = docs;
      return Post.estimatedDocumentCount();
    })
    .then(count => {
      res.status(200).json({
        message: `How far better guy, your posts was fetched successfully`,
        posts: this.fetchedPosts,
        maxLength: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: `Oops, Couldn't fetch posts`
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json({
          post: post,
          message: "Successfully fetched Post"
        });
      } else {
        res.status(404).json({
          message: "Post not found!!"
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: `Oops, Couldn't fetch post`
      });
    });
};

exports.updatePost = (req, res, next) => {
  // console.log( req.userData.userId)
  let imagePath = req.body.image;
  if (req.file) {
    const url = `${req.protocol}://${req.get("host")}`;
    imagePath = `${url}/images/${req.file.filename}`;
  }
  const post = {
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    user: req.userData.userId
  };
  Post.updateOne({
        _id: req.params.id,
        user: req.userData.userId
      },
      post
    )
    .then(result => {
      if (result.n < 1) {
        return res.status(401).json({
          message: "unauthorized User"
        });
      }
      res.status(201).json({
        message: "post Updated!!",
        post: result
      });
    })
    .catch(error => {
      res.status(500).json({
        message: `Oops, Update failed`
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({
      _id: req.params.id,
      user: req.userData.userId
    })
    .then(result => {
      if (result.n < 1) {
        return res.status(401).json({
          message: "unauthorized User"
        });
      }
      res.status(201).json({
        message: "post deleted!!"
      });
    })
    .catch(error => {
      res.status(500).json({
        message: `Oops, couldn't fetch post to be deleted`
      });
    });
};

exports.likePost = (req, res, next) => {
  const postId = req.params.id;
  Post.update({
      _id: postId,
      'likes.username': {
        $ne: req.userData.username
      }
    }, {
      $push: {
        likes: {
          username: req.userData.username
        }
      },
      $inc: {
        totalLikes: 1
      }
    })
    .then((result) => {
      res.status(201).json({
        message: `Post Liked`
      });
    })
    .catch(error => {
      res.status(500).json({
        message: `Oops we no know wetin Happen o`
      })
    })
}
