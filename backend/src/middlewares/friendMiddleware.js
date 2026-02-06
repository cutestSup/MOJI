import Friend from "../models/Friend.js";
import Conversation from "../models/Conversation.js";

const pair = (a, b) => (a < b ? [a, b] : [b, a]);

export const checkFriendship = async (req, res, next) => {
    try {
        const me = req.user._id.toString();
        const recipientId = req.body?.recipientId ?? null;
        const memberIds = req.body?.memberIds ?? null;

        if (!recipientId && (!memberIds || memberIds.length === 0)) {
            return res.status(400).json({ message: 'Recipient ID is required or member IDs are required.' });
        }

        if (recipientId) {
            const [userA, userB] = pair(me, recipientId);

            const isFriend = await Friend.findOne({ userA, userB });

            if (!isFriend) {
                return res.status(403).json({ message: 'You can only send messages to your friends.' });
            }

            return next();
        }

        const friendChecks = memberIds.map(async (memberId) => {
            const [userA, userB] = pair(me, memberId);
            const friend = await Friend.findOne({ userA, userB });
            return friend ? null : memberId;
        });

        const results = await Promise.all(friendChecks);
        const notFriends = results.filter(Boolean);

        if (notFriends.length > 0) {
            return res
                .status(403)
                .json({ message: "Bạn chỉ có thể thêm bạn bè vào nhóm.", notFriends });
        }

        next();
    } catch (error) {
        console.error('Error in checkFriendship middleware:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const checkGroupMembership = async (req, res, next) => {
    try {
        const { conversationId } = req.body;
        const userId = req.user._id;

        if (!conversationId) {
            return res.status(400).json({ message: 'Conversation ID is required.' });
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found.' });
        }

        const isMember = conversation.participants.some(
            participant => participant.userId.toString() === userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this conversation.' });
        }

        req.conversation = conversation;

        next();
    } catch (error) {
        console.error('Error in checkGroupMembership middleware:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};