# ===================================================================
# 簡単再デプロイスクリプト
# ===================================================================

set -e

REGION="ap-northeast-1"
EC2_STACK_NAME="portfolio-prod-ec2"
NETWORK_STACK_NAME="portfolio-prod-network"
KEYPAIR_NAME="portfolio-prod-keypair"

echo "🚀 EC2スタック再デプロイ開始..."

# Step 1: 失敗したスタック削除（既に削除済みならスキップ）
echo "🗑️  失敗したスタックを削除中..."
if aws cloudformation describe-stacks --stack-name $EC2_STACK_NAME --region $REGION > /dev/null 2>&1; then
    aws cloudformation delete-stack --stack-name $EC2_STACK_NAME --region $REGION
    echo "⏳ スタック削除完了を待機中..."
    aws cloudformation wait stack-delete-complete --stack-name $EC2_STACK_NAME --region $REGION
    echo "✅ スタック削除完了"
else
    echo "ℹ️  削除対象のスタックは存在しません"
fi

# Step 2: 修正版テンプレートで再作成
echo "🏗️  修正版テンプレートで再作成中..."

# テンプレートファイルの確認
if [ -f "templates/02-ec2-instance-fixed.yaml" ]; then
    TEMPLATE_FILE="templates/02-ec2-instance-fixed.yaml"
    echo "✅ 修正版テンプレートを使用: $TEMPLATE_FILE"
elif [ -f "templates/02-ec2-instance.yaml" ]; then
    TEMPLATE_FILE="templates/02-ec2-instance.yaml"
    echo "⚠️  元のテンプレートを使用: $TEMPLATE_FILE"
    echo "   注意: AMI IDの問題が解決されていない可能性があります"
else
    echo "❌ テンプレートファイルが見つかりません"
    exit 1
fi

# スタック作成
aws cloudformation create-stack \
    --stack-name $EC2_STACK_NAME \
    --template-body file://$TEMPLATE_FILE \
    --parameters ParameterKey=ProjectName,ParameterValue=portfolio \
                 ParameterKey=Environment,ParameterValue=prod \
                 ParameterKey=NetworkStackName,ParameterValue=$NETWORK_STACK_NAME \
                 ParameterKey=KeyPairName,ParameterValue=$KEYPAIR_NAME \
    --region $REGION

echo "⏳ スタック作成完了を待機中（最大15分）..."
aws cloudformation wait stack-create-complete \
    --stack-name $EC2_STACK_NAME \
    --region $REGION

# Step 3: 結果表示
echo ""
echo "🎉 再デプロイ完了!"
echo "======================================================"

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

echo "🌐 パブリックIP: $PUBLIC_IP"
echo "🔗 WebサイトURL: $WEBSITE_URL"
echo "🏥 ヘルスチェック: $WEBSITE_URL/health.php"
echo "📋 PHP情報: $WEBSITE_URL/info.php"
echo ""
echo "🔍 動作確認（30秒後）:"
echo "sleep 30 && curl -s $WEBSITE_URL/health.php | jq ."

echo ""
echo "✅ 再デプロイ成功!"EOF
