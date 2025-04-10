const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const fetchUser = (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }

    try {
        if (!process.env.AUTH_TOKEN) {
            // console.error("Missing AUTH_TOKEN in .env file");
            return res.status(500).json({ error: "Server configuration error" });
        }

        // Corrected: Assign the decoded token to `decodedData`
        const decodedData = jwt.verify(token, process.env.AUTH_TOKEN);
        // console.log(" Verified User Data:", decodedData);

        req.user = { id: decodedData.userId }; //  Use the correct variable name
        next();
    } catch (error) {
        console.error(" Token Verification Failed:", error.message);
        return res.status(401).json({ error: "Invalid or expired token. Please log in again." });
    }
};

module.exports = fetchUser;
