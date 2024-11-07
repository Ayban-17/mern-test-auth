import jwt from "jsonwebtoken"
export const generateJwtTokenAndSetCookie = (res, userID) =>{
    const token = jwt.sign({userID}, process.env.JWT_SECRET, {expiresIn:"7d"});
    
    res.cookie("AuthToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 7 * 60 * 60 * 1000
    })

    return token
} 