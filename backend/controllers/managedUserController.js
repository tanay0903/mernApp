import ManagedUser from "../models/managedUserModel.js";

// GET all users
export const getUsers = async (req, res) => {
  const search = req.query.search?.toLowerCase();

  try {
    const query = search
      ? {
        $or: [
          { first_name: { $regex: search, $options: "i" } },
          { last_name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { job_title: { $regex: search, $options: "i" } },
        ],
      }
      : {};

    const users = await ManagedUser.find(query);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// POST new user
export const createUser = async (req, res) => {
  try {
    const user = new ManagedUser(req.body);
    await user.save();
    res.json({ success: true, message: "User created", user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PATCH update user
// controllers/managedUserController.js

export const updateUser = async (req, res) => {
  try {
    const { email, ...updates } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required to identify the user." });
    }

    delete updates._id; // Prevent accidental _id update

    const user = await ManagedUser.findOneAndUpdate({ email }, updates, {
      new: true,
      upsert: false, // Do NOT insert if user not found
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User updated", user });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const user = await ManagedUser.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
