import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var stateSchema = new Schema(
    {
        isoCode: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: 'Country'
        }
    },
    { timestamps: true }
);

export default mongoose.model('State', stateSchema);
