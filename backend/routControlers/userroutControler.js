import User from "../Models/userModel.js";
import bcryptjs from "bcryptjs";
import jwtToken from "../utils/jwtwebToken.js";

export const userRegister = async (req, res) => {
  try {
    const { fullname, username, email, gender, password, profilepic } =
      req.body;
    console.log(req.body);

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "Username or Email already exists",
      });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const profileBoy =
      profilepic ||
      `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const profileGirl =
      profilepic ||
      `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
      gender,
      profilepic: gender === "male" ? profileBoy : profileGirl,
    });

    if (newUser) {
      await newUser.save();
      // Set JWT cookie
      jwtToken(newUser._id, res);
    } else {
      res.status(500).send({ success: false, message: "Invalid user data" });
    }

    // ✅ Send response only once
    return res.status(201).send({
      success: true,
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      profilepic: newUser.profilepic,
      email: newUser.email,
      message: "Successfully Registered!",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).send({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(500).send({
        success: false,
        message: "Email doesn't exist. Please register.",
      });
    }

    const comparePass = await bcryptjs.compare(password, user.password || "");

    if (!comparePass) {
      return res
        .status(401)
        .send({ success: false, message: "Password Doesnt match" });
    }

    jwtToken(user._id, res);

    res.status(200).send({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilepic: user.profilepic,
      email: user.email,
      message: "Successfully logged in",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).send({ success: true, message: "User LogOut" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};
