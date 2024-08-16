import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var brewerySchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        city: {
            type: Schema.Types.ObjectId,
            ref: 'City'
        },
        description: String,
        website: String,
        logoUrl: String,
        beers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Beer'
            }
        ],
        styles: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Style'
            }
        ],
        type: {
            type: Schema.Types.ObjectId,
            ref: 'BreweryType'
        },
        images: [
            {
                imageUrl: String
            }
        ],
        status: {
            type: String,
            enum: ['Draft', 'Pending', 'Approved'],
            default: 'Pending'
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model('Brewery', brewerySchema);
