import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var citySchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        state: {
            type: Schema.Types.ObjectId,
            ref: 'State'
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: 'Country'
        }
    },
    { timestamps: true }
);

export default mongoose.model('City', citySchema);
