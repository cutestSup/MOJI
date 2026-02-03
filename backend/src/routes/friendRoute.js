import express from 'express';
import { sendFriendRequest, removeFriend, acceptFriendRequest, declineFriendRequest, getFriendsList, getFriendRequests } from '../controllers/friendController.js';

const router = express.Router();

router.post('/requests', sendFriendRequest);
router.post('/remove', removeFriend);

router.post('/requests/:requestId/accept', acceptFriendRequest);

router.post('/requests/:requestId/decline', declineFriendRequest);

router.get('/', getFriendsList);

router.get('/requests', getFriendRequests);

export default router;