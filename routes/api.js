const path = require('path');
const express = require('express');
const rootDir = require('../util/path');

const router = express.Router();

router.get('/users', (req, res, next) => {
    console.log('Users Page');
    res.send('<h1>The Users Pages</h1>');
});

router.get('/playlists', (req, res, next) => {
    console.log('Playlists Page');
    res.send('<h1>Playlists Pages</h1>');
}); 

exports.routes = router;