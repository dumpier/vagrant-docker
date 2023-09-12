const router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile(dir.views("chat.html"));
});

module.exports = router;
