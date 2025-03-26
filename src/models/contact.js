import mongoose, { Schema } from "mongoose";

const contactSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    phoneNumber:{
        type: String,
        required: true,
    },
    email:{
        type: String,
    },
    isFavourite:{
        type: Boolean,
        default: false,
    },
    contactType:{
        type: String,
        enum: ['work', 'home', 'personal'],
        default: 'personal',
        required: true,
    },
    userId:{
        type: Schema.Types.ObjectId,
        required: true,
    },
},
{ timestamps:true,  versionKey: false },
)
const Contact = mongoose.model('Contact', contactSchema);
export default Contact; 
