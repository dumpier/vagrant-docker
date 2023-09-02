# Vagrant+Docker開発環境構築
## コンテナ一覧
- `nginx`
- `php`
- `nodejs`
- `mysql`
- `mongo`
- `redis`
- `mailhog`

<details><summary>なんかあったら</summary>

- synced_folderの設定をnfsにした時にtimeoutしてしまう
    - VPNを切断して再度試す
    - もしくは、以下のコマンドで試す
        `$ sudo ifconfig vboxnet0 down`
        `$ sudo ifconfig vboxnet0 up`
- ディレクトリ移動後に vagrant up すると NFS が動かない
    - 確認
      `$ nfsd checkexports`

    - キャッシュを確認し削除する
      `$ sudo vi /etc/exports`
</details>
<details><summary>インストールが必要なもの</summary>

- Vagrantを使う場合
    - `VirtualBox 7.x`
    - `Vagrant 2.0以上`
    - `Git 2.x`
- 直接Dockerを使う場合
    - `docker 19.x以上`
    - `docker-compose 1.25.5以上`
</details>


<details><summary>フォルダ構成</summary>

- `Vagrantfile` Vagrant基本設定（IP、共有フォルダ等）
- `scripts/builder.rb` Vagrantのビルドスクリプト
- `docker/`
  - `code`
    - `nodejs`
    - `php`
  - `containers`
    - `mongo`
    - `mysql/`
    - `nginx/`
    - `php`
</details>

## 環境立上げ手順
### Host定義 `/etc/hosts`
- 192.168.56.101 web.local.mysite.test
- 192.168.56.101 api.local.mysite.test
- 192.168.56.101 nodejs.test
- 192.168.56.101 mail.local.test

### 環境の立ち上げ
```
# 本ブランチをcloneする
$ mkdir -p ~/works/develop/env/vagrant-docker
$ cd ~/works/develop/env/vagrant-docker
$ git clone git@github.com:dumpier/vagrant-docker.git ./


# Vagrant+Dockerの初期化と立ち上げ
$ vagrant up --provision
# 初回以降の立ち上げ
$ vagrant up


# vagrantにログイン(Dockerのホストマシーン)
$ vagrant ssh
# dockerフォルダに移動し、起動中のコンテナ一覧を確認する
$ cd /vagrant/docker
$ docker ps
# PHPコンテナに入る
$ docker exec -it php bash
# PHPコマンドを実行してみる
$ php -r "echo date('Y-m-d H:is');"
```

### 動作確認URL
- URL一覧
  - [web](http://web.local.mysite.test)
  - [api](http://api.local.mysite.test)
  - [nginx](http://nginx.test)
  - [メールサーバー](http://mailhog.local.test)

