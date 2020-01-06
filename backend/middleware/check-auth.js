const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require("../config/config")

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, config.secret);
    req.userData = {
      email: payload.email,
      userId: payload.user_id,
      username: payload.username
    };
    next();
    // if (token) {

    // }
  } catch (error) {
    res.status(401).json({
      message: `You are not Authenticated`
    })
  }


}
