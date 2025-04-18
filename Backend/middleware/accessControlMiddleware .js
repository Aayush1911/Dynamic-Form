const jwt = require("jsonwebtoken");
const FormSchema = require("../models/formSchema");

const accessControlMiddleware = async (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.AUTH_TOKEN);
    const userId = decoded.userId;

    // Fetch only _id and schemaName for allowed forms
    const forms = await FormSchema.find(
      { allowedUsers: userId },
      "_id schemaName"
    );

    req.accessibleForms = forms;
    next();
  } catch (err) {
    console.error("Access Control Error:", err);
    return res.status(403).json({ message: "Invalid token or access denied" });
  }
};

module.exports = accessControlMiddleware;
