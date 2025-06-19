import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
const isLogin = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.jwt;

    // Check if the token exists
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "User Unauthorized, no token provided",
      });
    }

    // Verify the token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is valid and decoded
    if (!decoded) {
      return res
        .status(401)
        .send({ success: false, message: "User Unauthorized, invalid token" });
    }

    // Find the user using the decoded userId from the token
    const user = await User.findById(decoded.userId).select("-password"); // Exclude password for security

    // Check if user exists
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware/controller
    next();
  } catch (error) {
    console.log(`Error in isLogin middleware: ${error.message}`);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

export default isLogin;
