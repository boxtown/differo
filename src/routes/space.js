const express = require('express');
const { body } = require('express-validator/check');

const async = require('../middleware/async');
const validate = require('../middleware/validate');
const requiresAuth = require('../middleware/requiresAuth');
const { Space } = require('../database/models');

const getCreateSpace = (req, res) =>
  res.render('space/createSpace', { title: 'Create a new space' });

const postCreateSpace = async (req, res) => {
  const space = await Space.findOne({ where: { name: req.body.name } });
  if (space) {
    req.flash('error', 'Space with name already exists');
    res.redirect('/create-space');
    return;
  }
  await Space.create(req.body);
  res.redirect('/');
};

const router = express.Router();

router.get('/create-space', requiresAuth, getCreateSpace);

router.post(
  '/create-space',
  [
    requiresAuth,
    body('name')
      .isLength({ max: 255 })
      .withMessage('Name is invalid'),
    validate,
  ],
  async(postCreateSpace),
);

module.exports = router;
