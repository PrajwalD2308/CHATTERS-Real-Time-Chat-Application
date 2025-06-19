import Conversation from "../Models/conversationModels.js";
import User from "../Models/userModel.js";

export const getUserBySearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserID = req.user._id;
    const user = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: ".*" + search + ".*", $options: "i" } },
            { fullname: { $regex: ".*" + search + ".*", $options: "i" } },
          ],
        },
        { _id: { $ne: currentUserID } },
      ],
    }).select("-password");
    // .select("email");

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const getCurrentChatters = async (req, res) => {
  try {
    const currentUserID = req.user?._id;

    if (!currentUserID) {
      return res
        .status(400)
        .send({ success: false, message: "User not authenticated" });
    }

    const currentChatters = await Conversation.find({
      participants: currentUserID,
    }).sort({ updatedAt: -1 });

    if (!currentChatters || currentChatters.length === 0) {
      return res.status(200).send([]);
    }

    // Extract participant IDs excluding the current user
    const participantsIDs = currentChatters.flatMap((conversation) =>
      conversation.participants.filter(
        (id) => id.toString() !== currentUserID.toString()
      )
    );

    // const participantsIDS = currentChatters.reduce((ids, conversation) => {
    //   if (Array.isArray(conversation.participants)) {
    //     const others = conversation.participants.filter(
    //       (id) => id.toString() !== currentUserID.toString()
    //     );
    //     return [...ids, ...others];
    //   }
    // }, []);

    // const others = participantsIDS.filter(
    //   (id) => id.toString() !== currentUserID.toString()
    // );

    // Remove duplicates using a Set
    const uniqueParticipantIDs = [...new Set(participantsIDs)];

    // const uniqueIDs = [...new Set(participantsIDS.map((id) => id.toString()))];

    // if (!uniqueIDs.length) {
    //   return res.status(200).send([]);
    // }

    const users = await User.find({
      _id: { $in: uniqueParticipantIDs },
    }).select("fullname username profilepic");
    // .select("-password")
    // .select("-email");

    // const users = others.map((id) =>
    //   user.find((user) => user._id.toString() === id.toString())
    //);

    res.status(200).send(users);
  } catch (error) {
    console.error("getCurrentChatters error:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
