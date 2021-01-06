require('dotenv').config();
const mongoose = require('mongoose');
const consola = require('consola')


const ConnectDb = async () => {
    await mongoose.connect(process.env.MONGO_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }).
        then(() => consola.success('Connected to Database Successfully...'))
        .catch(err => consola.error('Failed Could not connect to Database', err));
}

ConnectDb();