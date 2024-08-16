import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var tokenSchema = new Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
});

export default mongoose.model('Token', tokenSchema);
