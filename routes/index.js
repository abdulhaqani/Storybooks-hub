const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Working 1');
});

module.exports = router;