import jwt from "jsonwebtoken"; 

export const verifyToken = (req, res, next) => {
    
    const token = req.cookies.token; 
    
    if(!token){
        return res.status(401).json({
            success: false, 
            message: "Token not found"
        })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 

        if(!decoded){
            return res.status(401).json({
                success: false,
                message: "Unauthorized access - invalid token",
            })
        }

        req.userid = decoded.userid ;
        // console.log(decoded.userid); 
        // console.log(req.userid); 
        next(); 

    } catch (error) {
        console.log(error); 

    }
}

