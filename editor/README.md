# SH1107 MakeCode Dot Editor

micro:bit + Grove Shield + Grove SH1107 OLED向けのドット絵エディタです。

## 最初に拡張機能を追加する

MakeCodeで新しいプロジェクトを開き、`拡張機能` の検索欄へ次のURLを貼り付けて、`OLED-Display-Fast` を追加します。

```text
https://github.com/kanejun06/pxt-OledDisplay-fast#v0.0.20
```

この拡張機能を追加してから、エディタが生成したJavaScriptをMakeCodeへ貼り付けます。

## 主な機能

- 16x16の1枚画像
- 最大8コマのアニメーション
- 4つのアニメーションバンク
- バンクごとの開始・終了フレーム、再生間隔
- MakeCode JavaScriptの生成
- PNGの読み込みと保存
- アンドゥ、リドゥ

## 授業での使い方

1. `1枚画像` または `アニメーション` を選ぶ
2. 16x16のキャンバスに絵を描く
3. アニメーションではバンク、フレーム範囲、再生間隔を設定する
4. `コードをコピー` を押す
5. MakeCodeのJavaScript画面へ貼り付ける

`C` キーでもコードをコピーできます。`Cmd+Z` / `Ctrl+Z` でアンドゥ、`Cmd+Shift+Z` / `Ctrl+Y` でリドゥできます。

## 4バンク出力

アニメーション出力では、4バンクすべての画像と設定を1つのMakeCodeプログラムへ出力します。

```typescript
playBank1()
playBank2()
playBank3()
playBank4()
```

生成コードには上記の再生関数が含まれます。初期状態では `ずっと` の中でボタンの状態を確認します。

- Aボタン: バンク1を再生
- Bボタン: バンク2を再生
- どちらも押していない: OLEDを消去

バンク切替直後は開始フレームを全面表示し、その後は変化した部分だけを描き直します。

ライブラリの基本ブロックは次の3つです。

```typescript
oled.setBankAnimationFrame(bank, frame, bitmap16)
oled.showBankAnimationFrame(bank, frame)
oled.playBankAnimation(bank, startFrame, endFrame)
```

OLED全画面へ表示するため、columnは常に0としてライブラリ内部で処理します。

## MakeCode拡張機能

MakeCodeの拡張機能には次のURLを指定します。

```text
https://github.com/kanejun06/pxt-OledDisplay-fast#v0.0.20
```

大きなbitmap配列はブロック表示で縦長になるため、画像データはJavaScript側で管理する運用を推奨します。
