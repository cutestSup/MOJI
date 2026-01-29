import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import Session from '../models/Session.js';


const ACCESS_TOKEN_TTL = '30m';
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
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None', // cho backend va frontend khac domain co the nhan cookie
            maxAge: REFRESH_TOKEN_TTL
        });
            
        // return success
        return res.sendStatus(204).json({ message: `User ${username} signed in successfully` , accessToken});
        
    } catch (error) {
        console.error('Error during sign in:', error);
        return res.status(500).json({ message: 'Internal server error' });

    }

}