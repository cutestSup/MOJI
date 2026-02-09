import User from "../models/User.js"

export const authMe = async (req, res) =>{
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
        if (!username|| username.trim() === '') {
            return res.status(400).json({ message: 'Username query parameter is required' });
        }

        const user = await User.findOne({ username: username.trim() }).select("_id displayName username avatarUrl");

        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error in searchUserByUsername:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

