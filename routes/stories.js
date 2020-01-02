const express = require('express');
const mongoose = require('mongoose');

const Story = mongoose.model('stories');
const User = mongoose.model('users');

const { ensureAuthenticated } = require('../helpers/auth');

const router = express.Router();

router.get('/', (req, res) => {
  Story.find({ status: 'public' })
    .populate('user')
    .then(stories => {
      res.render('stories/index', { stories });
    });
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id }).then(story => {
    res.render('stories/edit', { story });
  });
});

router.get('/edit', ensureAuthenticated, (req, res) => {
  res.render('stories/edit');
});

router.get('/show/:id', (req, res) => {
  Story.findOne({ _id: req.params.id })
    .populate('user')
    .then(story => {
      res.render('stories/show', { story });
    });
});

// post requests
// add form
router.post('/', (req, res) => {
  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: !!req.body.allowComments, // !! means true if not null false otherwise
    user: req.user.id,
  };

  // create story
  new Story(newStory).save().then(story => {
    res.redirect(`/stories/show/${story.id}`);
  });
});

// Edit form process
router.put('/:id', (req, res) => {
  Story.findOne({ _id: req.params.id }).then(story => {
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = !!req.body.allowComments; // !! means true if not null false otherwise
    story.save().then(() => {
      res.redirect('/dashboard');
    });
  });
});

// Delete story
router.delete('/:id', (req, res) => {
  Story.deleteOne({ _id: req.params.id }).then(() => {
    res.redirect('/dashboard');
  });
});

module.exports = router;
