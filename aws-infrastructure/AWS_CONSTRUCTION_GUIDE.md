# 🏗️ AWS Infrastructure 構築完全ガイド

## 📖 概要

このガイドは、FuelPHP + React アプリケーション用のAWSインフラストラクチャを段階的に構築した実際の手順をドキュメント化したものです。

### 🎯 構築内容
- **VPC & ネットワーク**: プライベートクラウド環境
- **EC2 インスタンス**: WebサーバーとアプリケーションサーバーとしてNginx + PHP-FPM構成
- **RDS MySQL**: データベースサーバー
- **CloudWatch監視**: サーバー監視とアラート機能
- **SSL証明書**: Let's Encrypt使用の無料HTTPS化
- **独自ドメイン**: suzutuki-portfolio.com

### 💰 費用効率性
- ALB使用を避けて月額約$18の節約
- Let's Encrypt使用で証明書費用0円
- t3.microインスタンス使用で基本料金を最小化

---

## 🚀 Phase 1: 基礎インフラストラクチャ

### 1.1 VPC & ネットワーク構築

```bash
# VPCスタック作成
aws cloudformation create-stack \
    --stack-name portfolio-prod-network \
    --template-body file://templates/01-vpc-network.yaml \
    --parameters \
        ParameterKey=ProjectName,ParameterValue=portfolio \
        ParameterKey=Environment,ParameterValue=prod \
    --region ap-northeast-1

# 作成完了まで待機
aws cloudformation wait stack-create-complete \
    --stack-name portfolio-prod-network \
    --region ap-northeast-1
```

**構築されるリソース:**
- VPC (10.0.0.0/16)
- パブリックサブネット x2 (マルチAZ対応)
- プライベートサブネット x2
- インターネットゲートウェイ
- ルートテーブル
- セキュリティグループ

### 1.2 EC2 インスタンス作成

```bash
# SSH KeyPair作成
aws ec2 create-key-pair \
    --key-name portfolio-new-keypair \
    --query 'KeyMaterial' \
    --output text > ~/.ssh/portfolio-new-keypair.pem \
    --region ap-northeast-1

# 適切な権限設定
chmod 400 ~/.ssh/portfolio-new-keypair.pem

# EC2スタック作成
aws cloudformation create-stack \
    --stack-name portfolio-dev-ec2 \
    --template-body file://templates/02-ec2-instance-static-ami.yaml \
    --parameters \
        ParameterKey=ProjectName,ParameterValue=portfolio \
        ParameterKey=Environment,ParameterValue=dev \
        ParameterKey=NetworkStackName,ParameterValue=portfolio-prod-network \
        ParameterKey=KeyPairName,ParameterValue=portfolio-new-keypair \
        ParameterKey=InstanceType,ParameterValue=t3.micro \
    --region ap-northeast-1

# 作成完了まで待機
aws cloudformation wait stack-create-complete \
    --stack-name portfolio-dev-ec2 \
    --region ap-northeast-1
```

**EC2 UserData設定内容:**
- Amazon Linux 2 最新パッケージ更新
- Nginx + PHP-FPM インストール・設定
- Git, Node.js インストール
- Let's Encrypt (certbot) セットアップ
- SSL証明書自動取得・設定
- 自動更新cron設定

### 1.3 RDS MySQL データベース作成

```bash
# RDSスタック作成
aws cloudformation create-stack \
    --stack-name portfolio-prod-rds \
    --template-body file://templates/03-rds-mysql.yaml \
    --parameters \
        ParameterKey=ProjectName,ParameterValue=portfolio \
        ParameterKey=Environment,ParameterValue=prod \
        ParameterKey=NetworkStackName,ParameterValue=portfolio-prod-network \
    --region ap-northeast-1

# 作成完了まで待機
aws cloudformation wait stack-create-complete \
    --stack-name portfolio-prod-rds \
    --region ap-northeast-1
```

**RDS設定:**
- エンジン: MySQL 8.0
- インスタンスクラス: db.t3.micro
- ストレージ: 20GB GP2
- マルチAZ: 無効 (コスト削減)
- 自動バックアップ: 7日保持

---

## 🔍 Phase 2: 監視・アラート設定

### 2.1 CloudWatch 監視設定

```bash
# CloudWatch監視スタック作成
aws cloudformation create-stack \
    --stack-name portfolio-prod-monitoring \
    --template-body file://templates/04-monitoring-cloudwatch.yaml \
    --parameters \
        ParameterKey=ProjectName,ParameterValue=portfolio \
        ParameterKey=Environment,ParameterValue=prod \
        ParameterKey=EC2StackName,ParameterValue=portfolio-dev-ec2 \
        ParameterKey=RDSStackName,ParameterValue=portfolio-prod-rds \
        ParameterKey=AlertEmail,ParameterValue=renath31@gmail.com \
    --capabilities CAPABILITY_IAM \
    --region ap-northeast-1
```

**監視項目:**
- EC2 CPU使用率 (>80%)
- EC2 ディスク使用率 (>85%)
- EC2 ステータスチェック
- RDS CPU使用率 (>75%)
- RDS 接続数 (>80%)
- RDS ストレージ使用率 (>85%)

**アラート設定:**
- SNS経由でGmailに通知
- CloudWatchダッシュボード作成

### 2.2 必要なIAM権限追加

**追加が必要な権限:**
```bash
# AWSコンソールから以下を手動で追加:
# - AmazonSNSFullAccess
# - CloudWatchFullAccess
# - AmazonSSMFullAccess
# - AmazonRoute53FullAccess
```

---

## 🌐 Phase 3: ドメイン・SSL設定

### 3.1 独自ドメイン取得・設定

**ドメイン取得 (XSERVER Domain):**
1. suzutuki-portfolio.com ドメイン取得
2. DNS設定:
   ```
   A レコード: @ → [EC2 パブリックIP]
   A レコード: www → [EC2 パブリックIP]
   ```

### 3.2 SSL証明書設定 (Let's Encrypt)

EC2インスタンス上で自動実行される設定:

```bash
# EC2 UserDataで自動実行
# Let's Encrypt SSL証明書取得
certbot --nginx \
    --non-interactive \
    --agree-tos \
    --email renath31@gmail.com \
    --domains suzutuki-portfolio.com,www.suzutuki-portfolio.com \
    --redirect

# 自動更新設定
echo "0 2 * * * /usr/bin/certbot renew --quiet" | crontab -
```

**SSL設定結果:**
- HTTPS自動リダイレクト有効
- SSL証明書3ヶ月自動更新
- セキュリティヘッダー設定済み

---

## 📱 Phase 4: アプリケーションデプロイ

### 4.1 SSH接続・環境確認

```bash
# EC2インスタンスに接続
ssh -i ~/.ssh/portfolio-new-keypair.pem ec2-user@[EC2_IP]

# サービス状態確認
sudo systemctl status nginx
sudo systemctl status php-fpm

# SSL証明書確認
sudo certbot certificates
```

### 4.2 GitHubリポジトリクローン

```bash
# ワーキングディレクトリ作成
sudo mkdir -p /var/www/portfolio
sudo chown ec2-user:ec2-user /var/www/portfolio

# GitHubリポジトリクローン
git clone https://github.com/[username]/fuel-react-tailwind-portfolio.git /var/www/portfolio

# 権限設定
sudo chown -R nginx:nginx /var/www/portfolio
sudo chmod -R 755 /var/www/portfolio
```

### 4.3 Nginx設定

```nginx
# /etc/nginx/conf.d/portfolio.conf
server {
    listen 80;
    server_name suzutuki-portfolio.com www.suzutuki-portfolio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name suzutuki-portfolio.com www.suzutuki-portfolio.com;
    root /var/www/html;
    index index.html index.php;

    # SSL証明書設定
    ssl_certificate /etc/letsencrypt/live/suzutuki-portfolio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/suzutuki-portfolio.com/privkey.pem;

    # セキュリティヘッダー
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options nosniff always;

    # 静的ファイルキャッシュ設定
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # FuelPHP API ルート
    location /api/ {
        try_files $uri /fuel/public/index.php?$query_string;
    }

    # React SPA ルート
    location / {
        try_files $uri $uri/ /index.html;
    }

    # PHP処理
    location ~ \.php$ {
        include /etc/nginx/fastcgi_params;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

### 4.4 アプリケーションファイル配置

```bash
# ビルド済みファイルをコピー
sudo cp /var/www/portfolio/index.html /var/www/html/
sudo cp /var/www/portfolio/bundle.js /var/www/html/
sudo cp /var/www/portfolio/bundle.js.LICENSE.txt /var/www/html/

# FuelPHPファイルをコピー
sudo cp -r /var/www/portfolio/fuel /var/www/html/

# 権限設定
sudo chown -R nginx:nginx /var/www/html
sudo chmod -R 755 /var/www/html

# Nginx再起動
sudo systemctl reload nginx
```

---

## ✅ Phase 5: 動作確認・テスト

### 5.1 サービス稼働確認

```bash
# HTTPS接続テスト
curl -I https://suzutuki-portfolio.com

# 期待する結果:
# HTTP/1.1 200 OK
# Server: nginx/1.20.1
# ssl証明書確認
# セキュリティヘッダー確認

# アプリケーション動作確認
curl -s https://suzutuki-portfolio.com | grep -o '<title>.*</title>'
# 期待する結果: <title>FuelPHP + React + TypeScript + TailwindCSS</title>
```

### 5.2 API動作確認

```bash
# FuelPHP APIテスト
curl -X GET https://suzutuki-portfolio.com/api/orders

# React bundle.js配信確認
curl -I https://suzutuki-portfolio.com/bundle.js
# 期待する結果: Cache-Control: max-age=31536000
```

### 5.3 監視アラート確認

```bash
# CloudWatch アラーム状態確認
aws cloudwatch describe-alarms \
    --region ap-northeast-1 \
    --query 'MetricAlarms[?starts_with(AlarmName, `portfolio-prod`)].{Name:AlarmName,State:StateValue}' \
    --output table

# 期待する結果: EC2関連アラームがOK状態
```

---

## 🛠️ トラブルシューティング

### SSH接続問題

**問題:** WSL環境でのKeyPair権限エラー
```bash
# 解決方法:
cp portfolio-new-keypair.pem ~/.ssh/
chmod 400 ~/.ssh/portfolio-new-keypair.pem
```

### SSL証明書問題

**問題:** ドメイン検証失敗
```bash
# DNS設定確認
nslookup suzutuki-portfolio.com

# Nginx設定確認
sudo nginx -t
sudo systemctl status nginx
```

### Node.js互換性問題

**問題:** Amazon Linux 2でのGLIBC互換性
```bash
# 解決方法: 事前ビルド済みファイル使用
# ローカルでビルド → 本番環境へコピー配置
```

---

## 📊 最終構成情報

### 📈 システム構成
- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: FuelPHP (REST API)
- **Database**: RDS MySQL 8.0
- **Web Server**: Nginx + PHP-FPM
- **OS**: Amazon Linux 2
- **SSL**: Let's Encrypt (自動更新)
- **Monitoring**: CloudWatch + SNS

### 💰 月額コスト概算
- EC2 t3.micro: 約$8.50/月
- RDS t3.micro: 約$16/月
- EBS Storage: 約$2/月
- 合計: 約$26.50/月 (ALB使用時$44.50から約$18削減)

### 🔒 セキュリティ設定
- HTTPS強制リダイレクト
- セキュリティヘッダー設定
- SSH Key認証のみ
- データベースはプライベートサブネット配置
- セキュリティグループで必要最小限のポート開放

### 📧 監視・アラート
- CPU/メモリ/ディスク使用率監視
- サービス稼働状況監視
- Gmail通知設定済み
- CloudWatchダッシュボード作成済み

---

## 🎯 今後の拡張項目

1. **CI/CD Pipeline**: GitHub ActionsでデプロイワークフロウInstagram
2. **Load Balancer**: アクセス増加時のALB導入
3. **CDN**: CloudFrontで静的ファイル配信高速化
4. **Backup Strategy**: 自動バックアップとリストア戦略
5. **Multi-Environment**: staging環境構築

---

**📅 構築日**: 2025年9月15日
**📝 最終更新**: 2025年9月15日
**🏷️ Version**: 1.0
**👨‍💻 構築者**: Claude + ユーザー共同作業
