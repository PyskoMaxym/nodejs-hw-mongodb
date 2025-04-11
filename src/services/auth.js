import User from "../models/user.js";
import Session from "../models/session.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import * as fs from "node:fs";
import path from "node:path"; 
import handlebars from "handlebars";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getEnvVar } from "../utils/getEnvVar.js";

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(path.resolve("src/templates/reset-password.hbs"),
{encoding: "utf-8"},
);


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

export async function requestPasswordReset(email){
    const user = await User.findOne({email});

    if(user === null){
        throw createHttpError.NotFound("User not found");
    }

    const resetToken = jwt.sign({ sub: user._id, name: user.name}, getEnvVar("JWT_SECRET"), {expiresIn: "5m"});

    const template = handlebars.compile(RESET_PASSWORD_TEMPLATE);
    try{
        await sendEmail(email, "Reset your password", template({resetToken}));
    } catch(error){
        throw createHttpError.InternalServerError("Failed to send the email, please try again later.");
    }
}

export async function resetPassword(token, newPassword){
    try{
        const decoded = jwt.verify(token, getEnvVar("JWT_SECRET"));
        
        const user = await User.findById(decoded.sub);

        if(user === null){
            throw createHttpError.NotFound("User not found");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await User.findByIdAndUpdate(user._id, {password: hashedPassword});     

    }catch(error){

        if(error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" ){
            throw createHttpError.Unauthorized("Token is expired or invalid.");
        }

        throw error;
    }
}
export async function loginOrRegister(email, name){
    let user = await User.findOne({email});

    if(user === null){
        const password = await bcrypt.hash(crypto.randomBytes(30).toString("base64"), 10);
        
        user = await User.create({
            email,
            name,
            password
        })
    }

    await Session.deleteOne({userId: user._id});

    return Session.create({
        userId: user._id,
        accessToken: crypto.randomBytes(30).toString('base64'),
        refreshToken: crypto.randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date( Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date( Date.now() + ONE_DAY),
    })}