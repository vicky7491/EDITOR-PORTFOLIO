const express = require('express');
const router = express.Router();
const { getSitemap } = require('../controllers/sitemap.controller');

router.get('/', getSitemap);

module.exports = router;