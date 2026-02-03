import Friend from '../models/Friend.js';
import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';


export const sendFriendRequest = async (req, res) => {
    try {
        const { to, message } = req.body;
        const from = req.user._id;

        // prevent sending friend request to oneself
        if (from.toString() === to.toString()) {
            return res.status(404).json({ message: 'You cannot send a friend request to yourself' });
        }

        // check if toUserId exists
        const toUser = await User.exists({ _id: to });
        if (!toUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // check if already friends or request already sent
        let userA = from.toString();
        let userB = to.toString();

        if (userA > userB) {
            [userA, userB] = [userB, userA];
        }

        const [alreadyFriend, existingRequest] = await Promise.all([
            Friend.findOne({ userA, userB }),
            FriendRequest.findOne({
                $or: [
                    { from, to },
                    { from: to, to: from }
                ]
            })
        ]);

        if (alreadyFriend) {
            return res.status(400).json({ message: 'You are already friends' });
        }

        if (existingRequest) {
            return res.status(400).json({ message: 'A friend request already exists between you and this user' });
        }

        // all checks passed, create friend reques
        // create friend request
        const reqquest = await FriendRequest.create({ from, to, message });
        
        return res.status(201).json({ message: 'Friend request sent', request: reqquest });
        


    } catch (error) {
        console.error('Error in sendFriendRequest controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const removeFriend = async (req, res) => {
    try {

    } catch (error) {
        console.error('Error in removeFriend controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        // find the request by id
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        if (friendRequest.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to accept this friend request' });
        }

        // create friendship
        const newFriend = await Friend.create({
            userA: friendRequest.from,
            userB: friendRequest.to
        });

        // delete the friend request after acceptance
        await FriendRequest.findByIdAndDelete(requestId);

        const from = await User.findById(friendRequest.from)
            .select('_id displayName avatarUrl')
            .lean();

        return res.status(200).json({ 
            message: 'Friend request accepted', 
            newFriend: {
                _id: from?._id,
                displayName: from?.displayName,
                avatarUrl: from?.avatarUrl
            }
         });

    } catch (error) {
        console.error('Error in acceptFriendRequest controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const declineFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        // find the request by id
        const friendRequest = await FriendRequest.findOne(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        if (friendRequest.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to decline this friend request' });
        }

        // delete the friend request after declining
        await FriendRequest.findByIdAndDelete(requestId);

        return res.sendStatus(204);

    } catch (error) {
        console.error('Error in declineFriendRequest controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getFriendsList = async (req, res) => {
    try {
        const userId = req.user._id;

        // find all friends where user is either userA or userB
        const friendship = await Friend.find({
            $or: [
                { userA: userId },
                { userB: userId }
            ]
        })
        .populate("userA", "_id displayName avatarUrl username")
        .populate("userB", "_id displayName avatarUrl username")
        .lean();

        if (!friendship.length) {
            return res.status(200).json({ friends: [] });
        }

        // map friends to return friend info
        const friends = friendship.map((f) => 
            f.userA._id.toString() === userId.toString() ? f.userB : f.userA
        );

        return res.status(200).json({ friends });
    } catch (error) {
        console.error('Error in getFriendsList controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const populateFields = "_id displayName avatarUrl username";

        // find all friend requests where user is the sender or receiver
        const [sendtRequests, receivedRequests] = await Promise.all([
            FriendRequest.find({ from: userId })
                .populate("to", populateFields)
                .lean(),
            FriendRequest.find({ to: userId })
                .populate("from", populateFields)
                .lean()
        ]);


        return res.status(200).json({ 
            sendtRequests, receivedRequests
        });


    } catch (error) {
        console.error('Error in getFriendRequests controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getSuggestedFriends = async (req, res) => {
    try {   

    } catch (error) {
        console.error('Error in getSuggestedFriends controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const searchUsers = async (req, res) => {
    try {
    } catch (error) {
        console.error('Error in searchUsers controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getMutualFriends = async (req, res) => {
    try {

    } catch (error) {
        console.error('Error in getMutualFriends controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const blockUser = async (req, res) => {
    try {

    } catch (error) {
        console.error('Error in blockUser controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const unblockUser = async (req, res) => {
    try {   

    } catch (error) {
        console.error('Error in unblockUser controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getBlockedUsers = async (req, res) => {
    try {
    } catch (error) {
        console.error('Error in getBlockedUsers controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};





