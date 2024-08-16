import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var beerReviewSchema = new Schema(
    {
        beer: {
            type: Schema.Types.ObjectId,
            ref: 'Beer'
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

export default mongoose.model('BeerReview', beerReviewSchema);
