const express = require("express");
const router = express.Router();
const { Signup, Signin, CreateCoordinator, GetAllUsers, GetUserById, UpdateUser, GetAuditLogs } = require("../controller/auth/user");

router.post("/signup", Signup);
router.post("/signin", Signin);
router.post("/coordinators", CreateCoordinator);
router.get("/users", GetAllUsers);
router.get("/users/:id", GetUserById);
router.put("/users/:id", UpdateUser);
router.get("/audit-logs", GetAuditLogs);

module.exports = router;
