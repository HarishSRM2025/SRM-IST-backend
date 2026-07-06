const express = require("express");
const router = express.Router();
const { Signup, Signin, GetAllUsers, GetUserById, UpdateUser } = require("../controller/auth/user");

router.post("/signup", Signup);
router.post("/signin", Signin);
router.get("/users", GetAllUsers);
router.get("/users/:id", GetUserById);
router.put("/users/:id", UpdateUser);

module.exports = router;
