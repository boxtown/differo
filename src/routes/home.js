const express = require('express');

const { Space } = require('../database/models');

const getIndex = async (req, res) => {
  const spaces = await Space.findAll();
  res.render('home', { title: 'Home', spaces });
};

const router = express.Router();

router.get('/', getIndex);

module.exports = router;
