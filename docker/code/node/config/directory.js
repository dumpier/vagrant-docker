// ディレクトリ定義
module.exports = {
  rootdir:null,
  instance(root){ this.rootdir = root; return this; },
  root(sub){ sub=sub??""; return `${this.rootdir}/${sub}`; },
  public(sub){ sub=sub??""; return this.root(`public/${sub}`); },
  libs(sub){ sub=sub??""; return this.root(`libs/${sub}`); },
  views(sub){ sub=sub??""; return this.root(`views/${sub}`); },
  routes(sub){ sub=sub??""; return this.root(`routes/${sub}`); },
};
