import mongoose from "mongoose";



const fileSchema = new mongoose.Schema({
    name: String,
    size: Number,
    fileUrl: String,
    filename: String,
})

const fileModel = mongoose.models.File || mongoose.model('File', fileSchema)

export default fileModel;