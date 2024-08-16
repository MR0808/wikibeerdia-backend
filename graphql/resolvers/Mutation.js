import crypto from 'crypto';

import bcrypt from 'bcryptjs';
import { MailService } from '@sendgrid/mail';

import User from '../../models/user.js';
import Token from '../../models/token.js';
import clearImage from '../../util/file.js';
import authCheck from '../../util/auth.js';
import { validateSignup } from '../../validators/auth.js';

const Mutation = {
    async createUser(parent, { userInput }) {
        const { email, username, password } = userInput;
        const errors = await validateSignup(email, username, password);
        if (errors.length > 0) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        try {
            const hashedPw = await bcrypt.hash(password, 12);
            const user = new User({
                email: email,
                password: hashedPw,
                username: username,
                passwordLastUpdated: new Date()
            });
            const newUser = await user.save();
            const token = new Token({
                _userId: newUser._id,
                token: crypto.randomBytes(16).toString('hex')
            });
            await token.save();
            const mail = new MailService();
            mail.setApiKey(process.env.SENDGRID_KEY);
            const message = {
                to: email,
                subject: 'Verify your email',
                from: {
                    name: 'Mark @ Wikibeerdia',
                    email: 'mark@wikibeerdia.com'
                },
                html: `Hello,<br>Please verify your account by clicking the link: <a href="http://localhost:5173/confirmation/${token.token}">http://localhost:5173/confirmation/${token.token}</a>`
            };
            await mail.send(message);
            return { ...newUser._doc, _id: newUser._id.toString() };
        } catch (error) {
            if (!error.code) {
                error.code = 500;
            }
            console.log(error);

            throw error;
        }
    },
    async verifyEmail(parent, { token: newToken }) {
        try {
            const token = await Token.findOne({ token: newToken });
            if (!token) {
                return {
                    result: false,
                    message:
                        'We were unable to find a valid token. your token may have expired',
                    data: 'token'
                };
            }
            const user = await User.findOne({ _id: token._userId });
            if (!user) {
                return {
                    result: false,
                    message: 'We were unable to find a user for this token.',
                    data: 'token'
                };
            }
            if (user.isVerified) {
                return {
                    result: false,
                    message: 'This user has already been verified',
                    data: 'token'
                };
            }
            user.isVerified = true;
            const newUser = await user.save();
            await Token.findByIdAndDelete(token._id);
            return {
                result: true,
                message: 'User has been verified',
                data: 'token'
            };
        } catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
};

export default Mutation;
