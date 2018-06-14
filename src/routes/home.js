const express = require('express');

const async = require('../middleware/async');
const { User, Space } = require('../database/models');

const getIndex = async (req, res) => {
  const spaces = await Space.findAll({ include: [{ model: User, as: 'creator' }] });
  res.render('home', { title: 'Home', spaces });
};

const router = express.Router();

router.get('/', async(getIndex));

module.exports = router;
