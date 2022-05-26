const mongoose = require('mongoose')

exports.connectDatabase = (db_url) => {
  mongoose
    .connect(db_url)
    .then((con) => console.log('Database connected with:-', db_url))
    .catch((err) => console.log('DB not connected:', err))
}
