import Friend from "../models/Friend";
import Conversation from "../models/Conversation.js";

const pair = (a, b) => (a < b ? [a, b] : [b, a]);

export const checkFriendship = async (req, res, next) => {
    try {
        const me = req.user._id.toString();
        const recipientId = req.body?.recipientId ?? null;

        if (!recipientId) {
            return res.status(400).json({ message: 'Recipient ID is required.' });
        }

        if (recipientId) {
            const [userA, userB] = pair(me, recipientId);
            
            const isFriend = await Friend.findOne({ userA, userB });

            if (!isFriend) {
                return res.status(403).json({ message: 'You can only send messages to your friends.' });
            }

            return next();
        }     

        // todo: check group membership for group messages
    } catch (error) {
        console.error('Error in checkFriendship middleware:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const checkGroupMembership = async (req, res, next) => {
    try {

    } catch (error) {
        console.error('Error in checkGroupMembership middleware:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};