import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var breweryReviewSchema = new Schema(
    {
        brewery: {
            type: Schema.Types.ObjectId,
            ref: 'Brewery'
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: Number,
        comment: String
    },
    { timestamps: true }
);

export default mongoose.model('BreweryReview', breweryReviewSchema);
