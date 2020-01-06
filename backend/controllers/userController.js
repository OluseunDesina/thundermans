const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const helpers = require("../Helpers/helpers");
const joi = require("@hapi/joi");
const config = require("../config/config")

exports.userCreate = (req, res, next) => {
  // Validate the User Input
  const schema = joi.object({
    username: joi
      .string()
      .min(3)
      .max(30)
      .required(),

    password: joi.string().required(),
    // .pattern(/^[a-zA-Z0-9]{3,30}$/)

    email: joi
      .string()
      .email()
      .required()
  });
  // return error message if validation  fails
  const {
    err,
    value
  } = schema.validate(req.body);

  if (err) {
    return res.status(400).json({
      message: `Invalid Authentication Credentials`
    });
  }
  // check if user with the entered email already exists
  User.findOne({
    email: helpers.lowerCase(value.email)
  }).then(user => {
    if (user) {
      // console.log(user);
      return res.status(400).json({
        message: `User with email already exist`
      });
    }
  });

  // check if user with the entered username already exists
  User.findOne({
    username: helpers.firstUpper(value.username)
  }).then(user => {
    if (user) {
      return res.status(400).json({
        message: `User with username already exist`
      });
    }
  });

  bcrypt.hash(req.body.password, 10).then(hash => {
    // if (error) {
    //   return res.status(400).json({
    //     message: `Error hashing password`
    //   });
    // }
    console.log(hash)
    console.log(value.username)
    console.log(req.body.email)
    const user = new User({
      username: helpers.firstUpper(value.username),
      email: helpers.lowerCase(req.body.email),
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(200).json({
          message: "User Created Successfully",
          result: result
        });
      })
      .catch(error => {
        res.status(500).json({
          message: `Invalid Authentication Credentials`
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({
        message: `No empty fields allowed`
      })
  }
  let fetchedUser;
  User.findOne({
      email: helpers.lowerCase(req.body.email)
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: `user does not exist`
        });
      }
      fetchedUser = user;
      return bcrypt.compareSync(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: `Password mismatch`
        });
      }
      const token = jwt.sign({
          user_id: fetchedUser._id,
          email: fetchedUser.email,
          username: fetchedUser.username
        },
        config.secret, {
          expiresIn: "1h"
        }
      );

      res.status(200).json({
        token: token,
        expiresIn: 3600,
        message: `Login Successful`,
        user_id: fetchedUser._id,
        username: fetchedUser.username
      });
    })
    .catch(error => {
      res.status(401).json({
        message: `Invalid Authentication Credentials`
      });
    });
};
