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

const getSpaceNew = (req, res) => res.render('space/createSpace', { title: 'Create a new space' });

const postSpace = async (req, res) => {
  const spaceSlug = slug(req.body.name);
  const space = await Space.findOne({ where: { slug: spaceSlug } });
  if (space) {
    req.flash('error', 'Space with name already exists');
    res.redirect('/space/new');
    return;
  }
  await Space.create({ ...req.body, slug: spaceSlug });
  res.redirect('/');
};

const router = express.Router();

router.get('/new', requiresAuth, getSpaceNew);
router.get('/:slug', getSpace);

router.post(
  '/',
  [
    requiresAuth,
    body('name')
      .isLength({ max: 255 })
      .isAscii()
      .withMessage('Name is invalid'),
    validate({ redirectPath: '/space/new' }),
  ],
  async(postSpace),
);

module.exports = router;
