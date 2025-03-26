import User from "../models/user.js";
import Session from "../models/session.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";

export async function registerUser(payload){
    const user = await User.findOne({ email: payload.email});
    
    if( user !== null ){
        throw createHttpError.Conflict("Email in use"); 
    }

    payload.password = await bcrypt.hash(payload.password, 10);

    return User.create(payload);
}

export async function loginUser(email, password){
    const user = await User.findOne({email});

    if(user === null){
        throw createHttpError.Unauthorized("Email or password is incorrect");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(isMatch !== true){
        throw createHttpError.Unauthorized("Email or password is incorrect");
    }

    await Session.deleteOne({userId: user._id});
    
    return Session.create({
        userId: user._id,
        accessToken: crypto.randomBytes(30).toString('base64'),
        refreshToken: crypto.randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date( Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date( Date.now() + ONE_DAY),
    })
}

export async function logoutUser(sessionId, refreshToken){
    await Session.deleteOne({_id: sessionId, refreshToken });
    return undefined;
}

export async function refreshSession(sessionId, refreshToken){
    const session = await Session.findOne({_id: sessionId, refreshToken});
        if(session === null){
            throw createHttpError.Unauthorized("Session not found");
        }
        if(session.refreshTokenValidUntil < new Date()){
            throw createHttpError.Unauthorized("Refresh token is expired");
        }

        await Session.deleteOne({_id: session._id, refreshToken: session.refreshToken });
        return Session.create({
            userId: session.userId,
            accessToken: crypto.randomBytes(30).toString('base64'),
            refreshToken: crypto.randomBytes(30).toString('base64'),
            accessTokenValidUntil: new Date( Date.now() + FIFTEEN_MINUTES),
            refreshTokenValidUntil: new Date( Date.now() + ONE_DAY),
        })
}