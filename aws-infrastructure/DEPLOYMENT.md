# 🚀 CloudFormation デプロイガイド

このガイドでは、作成したCloudFormationテンプレートを実際のAWSアカウントにデプロイする手順を説明します。

## 📋 事前準備

### 1. AWSアカウントとIAMユーザー設定

```bash
# IAMユーザーの作成（AWSコンソールまたはCLI）
# 必要な権限:
# - CloudFormationFullAccess
# - EC2FullAccess
# - VPCFullAccess
# - IAMReadOnlyAccess（デプロイスクリプト用）
```

### 2. AWS CLI設定

```bash
# AWS CLI インストール（まだの場合）
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# AWS認証情報設定
aws configure
# AWS Access Key ID: [IAMユーザーのアクセスキー]
# AWS Secret Access Key: [IAMユーザーのシークレットキー]
# Default region name: us-east-1  # 使用するリージョン
# Default output format: json
```

### 3. SSH Key Pair作成

```bash
# SSH Key Pairを作成（EC2接続用）
aws ec2 create-key-pair \
  --key-name portfolio-keypair \
  --query 'KeyMaterial' \
  --output text > portfolio-keypair.pem

# 適切な権限設定
chmod 400 portfolio-keypair.pem

# ⚠️ 重要: .pemファイルは安全な場所に保管してください
```

## 🏗️ デプロイ手順

### 方法1: 自動デプロイスクリプト使用（推奨）

```bash
# プロジェクトディレクトリに移動
cd aws-infrastructure

# デプロイスクリプト実行
./scripts/deploy.sh portfolio-keypair

# 実行内容:
# 1. VPCスタック作成
# 2. EC2スタック作成
# 3. デプロイ結果表示
# 4. 動作確認用コマンド提示
```

### 方法2: 手動デプロイ

#### Step 1: VPCスタックのデプロイ

```bash
# VPCとネットワーク基盤を作成
aws cloudformation create-stack \
  --stack-name portfolio-prod-network \
  --template-body file://templates/01-vpc-network.yaml \
  --parameters ParameterKey=ProjectName,ParameterValue=portfolio \
               ParameterKey=Environment,ParameterValue=prod

# 作成完了まで待機
aws cloudformation wait stack-create-complete \
  --stack-name portfolio-prod-network

# ステータス確認
aws cloudformation describe-stacks \
  --stack-name portfolio-prod-network \
  --query 'Stacks[0].StackStatus'
```

#### Step 2: EC2スタックのデプロイ

```bash
# EC2 Webサーバーを作成
aws cloudformation create-stack \
  --stack-name portfolio-prod-ec2 \
  --template-body file://templates/02-ec2-instance.yaml \
  --parameters ParameterKey=ProjectName,ParameterValue=portfolio \
               ParameterKey=Environment,ParameterValue=prod \
               ParameterKey=NetworkStackName,ParameterValue=portfolio-prod-network \
               ParameterKey=KeyPairName,ParameterValue=portfolio-keypair

# 作成完了まで待機
aws cloudformation wait stack-create-complete \
  --stack-name portfolio-prod-ec2
```

#### Step 3: デプロイ結果確認

```bash
# EC2インスタンス情報取得
aws cloudformation describe-stacks \
  --stack-name portfolio-prod-ec2 \
  --query 'Stacks[0].Outputs'

# パブリックIP取得
PUBLIC_IP=$(aws cloudformation describe-stacks \
  --stack-name portfolio-prod-ec2 \
  --query 'Stacks[0].Outputs[?OutputKey==`PublicIP`].OutputValue' \
  --output text)

echo "WebサイトURL: http://$PUBLIC_IP"
```

## 🔍 動作確認

### 1. Webサーバーの動作確認

```bash
# HTTP接続テスト
curl -I http://[パブリックIP]

# 期待する結果:
# HTTP/1.1 200 OK
# Server: nginx/1.x.x
```

### 2. SSH接続確認

```bash
# EC2インスタンスに接続
ssh -i portfolio-keypair.pem ec2-user@[パブリックIP]

# 接続後に確認するサービス
sudo systemctl status nginx    # Nginx状態
sudo systemctl status php-fpm  # PHP-FPM状態
tail -f /var/log/user-data.log  # 初期化ログ
```

### 3. Webページアクセス

ブラウザで以下のURLにアクセス:

- `http://[パブリックIP]` - メインページ
- `http://[パブリックIP]/info.php` - PHP情報ページ

期待する表示:
```
🚀 Portfolio Server
✅ Server is Running!
FuelPHP + React development environment is ready.
```

## 🛠️ トラブルシューティング

### よくあるエラーと対処法

#### 1. Key Pairが見つからない

```bash
# エラー: The key pair 'portfolio-keypair' does not exist
# 対処: Key Pairを作成
aws ec2 create-key-pair --key-name portfolio-keypair --query 'KeyMaterial' --output text > portfolio-keypair.pem
chmod 400 portfolio-keypair.pem
```

#### 2. スタック作成失敗

```bash
# エラー確認
aws cloudformation describe-stack-events \
  --stack-name [スタック名] \
  --query 'StackEvents[?ResourceStatus==`CREATE_FAILED`]'

# よくある原因:
# - IAM権限不足
# - リージョンでの利用制限
# - 無料枠の上限到達
```

#### 3. EC2に接続できない

```bash
# セキュリティグループ確認
aws ec2 describe-security-groups \
  --group-names portfolio-prod-ec2-sg \
  --query 'SecurityGroups[0].IpPermissions'

# SSH接続許可の確認（ポート22）
# HTTP接続許可の確認（ポート80）
```

#### 4. UserDataスクリプトの実行確認

```bash
# SSH接続後、初期化ログを確認
ssh -i portfolio-keypair.pem ec2-user@[パブリックIP]
tail -f /var/log/user-data.log

# 各サービスの状態確認
sudo systemctl status nginx
sudo systemctl status php-fpm
```

## 💰 費用確認

```bash
# 現在のリソース使用状況確認
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics "AmortizedCost" \
  --group-by Type=DIMENSION,Key=SERVICE

# 無料枠使用状況確認（AWSコンソール）
# https://console.aws.amazon.com/billing/home#/freetier
```

## 🗑️ リソース削除（重要）

テスト完了後は必ずリソースを削除して課金を避けてください：

```bash
# EC2スタック削除
aws cloudformation delete-stack --stack-name portfolio-prod-ec2
aws cloudformation wait stack-delete-complete --stack-name portfolio-prod-ec2

# VPCスタック削除
aws cloudformation delete-stack --stack-name portfolio-prod-network
aws cloudformation wait stack-delete-complete --stack-name portfolio-prod-network

# Key Pair削除
aws ec2 delete-key-pair --key-name portfolio-keypair
rm portfolio-keypair.pem

# 削除確認
aws cloudformation list-stacks \
  --stack-status-filter DELETE_COMPLETE \
  --query 'StackSummaries[?StackName==`portfolio-prod-ec2` || StackName==`portfolio-prod-network`]'
```

## 📞 サポート

デプロイで問題が発生した場合:

1. **CloudFormationコンソール**でスタック状態を確認
2. **CloudWatchログ**でEC2の初期化ログを確認
3. **AWS Support**（Basic/Developer/Business プラン）

## 🎯 次のステップ

デプロイ成功後:

1. **RDSデータベーススタック**の作成
2. **アプリケーションファイル**のアップロード
3. **ドメイン設定とSSL証明書**（オプション）
4. **モニタリングとログ設定**

---

**⚠️ 注意事項:**
- このガイドは学習目的です
- 本番環境では追加のセキュリティ設定が必要
- AWS無料枠の制限を定期的に確認してください
- 使用しないリソースは削除して課金を避けてください