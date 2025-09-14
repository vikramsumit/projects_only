import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to verify password
userSchema.methods.verifyPassword = async function(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email });
};



const User = mongoose.model('User', userSchema);

export default User;
