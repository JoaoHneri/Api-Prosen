const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const connection = mongoose
.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.zl7xwh0.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    console.log('Connected database successfully');
  })
  .catch((err) => console.log(err));

module.exports = connection;
