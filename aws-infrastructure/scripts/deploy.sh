#!/bin/bash
# ===================================================================
# CloudFormation デプロイスクリプト
# 目的: ポートフォリオサイトのインフラを段階的にデプロイ
# 使用方法: ./deploy.sh [your-keypair-name]
# ===================================================================

set -e  # エラーが発生したら即座に停止

# 設定値
PROJECT_NAME="portfolio"
ENVIRONMENT="prod"
REGION="us-east-1"  # 使用するリージョン（変更可能）

# 引数チェック
if [ $# -eq 0 ]; then
    echo "❌ エラー: SSH Key Pair名を指定してください"
    echo "使用方法: $0 <keypair-name>"
    echo "例: $0 my-portfolio-key"
    exit 1
fi

KEYPAIR_NAME=$1
NETWORK_STACK_NAME="${PROJECT_NAME}-${ENVIRONMENT}-network"
EC2_STACK_NAME="${PROJECT_NAME}-${ENVIRONMENT}-ec2"

echo "🚀 CloudFormation デプロイを開始します..."
echo "📍 リージョン: $REGION"
echo "🔑 Key Pair: $KEYPAIR_NAME"
echo "📦 プロジェクト: $PROJECT_NAME ($ENVIRONMENT)"
echo ""

# ===================================================================
# Step 1: VPCスタックのデプロイ
# ===================================================================
echo "🏗️  Step 1: VPCとネットワーク基盤をデプロイ中..."

# VPCスタックが既に存在するかチェック
if aws cloudformation describe-stacks --stack-name $NETWORK_STACK_NAME --region $REGION > /dev/null 2>&1; then
    echo "ℹ️  VPCスタック '$NETWORK_STACK_NAME' は既に存在します。スキップ..."
else
    # VPCスタック作成
    aws cloudformation create-stack \
        --stack-name $NETWORK_STACK_NAME \
        --template-body file://templates/01-vpc-network.yaml \
        --parameters ParameterKey=ProjectName,ParameterValue=$PROJECT_NAME \
                     ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
        --region $REGION

    echo "⏳ VPCスタックの作成完了を待機中..."
    aws cloudformation wait stack-create-complete \
        --stack-name $NETWORK_STACK_NAME \
        --region $REGION

    echo "✅ VPCスタック作成完了!"
fi

# ===================================================================
# Step 2: EC2スタックのデプロイ
# ===================================================================
echo ""
echo "💻 Step 2: EC2 Webサーバーをデプロイ中..."

# Key Pairが存在するかチェック
if ! aws ec2 describe-key-pairs --key-names $KEYPAIR_NAME --region $REGION > /dev/null 2>&1; then
    echo "❌ エラー: Key Pair '$KEYPAIR_NAME' が見つかりません"
    echo "以下のコマンドでKey Pairを作成してください:"
    echo "aws ec2 create-key-pair --key-name $KEYPAIR_NAME --region $REGION --query 'KeyMaterial' --output text > ${KEYPAIR_NAME}.pem"
    echo "chmod 400 ${KEYPAIR_NAME}.pem"
    exit 1
fi

# EC2スタックが既に存在するかチェック
if aws cloudformation describe-stacks --stack-name $EC2_STACK_NAME --region $REGION > /dev/null 2>&1; then
    echo "ℹ️  EC2スタック '$EC2_STACK_NAME' は既に存在します。更新します..."

    # スタック更新
    aws cloudformation update-stack \
        --stack-name $EC2_STACK_NAME \
        --template-body file://templates/02-ec2-instance.yaml \
        --parameters ParameterKey=ProjectName,ParameterValue=$PROJECT_NAME \
                     ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
                     ParameterKey=NetworkStackName,ParameterValue=$NETWORK_STACK_NAME \
                     ParameterKey=KeyPairName,ParameterValue=$KEYPAIR_NAME \
        --region $REGION || echo "スタック更新は変更がない可能性があります"
else
    # EC2スタック作成
    aws cloudformation create-stack \
        --stack-name $EC2_STACK_NAME \
        --template-body file://templates/02-ec2-instance.yaml \
        --parameters ParameterKey=ProjectName,ParameterValue=$PROJECT_NAME \
                     ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
                     ParameterKey=NetworkStackName,ParameterValue=$NETWORK_STACK_NAME \
                     ParameterKey=KeyPairName,ParameterValue=$KEYPAIR_NAME \
        --region $REGION

    echo "⏳ EC2スタックの作成完了を待機中..."
    aws cloudformation wait stack-create-complete \
        --stack-name $EC2_STACK_NAME \
        --region $REGION

    echo "✅ EC2スタック作成完了!"
fi

# ===================================================================
# Step 3: デプロイ結果の表示
# ===================================================================
echo ""
echo "🎉 デプロイ完了! 結果を表示中..."

# アウトプット取得
PUBLIC_IP=$(aws cloudformation describe-stacks \
    --stack-name $EC2_STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`PublicIP`].OutputValue' \
    --output text)

WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name $EC2_STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text)

SSH_COMMAND=$(aws cloudformation describe-stacks \
    --stack-name $EC2_STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`SSHCommand`].OutputValue' \
    --output text)

echo "═══════════════════════════════════════════════════"
echo "🎯 デプロイ完了情報"
echo "═══════════════════════════════════════════════════"
echo "🌐 パブリックIP: $PUBLIC_IP"
echo "🔗 WebサイトURL: $WEBSITE_URL"
echo "🔧 SSH接続: $SSH_COMMAND"
echo ""
echo "📝 次のステップ:"
echo "1. WebサイトURL にアクセスして動作確認"
echo "2. SSH接続でサーバーにログイン"
echo "3. RDSデータベーススタックのデプロイ"
echo "4. アプリケーションファイルのアップロード"
echo "═══════════════════════════════════════════════════"

# ===================================================================
# Step 4: 動作確認用コマンド
# ===================================================================
echo ""
echo "🔍 動作確認用コマンド:"
echo "# Webサーバーの動作確認"
echo "curl -I $WEBSITE_URL"
echo ""
echo "# SSH接続（Key Pairファイルが必要）"
echo "$SSH_COMMAND"
echo ""
echo "# CloudFormationスタック状況確認"
echo "aws cloudformation describe-stacks --stack-name $NETWORK_STACK_NAME --region $REGION"
echo "aws cloudformation describe-stacks --stack-name $EC2_STACK_NAME --region $REGION"