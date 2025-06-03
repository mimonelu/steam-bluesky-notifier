# steam-bluesky-notifier

## 概要
Steamユーザーの状態をSteam Web APIを通じて定期的にチェックし、GitHub Actions上で「フレンドリストにログインしており、かつゲームもしている」状態を検出した場合にBlueskyにその旨をポストする。略して「Steamでゲーム始めたらBlueskyでチクるやつ」。  
Steam Web APIは `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/` のみ使用。  
Bluesky/ATProtocolのAPIは `com.atproto.server.createSession` と `com.atproto.repo.createRecord` のみ使用。

## 使い方
前提としてSteamアカウントとBlueskyアカウントが必要。ないやつは帰れ。  
またSteamではフレンドリストにログインしておくこと（「オンライン」か「退席中」のみ可。「居留守」は不可）。Steam Web APIではゲームをプレイしているかどうかはフレンドリスト経由でしか判定できないため、とチャッピーが言ってました。知らんけど

### 1. Steam IDとSteam Web APIキーを取得する

#### Steam ID （Steam64ID）の取得
Steam64IDはSteamのユーザー固有の64ビットIDで、API利用時に必要。  
以下は非公式な方法で、公式な方法は面倒なので割愛。

1. https://www.steamidfinder.com/lookup/YOUE_USER_NAME/
2. `7656119799xxxxxxx` の数字がID

#### Steam Web APIキーの取得
SteamのAPIを利用するにはAPIキーが必要。  
APIキーは個人アカウントに紐づいており、他人に漏れないように管理すること。

1. [Steam APIキー登録ページ](https://steamcommunity.com/dev/apikey) にアクセス
2. Steamアカウントでログインする
3. 「Domain Name」欄に任意のドメイン名を入力（GitHub Pagesであれば `mimonelu.github.io` ）
4. 「Register」ボタンをクリックするとAPIキーが発行される
5. 発行されたキーをコピーしてメモする（APIリクエストに利用）

### 2. GitHub Secrets （Repository secrets）に各種値を設定する
* `STEAM_ID` YOUR_STEAM_ID
* `STEAM_API_KEY` YOUR_STEAM_API_KEY
* `ATP_HOST` https://bsky.social
* `ATP_IDENTIFIER` YOUR_BLUESKY_HANDLE_OR_EMAIL
* `ATP_PASSWORD` YOUR_BLUESKY_APP_PASSWORD

### 3. Steamにログインする
同時にフレンドリストにもログインすると思われる。されない場合は手動で。

### 4. ゲームをする
この時点から最長15分（デフォルト）の間にポストが送信される。  
ただしGitHub Actionsのcronは相当の「揺らぎ」がある点に注意。
