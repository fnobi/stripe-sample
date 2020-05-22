# stripe-sample

## stripeとは

- 課金処理をつくるためのAPI
- 課金、とひとくちに言っても考えなきゃいけないことはめちゃめちゃたくさんあるが、クレジットカードの管理・銀行口座の管理・顧客管理・商品管理といったあたりをまるっと担当してくれてすごい
- かつdeveloper friendly 使い方は非常にモダン

## アカウント作成

- https://stripe.com/jp
- アカウントは複数作れる
    - 若干ややこしいけど、アカウント＝他のAPIで言うところのアプリと思って良さそう
- アカウントには他のユーザーを招待することも可能

## 使用料

- Stripe手数料 → 3.6%
    - https://stripe.com/jp/pricing
- 決済のたびに手数料で取ってくるかたちなので、使用そのものでは課金されない
- 実際案件で使う場合、一度stripeのアカウントに溜まった残高をどこかしらの口座に引き落とすっていう流れが必要なのでこのへんは相談

## test modeとlive mode

- アカウントは、test mode / live modeの２つの状態を持つ。それぞれに別のAPI Keyが発行されるので共存可能。管理画面は常にどちらかの表示になっているので注意。

- test modeのAPIキーが入ったアプリケーションでは、クレジットカードや銀行口座など実際の課金にまつわる情報はStripe側で用意されている **テスト用のものしか入力できない** （本物の番号を入れるとエラーになる）
    - [テスト用クレジットカード](https://stripe.com/docs/testing#cards)
    - [テスト用銀行口座](https://stripe.com/docs/connect/testing#account-numbers)
    - 決済しても必ずエラーになるカードなど、特殊なケースを引き起こすカードも用意されているので、異常系のテストもできるようになっている
    - どうでもいいけどいくらでも課金できるので富豪になった気分になれる
- live modeを有効にするには、事業の情報などなど細かいことをいろいろ入力して「本番環境申請」が必要。申請とは言いつつちゃんと入力すればすぐ終わるやつ。

## Publishable KeyとSeacret Key

- フロントのSDKに組み込んだりする用のPublishable Key（公開可能キー）と、サーバー側で使うセンシティブなSeacret Key（シークレットキー）がある
    - test mode / live modeそれぞれに用意されるので、ミニマムで4つのAPIキーがあることになる。混同しないように注意。
- キーに限らず、Stripeは扱う上でどこまでが公開可能情報でどこまでが機密情報かにセンシティブになる必要がある。しくじると、他人のクレジットカードで決済ができるとかいうことになりかねない。

## ドキュメント

- [stripe api](https://stripe.com/docs/api)
    - stripe利用のうち主になるもの
    - node.jsのSDKしかつかったことない

- [stripe.js](https://stripe.com/docs/js)
    - Webフロント用のSDK
    - フロントからアクセスできるAPI系のラッパー及び、カード情報などつくるのが面倒な画面のUIライブラリも内包されている
    - React用の定義済みコンポーネントもある。hooks完全対応。ラブ。

## デモ

### card-form

- https://fnobi-stripe-sample.netlify.app/card-form/
    - コード：https://github.com/fnobi/stripe-sample/blob/develop/pages/card-form.tsx
    - test modeで動かしてるので実際のカード情報は入れられません

- カード情報を入力して、card token (stripe上で一意な、カード情報を表す文字列)をつくる
    - このcard tokenをサーバーに渡して、サーバー上でstripe apiを使って決済を行う、などができる
    - card tokenから完全なカード情報をひっぱることは絶対にできない（下４桁までしかわからない）
- 具体的に何も起きないのであんまり感動がないが、特筆すべきは
    - カード情報をいれるときのUIが素敵な感じに提供されている
    - 入力フォームはよくみるとiframeとして提供されている。つまり自分たちが書いたコードは直接的には一切カード情報に触れていない

### redirect-to-checkout

- https://fnobi-stripe-sample.netlify.app/redirect-to-checkout/
    - コード：https://github.com/fnobi/stripe-sample/blob/develop/pages/redirect-to-checkout.tsx
    - test modeで動かしてるので実際のカード情報は入れられません

- 管理画面上でproductを作成して、そのid・名前・単価を控えておくことで、フロントエンドオンリーで課金処理を実現
    - 実際の課金情報の入力はStripeの画面に遷移して行うので、上のデモと同様課金にまつわる情報には直接は触らないでOK
    - client-only checkoutというオプションをONにする必要があるので注意
        - https://dashboard.stripe.com/settings/checkout

- フロントエンドオンリーは楽だが、動的な処理は組み込めないので、商品が増えたらどうするとか在庫が切れたらどうするとか対応力には難あり。商品数は決め込みでOKで、在庫が存在しないバーチャルな商品とかであれば全く問題なさそう。