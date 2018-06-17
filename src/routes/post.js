const express = require('express');

const async = require('../middleware/async');
const requiresAuth = require('../middleware/requiresAuth');
const { Post, Space } = require('../database/models');

const getPostNew = async (req, res) => {
  const space = await Space.findOne({ where: { slug: req.params.slug } });
  if (!space) {
    res.status(404).send('Not Found');
    return;
  }
  res.render('post/createPost', { title: 'Create a new post', space });
};

const postPost = async (req, res) => {
  const space = await Space.findOne({ where: { slug: req.params.slug } });
  if (!space) {
    res.status(400).send('Bad Request');
    return;
  }
  await Post.create({ ...req.body, spaceId: space.id, authorId: req.user.id });
  res.redirect(`/space/${space.slug}`);
};

const router = express.Router();

router.get('/space/:slug/post/new', requiresAuth, async(getPostNew));

router.post('/space/:slug/post', [requiresAuth], postPost);

module.exports = router;
