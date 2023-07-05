const connection = require('./models/connection');
const app = require('./app');
const path = require('path');


require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const PORT = process.env.PORT;

connection
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT} and connected to the database`));
  })
  .catch((err) => console.log(err));
