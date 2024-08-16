import validator from 'validator';

import User from '../models/user.js';

export const validateSignup = async (email, username, password) => {
    const errors = [];
    try {
        if (!validator.isEmail(email)) {
            errors.push({ field: 'email', message: 'Email is invalid' });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            errors.push({ field: 'email', message: 'Email already exists' });
        }
        if (validator.isEmpty(username)) {
            errors.push({ field: 'username', message: 'Username is required' });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            errors.push({
                field: 'username',
                message: 'Username already exists'
            });
        }
        if (
            !validator.isStrongPassword(password, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
        ) {
            errors.push({
                field: 'password',
                message: 'Password not strong enough.'
            });
        }
    } catch (error) {
        if (!error.code) {
            error.code = 500;
        }
        throw error;
    }
    return errors;
};

export const validateLogin = async (identifier, password) => {
    const errors = [];
    if (validator.isEmpty(identifier)) {
        errors.push({
            field: 'identifier',
            message: 'Email/Username is required'
        });
    }
    if (validator.isEmpty(password)) {
        errors.push({
            field: 'password',
            message: 'Password is required'
        });
    }
    return errors;
};
