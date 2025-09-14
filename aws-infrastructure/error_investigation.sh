#!/bin/bash
# ===================================================================
# CloudFormation エラー調査スクリプト
# 目的: スタック作成失敗の原因を特定
# ===================================================================

REGION="ap-northeast-1"
EC2_STACK_NAME="portfolio-prod-ec2"
NETWORK_STACK_NAME="portfolio-prod-network"

echo "🔍 CloudFormation エラー調査を開始します..."
echo ""

# ===================================================================
# Step 1: EC2スタックのイベントログ確認（最も重要）
# ===================================================================
echo "📋 EC2スタックのイベントログ（エラーの詳細）:"
echo "======================================================"
aws cloudformation describe-stack-events \
    --stack-name $EC2_STACK_NAME \
    --region $REGION \
    --query 'StackEvents[?ResourceStatus==`CREATE_FAILED`].[Timestamp,LogicalResourceId,ResourceStatusReason]' \
    --output table 2>/dev/null || echo "⚠️  EC2スタックのイベントログ取得に失敗しました"

echo ""

# ===================================================================
# Step 2: スタック全体の状況確認
# ===================================================================
echo "📊 現在のスタック状況:"
echo "======================================================"
echo "📦 ネットワークスタック状況:"
aws cloudformation describe-stacks \
    --stack-name $NETWORK_STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].[StackName,StackStatus,CreationTime]' \
    --output table 2>/dev/null || echo "⚠️  ネットワークスタック情報取得失敗"

echo ""
echo "💻 EC2スタック状況:"
aws cloudformation describe-stacks \
    --stack-name $EC2_STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].[StackName,StackStatus,CreationTime]' \
    --output table 2>/dev/null || echo "⚠️  EC2スタック情報取得失敗"

echo ""

# ===================================================================
# Step 3: キーペア存在確認
# ===================================================================
echo "🔑 キーペア確認:"
echo "======================================================"
KEYPAIR_NAME="portfolio-prod-keypair"
if aws ec2 describe-key-pairs --key-names $KEYPAIR_NAME --region $REGION > /dev/null 2>&1; then
    echo "✅ キーペア '$KEYPAIR_NAME' は存在します"
    aws ec2 describe-key-pairs \
        --key-names $KEYPAIR_NAME \
        --region $REGION \
        --query 'KeyPairs[0].[KeyName,KeyPairId,CreateTime]' \
        --output table
else
    echo "❌ キーペア '$KEYPAIR_NAME' が見つかりません！"
    echo "以下のコマンドでキーペアを作成してください:"
    echo "aws ec2 create-key-pair --key-name $KEYPAIR_NAME --region $REGION --query 'KeyMaterial' --output text > ${KEYPAIR_NAME}.pem"
    echo "chmod 400 ${KEYPAIR_NAME}.pem"
fi

echo ""

# ===================================================================
# Step 4: AMI ID確認（地域別）
# ===================================================================
echo "💿 AMI確認 (Amazon Linux 2):"
echo "======================================================"
echo "最新のAmazon Linux 2 AMI IDを確認中..."
LATEST_AMI=$(aws ec2 describe-images \
    --owners amazon \
    --filters 'Name=name,Values=amzn2-ami-hvm-*-x86_64-gp2' \
    --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' \
    --output text \
    --region $REGION)

if [ ! -z "$LATEST_AMI" ]; then
    echo "✅ 最新のAmazon Linux 2 AMI: $LATEST_AMI"
else
    echo "⚠️  AMI情報の取得に失敗しました"
fi

echo ""

# ===================================================================
# Step 5: VPCリソース確認
# ===================================================================
echo "🌐 VPCリソース確認:"
echo "======================================================"
echo "VPCスタックから作成されたリソースの確認..."

# VPC ID
VPC_ID=$(aws cloudformation describe-stacks \
    --stack-name $NETWORK_STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`VPCId`].OutputValue' \
    --output text 2>/dev/null)

if [ ! -z "$VPC_ID" ]; then
    echo "✅ VPC ID: $VPC_ID"
    
    # サブネット確認
    echo "📋 サブネット確認:"
    aws ec2 describe-subnets \
        --filters "Name=vpc-id,Values=$VPC_ID" \
        --query 'Subnets[].[SubnetId,CidrBlock,AvailabilityZone,Tags[?Key==`Name`].Value|[0]]' \
        --output table \
        --region $REGION
else
    echo "❌ VPC情報の取得に失敗しました"
fi

echo ""

# ===================================================================
# Step 6: 推奨される修正アクション
# ===================================================================
echo "🛠️  推奨される修正アクション:"
echo "======================================================"
echo "1. 失敗したスタックを削除:"
echo "   aws cloudformation delete-stack --stack-name $EC2_STACK_NAME --region $REGION"
echo ""
echo "2. エラーの原因を確認して修正:"
echo "   - AMI ID が正しいか確認"
echo "   - キーペアが存在するか確認"
echo "   - VPCリソースが正常に作成されているか確認"
echo ""
echo "3. 修正後、再デプロイ実行:"
echo "   ./scripts/deploy.sh $KEYPAIR_NAME"
echo ""
echo "4. 詳細なログが必要な場合:"
echo "   aws cloudformation describe-stack-events --stack-name $EC2_STACK_NAME --region $REGION"

echo ""
echo "🔍 エラー調査完了"
