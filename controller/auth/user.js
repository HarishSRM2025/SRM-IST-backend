const User = require("../../models/auth/user");
const bcrypt = require("bcryptjs");
const { logAudit } = require("../../utils/audit");

const COORDINATOR_LEVELS = {
  institute: { instituteId: true, schoolId: false, divisionId: false },
  school: { instituteId: true, schoolId: true, divisionId: false },
  division: { instituteId: true, schoolId: true, divisionId: true },
};

function sanitizeUser(user) {
  const output = user.toObject();
  delete output.password;
  return output;
}

function buildCoordinatorMapping(mappingLevel, body) {
  const level = String(mappingLevel || "").toLowerCase();
  if (!COORDINATOR_LEVELS[level]) return null;

  return {
    mappingLevel: level,
    instituteId: body.instituteId || null,
    schoolId: COORDINATOR_LEVELS[level].schoolId ? (body.schoolId || null) : null,
    divisionId: COORDINATOR_LEVELS[level].divisionId ? (body.divisionId || null) : null,
  };
}

exports.Signup = async (req, res) => {
  try {
    const { username, email, password, role, status, mappingLevel, instituteId, schoolId, divisionId } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    if (role === "coordinator") {
      return res.status(403).json({ success: false, message: "Coordinator accounts can only be created by Admin." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      status: status || "active",
      mappingLevel: mappingLevel || null,
      instituteId: instituteId || null,
      schoolId: schoolId || null,
      divisionId: divisionId || null,
    });
    await user.save();
    res.status(201).json({ success: true, message: "User created successfully", user: sanitizeUser(user) });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.CreateCoordinator = async (req, res) => {
  try {
    const { username, email, password, mappingLevel } = req.body;
    const mapping = buildCoordinatorMapping(mappingLevel, req.body);
    if (!mapping) {
      return res.status(400).json({ success: false, message: "Invalid coordinator mapping level." });
    }
    if (!username || !email || !password || !mapping.instituteId) {
      return res.status(400).json({ success: false, message: "Missing required coordinator details." });
    }
    if (mapping.mappingLevel === "school" && !mapping.schoolId) {
      return res.status(400).json({ success: false, message: "School mapping requires a school." });
    }
    if (mapping.mappingLevel === "division" && !mapping.divisionId) {
      return res.status(400).json({ success: false, message: "Division mapping requires a division." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "coordinator",
      status: "active",
      ...mapping,
    });

    return res.status(201).json({ success: true, message: "Coordinator created successfully", user: sanitizeUser(user) });
  } catch (error) {
    console.error("CreateCoordinator error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.Signin = async (req, res) => {
  try {
    const { email, password, portal } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.status === "inactive") {
      return res.status(403).json({ success: false, message: "Account is inactive." });
    }
    if (portal === "coordinator" && user.role !== "coordinator") {
      return res.status(403).json({ success: false, message: "Use the admin portal for this account." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    user.lastLoginAt = new Date();
    await user.save();
    return res.status(200).json({ success: true, message: "User logged in successfully", user: sanitizeUser(user) });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.GetAllUsers = async (req, res) => {
  try {
    const users = (await User.find().populate("instituteId").populate("schoolId").populate("divisionId")).map(sanitizeUser);
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("GetAllUsers error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.GetUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("instituteId").populate("schoolId").populate("divisionId");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    console.error("GetUserById error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.UpdateUser = async (req, res) => {
  try {
    const { username, email, role, status, mappingLevel } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const updateData = { username, email, role, status };
    if (role === "coordinator" || mappingLevel) {
      const mapping = buildCoordinatorMapping(mappingLevel || user.mappingLevel, req.body);
      if (!mapping) {
        return res.status(400).json({ success: false, message: "Invalid coordinator mapping level." });
      }
      Object.assign(updateData, mapping, { role: "coordinator" });
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    return res.status(200).json({ success: true, user: sanitizeUser(updatedUser) });
  } catch (error) {
    console.error("UpdateUser error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.GetAuditLogs = async (req, res) => {
  try {
    const AuditLog = require("../../models/auth/auditLog");
    const coordinatorId = req.headers["x-user-id"];
    const coordinatorRole = String(req.headers["x-user-role"] || "").toLowerCase();
    const filter = coordinatorRole === "coordinator" && coordinatorId ? { userId: coordinatorId } : {};
    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).populate("userId", "username email role");
    const filteredLogs = logs.filter((log) => {
      const action = String(log.action || "").toLowerCase();
      return action.includes(" added ") || action.includes(" updated ") || action.includes(" deleted ");
    });
    res.status(200).json({ success: true, logs: filteredLogs });
  } catch (error) {
    console.error("GetAuditLogs error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
