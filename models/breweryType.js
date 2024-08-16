import mongoose from 'mongoose';

import slugify from '../middleware/slugify.js';

const Schema = mongoose.Schema;

var breweryTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved']
        },
        slug: {
            type: String,
            index: true
        }
    },
    { timestamps: true }
);

breweryTypeSchema.pre('save', async function (next) {
    this.slug = slugify(this.name);
    next();
});

export default mongoose.model('BreweryType', breweryTypeSchema);
