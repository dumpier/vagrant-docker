const router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile(dir.views("index.html"));
});

module.exports = router;