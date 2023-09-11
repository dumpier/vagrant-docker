const Router = {
  instance(){ return Object.create(Router); },

  // TODO 動的ルーティングにする
  dispatch(express, app, dir){
    // publicフォルダの静的リソース
    app.use(express.static('public'));
    app.use("/", require(dir.routes(`index`)));
    app.use("/chat", require(dir.routes(`chat`)));
  },
}

module.exports = Router;