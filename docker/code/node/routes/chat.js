const path = require('path');
const crypto = require('crypto');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../views/chat.html'));
});

module.exports = router;
