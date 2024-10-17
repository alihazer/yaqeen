const Token = require("../models/token.js");

// create new token
const createToken = async (req, res)=>{
    const { token } = req.body;
    try {
        const alreadyFound = await Token.findOne({ token });
        if(alreadyFound){
            return res.status(400).json({
                status: false,
                message: "Token already exists"
            });
        }
        const newToken = await Token.create({ token });
        console.log("Token created succesfully", newToken);
        return res.status(201).json({
            status: true,
            message: "Token created succesfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal serval error"
        })
    }
}

const updateToken = async (req, res)=>{
    const { token, isActive } = req.body;
    console.log(isActive);
    try {
        const tokenFound = await Token.findOne({ token });
        if(!tokenFound){
            return res.status(404).json({
                status: false,
                message: "Token not found"
            });
        }
        console.log(tokenFound);
        const updatedToken = await Token.findByIdAndUpdate(tokenFound._id, { isActive }, { new: true }).exec();
        console.log("Token updated succesfully", updatedToken);
        return res.status(200).json({
            status: true,
            message: "Token Updated succesfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal serval error"
        })
    }
}


module.exports = { createToken, updateToken };