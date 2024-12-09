const express = require('express');
   const mongoose = require('mongoose');
   const bodyParser = require('body-parser');
   const cors = require('cors');
   const dotenv = require('dotenv');
require('dotenv').config();
   dotenv.config();

   const app = express();
   const pollRoutes = require('./routes/pollRoutes');
   app.use('/api', pollRoutes);
app.use(express.json());
   app.use(bodyParser.json());
   app.use(cors());

   mongoose.connect(process.env.MONGO_URI, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
   }).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

   app.listen(5000, () => console.log('Server running on port 5000'));
