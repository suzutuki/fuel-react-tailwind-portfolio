#!/bin/bash
# ===================================================================
# 簡易動作確認スクリプト
# 目的: デプロイ後のWebサーバー動作を確認
# ===================================================================

# 設定値
PROJECT_NAME="portfolio"
ENVIRONMENT="prod"
EC2_STACK_NAME="${PROJECT_NAME}-${ENVIRONMENT}-ec2"
REGION="us-east-1"

echo "🔍 デプロイ結果の動作確認を開始します..."

# パブリックIP取得
echo "📡 パブリックIPアドレスを取得中..."
PUBLIC_IP=$(aws cloudformation describe-stacks \
    --stack-name $EC2_STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`PublicIP`].OutputValue' \
    --output text 2>/dev/null)

if [ -z "$PUBLIC_IP" ] || [ "$PUBLIC_IP" = "None" ]; then
    echo "❌ エラー: パブリックIPアドレスを取得できませんでした"
    echo "スタック '$EC2_STACK_NAME' が存在するか確認してください"
    exit 1
fi

echo "✅ パブリックIP: $PUBLIC_IP"
echo ""

# HTTP接続テスト
echo "🌐 HTTP接続テスト中..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$PUBLIC_IP --connect-timeout 10 --max-time 30)

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ HTTP接続成功 (ステータス: $HTTP_STATUS)"
    echo "🎉 Webサイトが正常に動作しています！"
    echo ""
    echo "🌍 WebサイトURL: http://$PUBLIC_IP"
    echo "📄 PHP情報ページ: http://$PUBLIC_IP/info.php"
else
    echo "⚠️  HTTP接続状態: $HTTP_STATUS"
    echo "📝 考えられる原因:"
    echo "   - EC2インスタンス起動中（UserDataスクリプト実行中）"
    echo "   - セキュリティグループ設定の問題"
    echo "   - Nginx/PHP-FPMの起動エラー"
    echo ""
    echo "🔧 追加確認用コマンド:"
    echo "   curl -v http://$PUBLIC_IP"
fi

echo ""

# SSH接続情報
echo "🔐 SSH接続情報:"
echo "ssh -i portfolio-keypair.pem ec2-user@$PUBLIC_IP"
echo ""

# UserDataログ確認用コマンド
echo "📋 UserDataログ確認用コマンド（SSH接続後）:"
echo "sudo tail -f /var/log/user-data.log"
echo "sudo systemctl status nginx"
echo "sudo systemctl status php-fpm"
echo ""

# CloudFormationスタック情報
echo "📊 CloudFormationスタック情報:"
aws cloudformation describe-stacks \
    --stack-name $EC2_STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].[StackName,StackStatus,CreationTime]' \
    --output table 2>/dev/null || echo "スタック情報の取得に失敗しました"

echo ""
echo "🎯 次のステップ:"
echo "1. ブラウザで http://$PUBLIC_IP にアクセス"
echo "2. 'Portfolio Server - Ready!' のページが表示されることを確認"
echo "3. http://$PUBLIC_IP/info.php でPHP動作を確認"
echo "4. SSH接続してサーバー詳細を確認"