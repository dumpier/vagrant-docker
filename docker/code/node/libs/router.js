const Router = {
    instance(){ return Object.create(Router); },
    dispatch(express, app, dir){
        // TODO 動的ルーティングにする
        // publicフォルダの静的リソース
        app.use(express.static('public'));
        app.use("/", require(dir.routes(`index`)));
        app.use("/chat", require(dir.routes(`chat`)));
    },
}

module.exports = Router;