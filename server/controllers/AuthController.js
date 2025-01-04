//define controllers (logic) 

import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import {renameSync, unlinkSync} from "fs" // file system ie.fs is inbuilt in node unlike nodemon,express etc
import nodemailer from "nodemailer"
import otpGenerator from "otp-generator"
import OTP from "../models/OTPModel.js"

const maxAge = 3 * 24 * 60 * 60 * 1000;// converts 3 days to milliseconds. 

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
};

const sendOTPEmail = async (email, otp) => {
    try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "OTP Verification",
      html: `<!DOCTYPE html>
      <html>
      
      <head>
          <meta charset="UTF-8">
          <title>OTP Verification </title>
          <style>
              body {
                  background-color: #ffffff;
                  font-family: Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.4;
                  color: #333333;
                  margin: 0;
                  padding: 0;
              }
      
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  text-align: center;
              }
  
            .header {
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                margin-bottom: 20px;
                                text-decoration: none;
                            }
      
              .logo {
                  max-width: 50px;
                  margin-right: 10px;
              }
  
        .brand-name {
                                font-size: 24px;
                                font-weight: bold;
                                color: #333;
                                vertical-align: middle;
                                text-decoration: none;
                            }
      
              .message {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 20px;
              }
      
              .body {
                  font-size: 16px;
                  margin-bottom: 20px;
              }
      
              .cta {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #FFD60A;
                  color: #000000;
                  text-decoration: none;
                  border-radius: 5px;
                  font-size: 16px;
                  font-weight: bold;
                  margin-top: 20px;
              }
      
              .support {
                  font-size: 14px;
                  color: #999999;
                  margin-top: 20px;
              }
      
              .highlight {
                  font-weight: bold;
              }
          </style>
      
      </head>
      
      <body>
          <div class="container">
              <a href="https://greatful-chat-app.vercel.app" class="header"><img class="logo"
                      src="https://i.ibb.co/xsyRKf3/logo-allh27.png" alt="Grateful Chat Application Logo"> <span class="brand-name">Grateful</span></a>
              <div class="message">OTP Verification </div>
              <div class="body">
                  <p>Dear User,</p>
                  <p>Thank you for registering with Grateful Chat Application. To complete your registration, please use the following OTP
                      (One-Time Password) to verify your account:</p>
                  <h2 class="highlight">${otp}</h2>
                  <p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.
                  Once your account is verified, you will have access to our platform and its features.</p>
              </div>
              <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
                      href="mailto:madhushrisem5@gmail.com">madhushrisem5@gmail.com</a>. We are here to help!</div>
          </div>
      </body>
      
      </html>`,
    };
  
    const info = await transporter.sendMail(mailOptions);
    console.log(info)
  } catch (error)
  {
    console.log("Mail not sent")
    console.log({error})
  }
  };

export const signup = async (request, response, next) => {
    try {
        const { email, password } = request.body; //we get email,password from body
        if (!email || !password) {
            return response.status(400).send("Email and Password is required.") //agar email nahi toh ye return karo
        }
        const user = await User.create({ email, password });
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        }); //converting token to cookie
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        await OTP.create({ email, otp, expiresAt: Date.now() + 5 * 60 * 1000 });
        await sendOTPEmail(email, otp);
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

export const verifyOTP = async (req, res) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).send('Email and OTP are required.');
      }
  
      const otpData = await OTP.findOne({ email, otp });
      if (!otpData || otpData.expiresAt < Date.now()) {
        return res.status(400).send('Invalid or expired OTP.');
      }
      await User.findOneAndUpdate({ email }, { profileSetup: false });
      await OTP.deleteOne({ email });
      const user = await User.findOne({ email });
      res.cookie('jwt', createToken(email, user.id), {
        maxAge,
        secure: true,
        sameSite: 'None',
      });
  
      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          profileSetup: user.profileSetup,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send('Internal Server Error');
    }
  };

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
        const auth=await compare(password, user.password); //compare karo jo password user nai daala and password already present
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
                //easy to debug
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

export const logout = async (request, response, next) => {
    try {
        response.cookie("jwt","",{maxAge:1, secure:true,sameSite:"None"}) //1 microsecond , "" cookie becomes empty
        return response.status(200).send("Logout successfully.")
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}

