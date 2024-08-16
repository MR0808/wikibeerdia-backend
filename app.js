import path from 'path';
import { readFileSync } from 'fs';
import * as url from 'url';

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import multer from 'multer';
import { ApolloServer } from 'apollo-server-express';
import pkg from 'graphql-playground-middleware-express';

import auth from './middleware/auth.js';
import clearImage from './util/file.js';

const typeDefs = readFileSync('./graphql/schema.graphql', 'utf8');
import Query from './graphql/resolvers/Query.js';
import Mutation from './graphql/resolvers/Mutation.js';
import dateScalar from './graphql/scalars.js';

const resolvers = {
    Query,
    Mutation,
    Date: dateScalar
};

const { default: expressPlayground } = pkg;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const MongoDBStore = connectMongoDBSession(session);

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.vuiwnxj.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        const fileExt =
            '.' + file.mimetype.substring(file.mimetype.indexOf('/') + 1);
        cb(null, uuidv4() + fileExt);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json()); // application/json
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

const corsOptions = {
    origin: '*',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(auth);

app.put('/post-image', (req, res, next) => {
    if (!req.isAuth) {
        throw new Error('Not authenticated!');
    }
    if (!req.file) {
        return res.status(200).json({ message: 'No file provided!' });
    }
    if (req.body.oldPath) {
        clearImage(req.body.oldPath);
    }
    return res.status(201).json({
        message: 'File stored.',
        filePath: req.file.path.replace(/\\/g, '/')
    });
});

const startServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req, connection, res }) => {
            return { req: req };
        }
    });
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });
};

startServer();

app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

try {
    await mongoose.connect(MONGODB_URI);
    app.listen(process.env.PORT || 8080);
} catch (error) {
    console.log('error: ' + error);
}
