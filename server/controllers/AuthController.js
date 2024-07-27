import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import {renameSync, unlinkSync} from "fs" // file system ie.fs is inbuilt in node unlike nodemon,express etc

const maxAge = 3 * 24 * 60 * 60 * 1000;// converts 3 days to milliseconds. 

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
};

export const signup = async (request, response, next) => {
    try {
        const { email, password } = request.body; //we get email,password from body
        if (!email || !password) {
            return response.status(400).send("Email and Password is required.")
        }
        const user = await User.create({ email, password });
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        }); //converting token to cookie
        return response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            }
        });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}

export const login = async (request, response, next) => {
    try {
        const { email, password } = request.body; //we get email,password from body
        if (!email || !password) {
            return response.status(400).send("Email and Password is required.")
        }
        const user = await User.findOne({ email });
        if(!user){
            return response.status(404).send("User with the given email not found.")
        }
        const auth=await compare(password, user.password);
        if(!auth){
            return response.status(400).send("Passowrd is incorrect.")
        }
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true, //tick mark in cookies inspect section
            sameSite: "None",
        }); //converting token to cookie
        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            },
        });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}

export const getUserInfo = async (request, response, next) => {
    try {
        const userData = await User.findById(request.userId);
        if(!userData){
            return response.status(404).send("User with the given id not found.");
        }
        return response.status(200).json({
                id: userData.id, //mongodb unique id
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName, //initially blank
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color,
        });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}

export const updateProfile = async (request, response, next) => {
    try {
        const {userId} = request;
        const {firstName,lastName,color} = request.body;
        if(!firstName || !lastName ){
            return response.status(400).send("Firstname, Lastname and Color is required.");
        }
        const userData = await User.findByIdAndUpdate(userId, {firstName, lastName, color, profileSetup:true}, {new:true, runValidators:true}) //send this data to next page  and validate the data
        return response.status(200).json({
                id: userData.id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName, //values are update
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color,
        });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}


export const addProfileImage = async (request, response, next) => {
    try {
     if(!request.file){
        return response.status(400).send("File is required")
     }
     const date = Date.now()
     let fileName ="uploads/profiles/" +date +request.file.originalname
     renameSync(request.file.path, fileName);

     const updatedUser = await User.findByIdAndUpdate(request.userId, {image:fileName} , {new:true, runValidators:true}) //mongo query findoneAndUpdate
        return response.status(200).json({
                image: updatedUser.image,
        });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}

export const removeProfileImage = async (request, response, next) => {
    try {
        const {userId} = request;
        const user = await User.findById(userId)
        if(!user){
            return response.status(404).send("User not found.")// we send response so as to debug from network
        }
        if(user.image){
            unlinkSync(user.image)
        }
        user.image =null
        await user.save()
        return response.status(200).send("Profile image removed successfully.")
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}