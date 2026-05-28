# SH1107 MakeCode Dot Editor

micro:bit + Grove Shield + Grove SH1107 OLED 向けの授業用ドット絵エディタです。

`index.html` をブラウザで開くと使えます。描いた16x16ドット絵から、MakeCode JavaScript に貼り付けるコードを生成します。

## 使い方

1. `index.html` をブラウザで開く
2. `1枚画像` または `アニメーション` を選ぶ
3. ドットをクリック/ドラッグして描く
4. `コードをコピー` または `c` キーでMakeCode用コードをコピー
5. MakeCode JavaScriptに貼り付ける

## MakeCode拡張

生成コードは下記の拡張機能を想定しています。

```text
https://github.com/kanejun06/pxt-OledDisplay-fast#v0.0.17
```

## 主な仕様

- 初期設定は `16x16`、`OLEDいっぱい`、`bitmap`、`高速fork`
- 1枚画像は `showImage16()` を使って表示
- アニメーションは `setAnimation16Frame()` と `showRegisteredAnimation16()` を使って表示
- アニメーション速度は `間隔(ms)` と MakeCode の `basic.pause()` で制御
- ドット描画は、最初に触ったマスに応じてドラッグ中の描画/消去モードを固定
- `Cmd+Z` / `Ctrl+Z` でアンドゥ、`Cmd+Shift+Z` / `Ctrl+Y` でリドゥ
- アニメーションモードでフレームが1枚だけのとき、`削除` は画面クリアとして動作

## 注意

MakeCodeで古い拡張が残っていると、`setAnimation16Frame` や `showRegisteredAnimation16` が存在しないというエラーになります。その場合は `OLED-Display-Fast` を削除してから、上記URLで入れ直してください。
