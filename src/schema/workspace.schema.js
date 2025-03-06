import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'WorkSpace name is required'],
        unique: true
    },
    description: {
        type: String
    },
    members: [
        {
            membersId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            role: {
                type: String,
                enum: ['admin', 'member'],
                default: 'member'
            }
        }
    ],
    joinCode: {
        type: String,
        required: [true, 'Join Code is required'],
    },
    channels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel'
        }
    ]

});

const WorkSpace = mongoose.model('WorkSpace', workspaceSchema);

export default WorkSpace;