const Routing = {
  instance(){ return Object.create(this); },

  // TODO 動的ルーティングにする
  dispatch(){
    const router = express.Router();

    // publicフォルダの静的リソース
    app.use(express.static('public'));
    app.use("/", router.get('/', (req, res, next)=>{ res.sendFile(dir.views("index.html"));}));
    app.use("/test", require(dir.routes(`test`)));
    app.use("/chat", require(dir.routes(`chat`)));
  },
}

module.exports = Routing;