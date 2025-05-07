import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";


const authMiddleWare = asyncHandler(async (req, res, next) => {
    try {

        const token = req.cookies?.jwt || 
        req.header("Authorization")?.replace("Bearer ", "")

        if(!token){
            return res
            .status(401)
            .json(
                new ApiError(401, "Unauthorized User Token")
            )
        }
            let decodedToken;
            try {
                decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            } catch (error) {
                return res
                .status(401)
                .json(
                    new ApiError(401, "Unauthorized Invalid User Token")
                )
            }
            const verifiedUser = await db.user.findUnique({
                where:{
                    id:decodedToken.id
                },
                select:{
                    id:true,
                    email:true,
                    name:true,
                    image:true,
                    role:true
                }
            })
    
            if(!verifiedUser){
                throw new ApiError(400, "Invalid User Token")
            }
    
            req.user = verifiedUser;
            next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid User Token")
    }
})

export { authMiddleWare };