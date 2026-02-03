import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import Session from '../models/Session.js';


const ACCESS_TOKEN_TTL = '30s';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

export const signUp = async(req, res) =>{
    try {
        const { username, password, email, firstName, lastName } = req.body;

        if (!username || !password || !email || !firstName || !lastName) {
            return res
            .status(400)
            .json({ 
                message: 
                'All fields are required' 
            });
    }

    // kiem tra username da ton tai chua
    const duplicateUser = await User.findOne({username});

    if (duplicateUser) {
        return res
        .status(409)
        .json({ message: 'Username already exists' });
    }

    // ma hoa password
    const hashedPassword = await bcrypt.hash(password, 10);     // salt rounds = 10

    // tao user moi
    await User.create({
        username,
        hashedPassword,
        email,
        displayName: `${firstName} ${lastName}`
    });

    // return
    return res.sendStatus(204);
    
    
    } catch (error) {
        console.error('Error during sign up:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

};

export const signIn = async (req, res) => {
    try {
        // validate input
        const { username, password } = req.body;
        if (!username || !password) {
            return res
            .status(400)
            .json({ message: 'Username and password are required' });
        }

        // check user existence
        const user =  await User.findOne({ username });
        if (!user) {
            return res
            .status(401)
            .json({ message: 'Invalid username or password' });
        }

        // verify password
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            return res
            .status(401)
            .json({ message: 'Invalid username or password' });
        }

        // create access token
        const accessToken = jwt.sign(
            { userId: user._id},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );
               
        // create refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');
         
        //create session
        await Session.create({
            userId: user._id,
            refreshToken,
            expireAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });

        // return tokens in cookies
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None', // cho backend va frontend khac domain co the nhan cookie
            maxAge: REFRESH_TOKEN_TTL
        });
            
        // return success
        return res
                .status(200)
                .json({ message: `User ${user.displayName} signed in successfully`, accessToken });
        
    } catch (error) {
        console.error('Error during sign in:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const signOut = async (req, res) => {
    try {  
        // get refresh token from cookies
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            // delete session from database
            await Session.deleteOne({ refreshToken });
            
            // clear cookies
            res.clearCookie("refreshToken");
        }

        return res.sendStatus(204);

    } catch (error) {
        console.error('Error during sign out:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

};

export const refreshToken = async (req, res) => {
    try {
        // get refresh token from cookies
        const token = req.cookies?.refreshToken; 
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }
        // find session
        const session = await Session
            .findOne({ refreshToken: token })
            .populate('userId');
        if (!session) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // check if session is expired
        if (session.expireAt < new Date()) {
            await Session.deleteOne({ refreshToken: token });
            return res.status(403).json({ message: 'Refresh token has expired' });
        }
        const user = session.userId;

        // create new access token
        const AccessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );
        // return new access token in cookie
        res.status(200).json({ accessToken: AccessToken });
    } catch (error) {
        console.error('Error during token refresh:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


