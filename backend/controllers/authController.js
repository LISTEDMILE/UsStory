const { check, validationResult } = require("express-validator");
const Creations = require('../models/creationModel');
const Creator = require('../models/creatorModel');
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.getLogin = async (req, res, next) => {
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({errors:["Send All Credentials."]})
    }
  const { email, password } = req.body;
  try {
 
      const creator = await Creator.findOne({ email: email }).select("_id password");
      if (!creator) {
        return res.status(401).json({
          errors: ["Invalid Credentials."],
          oldInputs: {
            email: email,
            password: password,
          },
        });
      }

       const isMatch = await bcrypt.compare(password, creator.password);
      if (!isMatch) {
        return res.status(401).json({
          errors: ["Invalid Credentials."],
          oldInputs: {
            email: email,
            password: password,
          },
        });
      }

      req.session.regenerate((err) => {
        if (err) {
          console.error("Session save error : ", err);
          return res.status(500).json({
            errors: ["An error occured."],
          });
        }

        req.session.isLoggedIn = true;
          req.session._id = creator._id.toString();

        res.status(200).json({
          message: "Success",
        });
      });
    
  } catch (err) {
    console.error("Error finding User:", err);
    res.status(500).json({
      errors: ["An error occured."],
      oldInputs: {
        email: email,
        password: password,
      },
    });
  }
};



exports.postSignUp = [
 
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail()
    .custom(async (value) => {
      const existingCreator = await Creator.findOne({
        email: value,
      });
      if (existingCreator) {
        throw new Error("Email/Username is already in use");
      }
    }),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one Uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one Lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain at least one special character")
    .trim(),
  async (req, res, next) => {
      try {
        if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({errors:["Send All Credentials."]})
    }
      const { email, password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((err) => err.msg),
          oldInputs: {
            email: email,
            password: password,
          },
        });
      }
     
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const creator = new Creator({
    
          email: email,
          password: hashedPassword,
        });

        creator
          .save()
          .then((creator) => {
            req.session.regenerate((err) => {
              if (err) {
                console.error("Session save error : ", err);
                return res.status(500).json({
                  errors: ["An error occured."],
                });
              }

             req.session.isLoggedIn = true;
                req.session._id = creator._id.toString();
                
              res.status(201).json({
                message: "Success",
              });
            });
          })
          .catch((err) => {
            console.error("Error Signing In:", err);
            res.status(500).json({
              errors: ["An error Occured:"],
              oldInputs: {
                email: email,
                password: password,
              },
            });
          });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        errors: ["Server not responding"],
      });
    }
  },
];

exports.postDeleteAccount = async (req, res, next) => {
  try {
    if (!req.session?.isLoggedIn || !req.session?._id) {
      return res.status(401).json({
        errors: ["Unauthorized : Please log in first"],
      });
    }
    const { password } = req.body;
    const creator = await Creator.findById(req.session._id).select("password");

    if (!creator) {
      return res.status(404).json({
        errors: ["User not found."],
      });
    }
    const isMatch = await bcrypt.compare(password, creator.password);

    if (!isMatch) {
      return res.status(401).json({
        errors: ["Wrong Credentials."],
      });
    }

    // image logic

    await Creator.findByIdAndDelete(req.session._id);

    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session : ", err);
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({
        success: true,
        message: "Account Deleted Successfully.",
      });
    });
  } catch (err) {
    console.error("Error deleting accound : ", err);
    res.status(500).json({
      errors: ["Failed to delete account."],
    });
  }
};

exports.postLogOut = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json({
        success: false,
        errors: ["An error occurred while logging out."],
      });
    }

    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  });
};


exports.postMe = (req, res, next) => {
  if (req.session.isLoggedIn && req.session._id) {
    return res.json({
      isLoggedIn: true,
      _id:req.session._id,
    });
  } else {
    return res.json({
      isLoggedIn: false,
    });
  }
};
