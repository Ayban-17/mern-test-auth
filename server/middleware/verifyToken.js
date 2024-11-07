import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {

    const token = req.cookies.AuthToken;

    if(!token){
        return res.status(401).json({success:false, message:"Unauthorized - No Token Provided"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({success:false, message:"Unauthorized - Invalid Token!"})
        }

        req.userID = decoded.userID;

        next();
    } catch (error) {
        console.log("error: ", error.message);
        res.status(500).json({success: false, message:error.message});
    }
}