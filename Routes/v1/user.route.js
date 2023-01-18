const express = require("express");
const userController = require("../../Controllers/user.controller");
const authorization = require("../../middlewares/token_validation");

const router = express.Router();

router.route("/add").post(userController.addUser);

router.route("/login").post(userController.login);
router.route("/logout").get(authorization, userController.logout);

router.route("/change-password").patch(authorization ,userController.changePassword);
router.route("/forgot-password").post( userController.forgotPassord);
router.route("/reset-password/:token");

module.exports = router;
