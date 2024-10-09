const mongoose = require("mongoose");

const dbConnect= async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);  
        console.log(`MongoDB connected succesfully ${conn.connection.host} `)
    } catch (error) {
        console.log("Error while connecting to db");
        console.log(error);
    } 
}

module.exports = { dbConnect }