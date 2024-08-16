import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../../models/user.js';

import authCheck from '../../util/auth.js';
import { validateLogin } from '../../validators/auth.js';

const Query = {
    async login(parent, { userInput }) {
        const { identifier, password, rememberMe } = userInput;
        const errors = validateLogin(identifier, password);
        if (errors.length > 0) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        try {
            const user = await User.findOne({
                $or: [{ email: identifier }, { username: identifier }]
            });
            if (!user) {
                const error = new Error('User not found');
                error.data = {
                    field: 'identifier',
                    message: 'Email/Username not found'
                };
                error.code = 401;
                throw error;
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                const error = new Error('Login combination not found');
                error.data = {
                    field: 'password',
                    message: 'Login combination not found'
                };
                error.code = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    identifier: user.identifier,
                    userId: user._id.toString()
                },
                process.env.LOGIN_SALT,
                { expiresIn: rememberMe ? '60 days' : '2h' }
            );
            return {
                token,
                userId: user._id.toString(),
                otp_enabled: user.otp_enabled
            };
        } catch (error) {
            if (!error.code) {
                error.code = 500;
            }
            throw error;
        }
    }
};

export default Query;
