# Firebase API Test

* jQuery での ajax メソッド使用 [https://jsfiddle.net/nekonenene/pbszvtk3/](https://jsfiddle.net/nekonenene/pbszvtk3/)
* PureJS での fetch メソッド使用 [https://jsfiddle.net/nekonenene/cpq965j4/](https://jsfiddle.net/nekonenene/cpq965j4/)

の[書き方の違いを説明する](https://nekonenene.hatenablog.com/entry/2020/03/22/015852)ために用意した、Cloud Functions 用のファイル群。

デプロイは

```sh
firebase deploy --only functions
```

でおこなう。（参考: https://firebase.google.com/docs/hosting/deploying ）
