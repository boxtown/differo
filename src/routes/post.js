const express = require('express');

const async = require('../middleware/async');
const requiresAuth = require('../middleware/requiresAuth');
const { Space } = require('../database/models');

const getPostNew = async (req, res) => {
  const space = await Space.findOne({ where: { slug: req.params.slug } });
  if (!space) {
    res.status(404).send('Not Found');
    return;
  }
  res.render('post/createPost', { title: 'Create a new post' });
};

const router = express.Router();

router.get('/space/:slug/post/new', requiresAuth, async(getPostNew));

module.exports = router;
