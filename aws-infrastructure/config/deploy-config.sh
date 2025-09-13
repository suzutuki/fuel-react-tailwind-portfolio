#!/bin/bash
# ===================================================================
# デプロイ設定ファイル
# 目的: プロジェクト別・環境別の設定を簡単にカスタマイズ
# 使用方法: このファイルを編集してからデプロイスクリプトを実行
# ===================================================================

# ===================================================================
# 基本設定（プロジェクトごとに変更）
# ===================================================================
export PROJECT_NAME="portfolio"          # プロジェクト名
export ORGANIZATION="mycompany"           # 組織名（オプション）
export COST_CENTER="development"         # コスト管理用（オプション）

# ===================================================================
# 環境設定（dev/staging/prod）
# ===================================================================
export ENVIRONMENT="prod"                # 環境名
export REGION="us-east-1"                # AWS リージョン

# ===================================================================
# インスタンス設定（環境別にカスタマイズ可能）
# ===================================================================
case $ENVIRONMENT in
  "dev")
    export INSTANCE_TYPE="t2.micro"      # 開発環境：最小構成
    export ENABLE_MONITORING="false"     # モニタリング無効
    ;;
  "staging")
    export INSTANCE_TYPE="t3.micro"      # ステージング：標準構成
    export ENABLE_MONITORING="true"      # モニタリング有効
    ;;
  "prod")
    export INSTANCE_TYPE="t3.micro"      # 本番環境：安定構成
    export ENABLE_MONITORING="true"      # モニタリング有効
    export BACKUP_ENABLED="true"         # バックアップ有効
    ;;
esac

# ===================================================================
# ネットワーク設定（セキュリティ強化）
# ===================================================================
export VPC_CIDR="10.0.0.0/16"           # VPC IPアドレス範囲
export PUBLIC_SUBNET_CIDR="10.0.1.0/24" # パブリックサブネット
export PRIVATE_SUBNET_CIDR="10.0.2.0/24" # プライベートサブネット

# SSH接続許可IP（セキュリティ強化）
# 本番環境では特定IPのみに制限することを強く推奨
case $ENVIRONMENT in
  "prod")
    export SSH_ALLOWED_CIDR="YOUR_IP_ADDRESS/32"  # 本番：特定IPのみ
    ;;
  *)
    export SSH_ALLOWED_CIDR="0.0.0.0/0"           # 開発：全IP（注意）
    ;;
esac

# ===================================================================
# タグ設定（リソース管理用）
# ===================================================================
export COMMON_TAGS="Project=$PROJECT_NAME,Environment=$ENVIRONMENT,Owner=$USER"
if [ -n "$ORGANIZATION" ]; then
    export COMMON_TAGS="$COMMON_TAGS,Organization=$ORGANIZATION"
fi
if [ -n "$COST_CENTER" ]; then
    export COMMON_TAGS="$COMMON_TAGS,CostCenter=$COST_CENTER"
fi

# ===================================================================
# 派生値（自動計算）
# ===================================================================
export STACK_PREFIX="${PROJECT_NAME}-${ENVIRONMENT}"
export NETWORK_STACK_NAME="${STACK_PREFIX}-network"
export EC2_STACK_NAME="${STACK_PREFIX}-ec2"
export RDS_STACK_NAME="${STACK_PREFIX}-rds"

# Key Pairの命名規則
export DEFAULT_KEYPAIR_NAME="${STACK_PREFIX}-keypair"

# ===================================================================
# 設定値表示（確認用）
# ===================================================================
show_config() {
    echo "════════════════════════════════════════"
    echo "📋 デプロイ設定確認"
    echo "════════════════════════════════════════"
    echo "🏷️  プロジェクト: $PROJECT_NAME"
    echo "🌍 環境: $ENVIRONMENT"
    echo "📍 リージョン: $REGION"
    echo "💻 インスタンスタイプ: $INSTANCE_TYPE"
    echo "🔑 デフォルトKey Pair: $DEFAULT_KEYPAIR_NAME"
    echo "🏗️  ネットワークスタック: $NETWORK_STACK_NAME"
    echo "💾 EC2スタック: $EC2_STACK_NAME"
    echo "🔒 SSH許可範囲: $SSH_ALLOWED_CIDR"
    echo "🏷️  共通タグ: $COMMON_TAGS"
    echo "════════════════════════════════════════"
}

# ===================================================================
# 使用例
# ===================================================================
# 1. このファイルを編集
# 2. source config/deploy-config.sh
# 3. show_config  # 設定確認
# 4. ./scripts/deploy.sh $DEFAULT_KEYPAIR_NAME
# ===================================================================