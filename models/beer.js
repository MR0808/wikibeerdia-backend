import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var beerSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        brewery: {
            type: Schema.Types.ObjectId,
            ref: 'Brewery'
        },
        description: String,
        abv: String,
        ibu: String,
        yearCreated: String,
        available: Boolean,
        style: {
            type: Schema.Types.ObjectId,
            ref: 'Style'
        },
        images: [
            {
                imageUrl: String,
                isMain: Boolean
            }
        ],
        status: {
            type: String,
            enum: ['Draft', 'Pending', 'Approved']
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model('Beer', beerSchema);
