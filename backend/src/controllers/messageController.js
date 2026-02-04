import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { updateConversationAfterCreateMessage } from "../utils/messageHelper.js";

export const sendDirectMessage = async (req, res) => {
    try {
        const { recipientId, content, conversationId } = req.body;
        const senderId = req.user.id;

        // Logic to send a direct message
        let conversation;

        if (!content) {
            return res.status(400).json({ message: 'Message content cannot be empty' });
        }

        if (conversationId) {
            // Fetch existing conversation
            conversation = await Conversation.findById(conversationId);
        }

        if (!conversation && !recipientId) {
            return res.status(400).json({ message: 'Recipient ID is required to create a new conversation' });
        }

        if (!conversation) {
            // Create new conversation if it doesn't exist
            conversation = await Conversation.create({
                type: 'direct',
                participants: [
                    {userId: senderId, joinedAt: new Date()}, 
                    {userId: recipientId, joinedAt: new Date()}
                ],
                lastMessageAt: new Date(),
                unreadCounts: new Map()
            });
        }

        // Create new message
        const message = await Message.create({
            conversationId: conversation._id,
            senderId,
            content
        });

        // Update conversation after creating message
        updateConversationAfterCreateMessage(conversation, message, senderId);

        await conversation.save();

        return res.status(201).json({ message: 'Message sent successfully', data: message });
    } catch (error) {
        console.error('Error in sendDirectMessage:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const sendGroupMessage = async (req, res) => {
    try {
        const { groupId, content } = req.body;
        const senderId = req.user.id;

        // Logic to send a group message
        if (!content) {
            return res.status(400).json({ message: 'Message content cannot be empty' });
        }

        


    } catch (error) {
        console.error('Error in sendGroupMessage:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};