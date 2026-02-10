import User from "../models/User.js"
import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";

export const authMe = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({ user });

    } catch (error) {
        console.error('Error in authMe controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const searchUserByUsername = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username || username.trim() === '') {
            return res.status(400).json({ message: 'Username query parameter is required' });
        }

        const user = await User.findOne({ username: username.trim() }).select("_id displayName username avatarUrl");

        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error in searchUserByUsername:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const uploadAvatar = async (req, res) => {
    try {
        const file = req.file;
        const userId = req.user._id;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload the image to Cloudinary
        const result = await uploadImageFromBuffer(file.buffer);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                avatarUrl: result.secure_url,
                avatarId: result.public_id
            },
            { new: true }
        ).select("avatarUrl");

        if (!updatedUser.avatarUrl) {
            return res.status(500).json({ message: 'Failed to update user avatar' });
        }

        return res.status(200).json({ avatarUrl: updatedUser.avatarUrl });
    } catch (error) {
        console.error('Error in uploadAvatar:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


