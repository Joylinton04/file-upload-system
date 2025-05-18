import mongoose from "mongoose";



const fileSchema = new mongoose.Schema({
    message: String,
    name: String,
    size: Number,
    fileUrl: String,
})

const fileModel = mongoose.models.File || mongoose.model('File', fileSchema)

export default fileModel;