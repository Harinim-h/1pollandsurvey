const express = require('express');
   const Poll = require('../models/Poll');
   const router = express.Router();

   // Create a new poll
   router.post('/polls', async (req, res) => {
       try {
           const { title, options, createdBy } = req.body;
           const poll = new Poll({ title, options, responses: new Array(options.length).fill(0), createdBy });
           await poll.save();
           res.status(201).json(poll);
       } catch (err) {
           res.status(500).json({ error: err.message });
       }
   });

   // Get all polls
   router.get('/polls', async (req, res) => {
       try {
           const polls = await Poll.find();
           res.json(polls);
       } catch (err) {
           res.status(500).json({ error: err.message });
       }
   });

   // Respond to a poll
   router.post('/polls/:id/respond', async (req, res) => {
       try {
           const { id } = req.params;
           const { optionIndex } = req.body;
           const poll = await Poll.findById(id);

           if (!poll) return res.status(404).json({ error: 'Poll not found' });
           poll.responses[optionIndex] += 1;
           await poll.save();

           res.json(poll);
       } catch (err) {
           res.status(500).json({ error: err.message });
       }
   });
   router.delete('/:id', (req, res) => {
    const pollId = req.params.id;
    res.status(200).json({ message });
   });

   // Get poll results
   router.get('/polls/:id', async (req, res) => {
       try {
           const { id } = req.params;
           const poll = await Poll.findById(id);
           if (!poll) return res.status(404).json({ error: 'Poll not found' });
           res.json(poll);
       } catch (err) {
           res.status(500).json({ error: err.message });
       }
   });

   module.exports = router;
