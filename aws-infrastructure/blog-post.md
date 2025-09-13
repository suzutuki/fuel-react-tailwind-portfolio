# AWS CloudFormationで無料でポートフォリオサイトを構築する方法【完全ガイド】

## はじめに

転職活動でポートフォリオサイトをAWSで公開したいけれど、費用を抑えたい...そんな方向けに、**AWS無料ティア範囲内**でCloudFormationを使ってインフラを構築する方法を解説します。

### 今回構築する環境

- **フロントエンド**: React + TypeScript + TailwindCSS
- **バックエンド**: FuelPHP
- **データベース**: RDS MySQL
- **インフラ**: AWS CloudFormation
- **費用**: 完全無料（12ヶ月間）

### 対象読者

- AWSを学習中の方
- 転職活動でポートフォリオサイトを作りたい方
- CloudFormationでインフラをコード化したい方
- 無料でAWSを活用したい方

## 1. アーキテクチャ設計

### 全体構成図

```
インターネット
    ↓
[インターネットゲートウェイ]
    ↓
[VPC: 10.x.0.0/16] - 選択したリージョンの1つのAZのみ
    ├── パブリックサブネット（10.x.1.0/24）
    │   └── EC2インスタンス（Webサーバー）
    └── プライベートサブネット（10.x.2.0/24）
        └── RDS（データベース・シングルAZ）
```

### 無料枠で使用するリソース

| サービス | スペック | 無料枠制限 | 費用 |
|---------|---------|-----------|------|
| **EC2** | t3.micro (1vCPU, 1GB) | 750時間/月 | 無料 |
| **RDS** | db.t3.micro (1vCPU, 1GB) | 750時間/月 | 無料 |
| **EBS** | gp2 30GB | 30GB | 無料 |
| **VPC** | 基本ネットワーク | 制限なし | 無料 |

### なぜEC2 + RDS構成を選んだか

**S3 + CloudFront vs EC2 + RDS比較**

| 項目 | S3 + CloudFront | EC2 + RDS |
|------|----------------|-----------|
| 費用 | 超過分課金あり | 完全無料 |
| 学習効果 | 静的サイト | フルスタック |
| 面接アピール | 基本構成 | 本格構成 |
| 運用 | 簡単 | 学習コスト高 |

転職活動では「**AWS上でフルスタック環境を構築・運用できる**」ことをアピールできるため、EC2 + RDS構成を選択しました。

## 2. 事前準備

### 必要なツール

```bash
# AWS CLI インストール（Linux/WSL）
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# AWS CLI設定
aws configure
# AWS Access Key ID: [IAMユーザーで作成したアクセスキー]
# AWS Secret Access Key: [IAMユーザーで作成したシークレットキー]
# Default region name: [使用するリージョン（例：us-east-1）]
# Default output format: json

# ⚠️ セキュリティ注意事項
# - IAMユーザーには必要最小限の権限のみ付与
# - アクセスキーは絶対にコードにハードコーディングしない
# - AWS CLI設定ファイルは適切な権限設定（chmod 600）
```

### プロジェクト構造

```
aws-infrastructure/
├── templates/           # CloudFormationテンプレート
│   ├── 01-vpc-network.yaml
│   ├── 02-ec2-instance.yaml
│   └── 03-rds-database.yaml
├── parameters/          # パラメーターファイル
└── scripts/            # デプロイスクリプト
```

## 3. CloudFormationテンプレート作成

### Step 1: VPCとネットワーク基盤

まず、すべてのリソースの土台となるVPC（仮想プライベートクラウド）を作成します。

#### なぜVPCから始めるのか？

VPCは「**仮想的なデータセンター**」のようなもので、EC2やRDSなどすべてのリソースはVPC内に配置されます。建物で例えると、まず土地（VPC）を確保してから、建物（EC2）や設備（RDS）を配置するイメージです。

#### 作成するネットワーク構成

```yaml
# VPC: 独立したネットワーク空間
VPC (10.x.0.0/16)
├── パブリックサブネット (10.x.1.0/24)  # インターネットからアクセス可能
│   └── EC2 (Webサーバー)
└── プライベートサブネット (10.x.2.0/24) # 外部から直接アクセス不可
    └── RDS (データベース)
```

#### セキュリティグループ設定

**EC2用セキュリティグループ（ファイアウォール）**
- ポート80（HTTP）← ブラウザからのアクセス
- ポート22（SSH）← 管理用アクセス（⚠️本番では特定IP制限必須）
- ポート443（HTTPS）← SSL通信

**RDS用セキュリティグループ**
- ポート3306（MySQL）← EC2からのみアクセス可能

#### テンプレートのポイント

```yaml
# 重要な設定例

# 1. DNS解決を有効化（RDS接続に必須）
VPC:
  Type: AWS::EC2::VPC
  Properties:
    EnableDnsHostnames: true  # これがないとRDS接続エラー
    EnableDnsSupport: true

# 2. EC2に自動でパブリックIP割り当て
PublicSubnet:
  Type: AWS::EC2::Subnet
  Properties:
    MapPublicIpOnLaunch: true  # これがないとインターネットアクセス不可

# 3. RDS用セキュリティグループ（EC2からのみアクセス）
RDSSecurityGroup:
  SecurityGroupIngress:
    - FromPort: 3306
      ToPort: 3306
      SourceSecurityGroupId: !Ref EC2SecurityGroup  # EC2からのみ
```

### 無料枠最適化のポイント

1. **シングルAZ構成**
   - マルチAZ配置は有料オプション
   - すべてのリソースを同じAZに配置

2. **最小限のサブネット**
   - RDSの要件により最低2つのサブネットが必要
   - 1つのメインサブネット + 1つのRDS要件用サブネット

3. **コメント充実**
   - 各リソースの役割と設定理由を詳細に記載
   - 初心者でも理解できるよう具体例を併記

### 作成したテンプレートファイル

`templates/01-vpc-network.yaml`の主要な構成要素：

```yaml
Resources:
  # 1. VPC（仮想プライベートクラウド）
  VPC:
    # 独立したネットワーク空間を作成

  # 2. インターネットゲートウェイ
  InternetGateway:
    # VPCとインターネットを繋ぐ「玄関」

  # 3. サブネット
  PublicSubnet:   # EC2用（インターネットアクセス可）
  PrivateSubnet:  # RDS用（外部アクセス不可）

  # 4. セキュリティグループ
  EC2SecurityGroup:  # EC2用ファイアウォール
  RDSSecurityGroup:  # RDS用ファイアウォール

  # 5. ルーティング設定
  PublicRouteTable:     # 通信経路の設定表
  DefaultPublicRoute:   # インターネット向け通信設定
```

## 4. デプロイ方法

### CloudFormationスタック作成

```bash
# VPCスタックをデプロイ
aws cloudformation create-stack \
  --stack-name your-project-network \
  --template-body file://templates/01-vpc-network.yaml \
  --parameters ParameterKey=ProjectName,ParameterValue=yourproject \
               ParameterKey=Environment,ParameterValue=prod
```

### デプロイ状況確認

```bash
# スタック作成状況を確認
aws cloudformation describe-stacks \
  --stack-name your-project-network \
  --query 'Stacks[0].StackStatus'

# 作成されたリソースを確認
aws cloudformation describe-stack-resources \
  --stack-name your-project-network
```

## 5. 学んだポイント

### CloudFormationのメリット

1. **Infrastructure as Code**
   - インフラ構成をコードで管理
   - Gitでバージョン管理可能
   - 同じ構成を何度でも再現可能

2. **依存関係の自動解決**
   - リソース作成順序を自動で最適化
   - `!Ref`や`DependsOn`で依存関係を明示

3. **パラメーター化**
   - 同じテンプレートで複数環境作成
   - プロジェクト名や環境名を動的に変更

### トラブルシューティング

**よくあるエラーと対処法**

1. **VPC DNS設定エラー**
   ```yaml
   # 解決方法: DNS設定を有効化
   EnableDnsHostnames: true
   EnableDnsSupport: true
   ```

2. **EC2インターネットアクセス不可**
   ```yaml
   # 解決方法: パブリックIP自動割り当て
   MapPublicIpOnLaunch: true
   ```

3. **RDS接続エラー**
   ```yaml
   # 解決方法: セキュリティグループでEC2からのアクセス許可
   SourceSecurityGroupId: !Ref EC2SecurityGroup
   ```

## 次回予告

次回は**EC2インスタンステンプレート**を作成します：

- EC2インスタンス設定（t3.micro）
- UserDataスクリプトによる自動セットアップ
- Nginx + PHP-FPM + Node.js環境構築
- SSH Key Pair設定

### 今回作成したファイル

- ✅ `01-vpc-network.yaml` - VPCとネットワーク基盤
- 🔄 `02-ec2-instance.yaml` - EC2インスタンス（次回）
- 🔄 `03-rds-database.yaml` - RDSデータベース（次回）

## まとめ

今回は、AWS CloudFormationを使って**完全無料**でポートフォリオサイト用のネットワーク基盤を構築しました。

### 重要なポイント

1. **無料枠の活用**
   - シングルAZ構成でコスト最適化
   - 必要最小限のリソース構成

2. **セキュリティ重視**
   - プライベートサブネットでデータベース保護
   - セキュリティグループで適切なアクセス制御

3. **運用性向上**
   - Infrastructure as Codeで再現性確保
   - 詳細なコメントで保守性向上

### セキュリティベストプラクティス

**🔒 本番環境で必ず実施すべき設定**

1. **SSH接続制限**
   ```yaml
   # 悪い例（全IPから接続可能）
   CidrIp: 0.0.0.0/0

   # 良い例（特定IPのみ許可）
   CidrIp: YOUR_IP_ADDRESS/32
   ```

2. **IAM権限最小化**
   - CloudFormation実行用に専用IAMユーザー作成
   - 必要最小限の権限のみ付与
   - アクセスキーの定期ローテーション

3. **VPC設定**
   - RDSは必ずプライベートサブネットに配置
   - NACLで追加のネットワークレベル制御
   - VPC Flow Logsで通信監視

4. **タグ付け戦略**
   - すべてのリソースに環境・プロジェクトタグ
   - コスト管理用のタグ設定
   - 責任者情報のタグ

**⚠️ 注意事項**
- このガイドは学習目的です
- 本番環境ではセキュリティ要件を十分検討してください
- 定期的なセキュリティ監査を実施してください

次回は、実際にアプリケーションが動作するEC2インスタンスの構築に進みます。お楽しみに！

---

### 関連記事

- [AWS無料ティアを最大活用する方法](#)
- [CloudFormation入門ガイド](#)
- [EC2でLEMP環境構築](#)

### 参考リンク

- [AWS CloudFormation ドキュメント](https://docs.aws.amazon.com/cloudformation/)
- [AWS無料ティア詳細](https://aws.amazon.com/free/)
- [VPCユーザーガイド](https://docs.aws.amazon.com/vpc/)

---

**📌 このシリーズの記事**
1. ✅ VPCとネットワーク基盤構築（この記事）
2. 🔄 EC2インスタンス構築（次回）
3. 🔄 RDSデータベース構築
4. 🔄 アプリケーションデプロイ
5. 🔄 ドメイン設定とSSL証明書

**🏷️ タグ:** `AWS` `CloudFormation` `VPC` `無料` `ポートフォリオ` `インフラ` `IaC`