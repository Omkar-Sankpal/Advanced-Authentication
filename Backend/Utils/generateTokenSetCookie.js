import jwt from "jsonwebtoken"; 

export const generateTokenandSetCookie = (res, userid) => {
    const token = jwt.sign(
        {userid},
        process.env.JWT_SECRET,
        {
            expiresIn : "7d",
        }
    )

    res.cookie("token", token, {
        httpOnly: true, //cannot be accessed with javascript prevents xss attacks 
        secure: process.env.MODE_ENV === "production", 
        sameSite: "strict", //prevents csrf attacks 
        maxAge: 7 * 24 * 60 * 60 * 1000 ,

    }); 

    return token ; 
}