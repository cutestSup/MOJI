import jwt from 'jsonwebtoken'
import User from '../models/User.js';


// authorization middleware
export const protectedRoute = (req, res, next) => {
    try {
        // Extract token from header
        const authHeader = req.headers['authorization'] ;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer <TOKEN>
        if (!token) {
            return res.status(401).json({ message: 'Access token missing' });
        }   

        // Check if token is valid
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if (err) {
                console.error('Token verification error:', err);
                return res.status(403).json({ message: 'Invalid access token' });
            }
        
            // find user by id from token
            const user = await User.findById(decodedUser.userId).select('-hashedPassword');
            if (!user) {
               return res.status(404).json({ message: 'User not found' });
            }   
        
            // attach user to request object
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Error in protectedRoute middleware:', error);
        return res.status(500).json({ message: 'Internal Server Error' });


    }



}
