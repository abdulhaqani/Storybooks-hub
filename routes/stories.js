const express = require('express');
const mongoose = require('mongoose');

const Story = mongoose.model('stories');

const { ensureAuthenticated } = require('../helpers/auth');

const router = express.Router();

router.get('/', (req, res) => {
  Story.find({ status: 'public' })
    .populate('user')
    .sort({ date: 'desc' })
    .then(stories => {
      res.render('stories/index', { stories });
    });
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id }).then(story => {
    if (story.user !== req.user.id) {
      res.redirect('/stories');
    } else {
      res.render('stories/edit', { story });
    }
  });
});

router.get('/show/:id', (req, res) => {
  Story.findOne({ _id: req.params.id })
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
      if (story.status === 'public') {
        res.render('stories/show', { story });
      } else if (req.user) {
        if (req.user.id === story.user._id) {
          res.render('stories/show', {
            story,
          });
        } else {
          res.redirect('/stories');
        }
      } else {
        res.redirect('/stories');
      }
    });
});

// List stories from a user
router.get('/user/:userId', ensureAuthenticated, (req, res) => {
  Story.find({ user: req.params.userId, status: 'public' })
    .populate('user')
    .then(stories => {
      res.render('stories/index', { stories });
    });
});

// Logged in User stories
// List stories from a user
router.get('/my', ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .populate('user')
    .then(stories => {
      res.render('stories/index', { stories });
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

// Add comment
router.post('/comment/:id', (req, res) => {
  Story.findOne({ _id: req.params.id }).then(story => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id,
    };

    // add to comments array
    story.comments.unshift(newComment);

    story.save().then(() => {
      res.redirect(`/stories/show/${story.id}`);
    });
  });
});
module.exports = router;
