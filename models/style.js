import mongoose from 'mongoose';

import slugify from '../middleware/slugify.js';

const Schema = mongoose.Schema;

var styleSchema = new Schema(
    {
        name: String,
        slug: {
            type: String,
            index: true
        },
        description: String,
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: 'Style'
        },
        ancestors: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Style',
                    index: true
                },
                name: String,
                slug: String
            }
        ]
    },
    { timestamps: true }
);

styleSchema.pre('save', async function (next) {
    this.slug = slugify(this.name);
    next();
});

export default mongoose.model('Style', styleSchema);
