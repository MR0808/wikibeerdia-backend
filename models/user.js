import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true
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
        },
        firstName: String,
        lastName: String,
        passwordLastUpdated: Date,
        dateOfBirth: Date,
        access: {
            type: String,
            enum: ['Admin', 'User'],
            default: 'User'
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', 'NotSay']
        },
        state: {
            type: Schema.Types.ObjectId,
            ref: 'State'
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: 'Country'
        },
        profilePicture: String,
        isVerified: {
            type: Boolean,
            default: false
        },
        emailOld: String,
        passwordResetToken: String,
        passwordResetExpires: Date,
        otp_enabled: {
            type: Boolean,
            default: false
        },
        otp_verified: {
            type: Boolean,
            default: false
        },
        otp_ascii: String,
        otp_hex: String,
        otp_base32: String,
        otp_auth_url: String,
        otp_backups: [
            {
                backup_code: String
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model('User', userSchema);
