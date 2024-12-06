const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Poll schema and model
const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  }
});

const Poll = mongoose.model('Poll', pollSchema);

// Example POST route for creating a poll
app.post('/api/polls', (req, res) => {
  const { title, options } = req.body;

  // Validate incoming request
  if (!title || !options) {
    return res.status(400).json({ error: 'Title and options are required' });
  }

  // Create a new poll and save it to the database
  const newPoll = new Poll({
    title,
    options
  });

  newPoll.save()
    .then(poll => res.status(201).json(poll))
    .catch(err => res.status(500).json({ error: 'Failed to create poll', details: err }));
});

// Example GET route to fetch all polls
app.get('/api/polls', (req, res) => {
  Poll.find()
    .then(polls => res.status(200).json(polls))
    .catch(err => res.status(500).json({ error: 'Failed to retrieve polls', details: err }));
});

// Example GET route to fetch a specific poll by ID
app.get('/api/polls/:id', (req, res) => {
  const { id } = req.params;

  Poll.findById(id)
    .then(poll => {
      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }
      res.status(200).json(poll);
    })
    .catch(err => res.status(500).json({ error: 'Failed to retrieve poll', details: err }));
});

// Example PUT route to update a poll
app.put('/api/polls/:id', (req, res) => {
  const { id } = req.params;
  const { title, options } = req.body;

  if (!title || !options) {
    return res.status(400).json({ error: 'Title and options are required' });
  }

  Poll.findByIdAndUpdate(id, { title, options }, { new: true })
    .then(updatedPoll => {
      if (!updatedPoll) {
        return res.status(404).json({ error: 'Poll not found' });
      }
      res.status(200).json(updatedPoll);
    })
    .catch(err => res.status(500).json({ error: 'Failed to update poll', details: err }));
});

// Example DELETE route to delete a poll
app.delete('/api/polls/:id', (req, res) => {
  const { id } = req.params;

  Poll.findByIdAndDelete(id)
    .then(deletedPoll => {
      if (!deletedPoll) {
        return res.status(404).json({ error: 'Poll not found' });
      }
      res.status(200).json({ message: 'Poll deleted successfully' });
    })
    .catch(err => res.status(500).json({ error: 'Failed to delete poll', details: err }));
});

// Server setup
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(Server running on port ${port});
});