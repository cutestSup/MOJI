import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    displayName: {
        type: String,
        required: true,
        trim: true,
    },
    avatarUrl: {
        type: String, // link CDN de hien thi hinh anh
    },
    avatarId: {
        type: String, // ID hinh anh tren cloudinary de xoa
    },
    bio: {
        type: String,
        maxLength: 500,
    },
    phone: {
        type: String,
        sparse: true, //cho phep null nhung k unique
    },
}, {
    timestamps: true,
    }
);

export default mongoose.model('User', userSchema);