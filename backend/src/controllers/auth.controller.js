import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { db } from "../libs/db.js";
import bcrypt from "bcryptjs";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {

    const { email, password, name } = req.body;

    
    if (
        [email, password , name].some((field) => !field || field.trim() === "")
    ) {
        return res
        .status(400)
        .json(
            new ApiError(400, "All fields are required")
        )
    }
    
    const existingUser = await db.user.findUnique({
        where: {
            email
        }
    })
    
    if(existingUser)
        {
            throw new ApiError(400, "Email or Name already exits")
        }
        
        console.log(`We r in Line number 35 ${email}`);
        const hashedPassword = await bcrypt.hash(password, 12);
        
    const newUser = await db.user.create({
        data:{
            email,
            password:hashedPassword,
            name,
            role: UserRole.USER
        }
    })

    const token = jwt.sign(
        {
            id:newUser.id
        },
            process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRY
        }
    )

    const options = {
        httpOnly: true,
        secure:process.env.NODE_ENV !== "development",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'Strict'
    }

    res.cookie("jwt", token, options);

    return res
    .status(201)
    .json(
        new ApiResponse(
            200, newUser, "User registered Successfully"
        )
    )

})

const userLogin = asyncHandler(async(req, res) => {
        const { email, password } = req.body;

        if (
            [email, password].some((field) => !field || field.trim() === "")
        ) {
            return res
            .status(400)
            .json(
                new ApiError(400, "All fields are required")
            )
        }

        const user = await db.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            throw new ApiError(401, "Invalid User Credentials")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            throw new ApiError(400, "Email or Password is Incorrect")
        }

        const token = jwt.sign(
            {
                id:user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:process.env.JWT_EXPIRY
            }
        )

        const options = {
            httpOnly:true,
            secure:process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge:1000 * 60 * 60 * 24 * 7
        }

        res.cookie("jwt", token, options)

        return res
        .status(200)
        .json(
            new ApiResponse(
                200, user, "User Logged In Successfully"
            )
        )

})

const logOutUser = asyncHandler(async(req, res)=> {
    try {
        const options = {
            httpOnly:true,
            secure:process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge:1000 * 60 * 60 * 24 * 7
        }

        return res
        .status(200)
        .clearCookie("jwt", options)
        .json(
            new ApiResponse(200, {}, "User Logged Out Successfully")
        )
        
    } catch (error) {
        return res
        .status(400)
        .json(
            new ApiError(400, "Invalid User Credentials", error)
        )
    }
})

const checkUser = asyncHandler(async(req,res)=> {
    try {
        return res
        .status(200)
        .json(
            new ApiResponse(200, "User Authencitated Successfully")
        )
        
    } catch (error) {
        return res
        .status(404)
        .json(
            new ApiResponse(404, "Requested User not found", false)
        )
    }
})

export { registerUser,userLogin, logOutUser, checkUser }

