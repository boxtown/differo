const express = require('express');
const { body } = require('express-validator/check');
const slug = require('slug');

const async = require('../middleware/async');
const validate = require('../middleware/validate');
const requiresAuth = require('../middleware/requiresAuth');
const { Space } = require('../database/models');

const getSpace = async (req, res) => {
  const space = await Space.findOne({ where: { slug: req.params.slug } });
  if (!space) {
    res.status(404).send('Not Found');
    return;
  }
  res.render('space/index', { title: space.name, space });
};

const getCreateSpace = (req, res) =>
  res.render('space/createSpace', { title: 'Create a new space' });

const postCreateSpace = async (req, res) => {
  const spaceSlug = slug(req.body.name);
  const space = await Space.findOne({ where: { slug: spaceSlug } });
  if (space) {
    req.flash('error', 'Space with name already exists');
    res.redirect('/create-space');
    return;
  }
  await Space.create({ ...req.body, slug: spaceSlug });
  res.redirect('/');
};

const router = express.Router();

router.get('/space/:slug', getSpace);
router.get('/create-space', requiresAuth, getCreateSpace);

router.post(
  '/create-space',
  [
    requiresAuth,
    body('name')
      .isLength({ max: 255 })
      .isAscii()
      .withMessage('Name is invalid'),
    validate,
  ],
  async(postCreateSpace),
);

module.exports = router;
