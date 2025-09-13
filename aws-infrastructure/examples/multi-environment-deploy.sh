#!/bin/bash
# ===================================================================
# 複数環境デプロイ例
# 目的: 開発・ステージング・本番環境を一括またはスマートにデプロイ
# ===================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🌍 複数環境デプロイ例"
echo "このスクリプトは複数の環境に同じインフラをデプロイする例です"
echo ""

# ===================================================================
# 例1: 個別企業・プロジェクト向けカスタマイズ
# ===================================================================
deploy_company_project() {
    echo "🏢 例1: 企業プロジェクト向けデプロイ"

    # A社のEコマースサイト
    echo "📦 A社 Eコマースサイト デプロイ中..."
    PROJECT_NAME="ecommerce" \
    ENVIRONMENT="prod" \
    REGION="ap-northeast-1" \
    $PROJECT_DIR/scripts/deploy-universal.sh a-company-ecommerce-key --dry-run

    # B社のコーポレートサイト
    echo "🏢 B社 コーポレートサイト デプロイ中..."
    PROJECT_NAME="corporate" \
    ENVIRONMENT="prod" \
    REGION="us-east-1" \
    $PROJECT_DIR/scripts/deploy-universal.sh b-company-corporate-key --dry-run
}

# ===================================================================
# 例2: 開発フロー向け環境別デプロイ
# ===================================================================
deploy_development_flow() {
    echo "🔄 例2: 開発フロー向け環境別デプロイ"

    # 開発環境
    echo "🛠️  開発環境デプロイ中..."
    $PROJECT_DIR/scripts/deploy-universal.sh dev-keypair \
        --env dev \
        --region us-west-2 \
        --dry-run

    # ステージング環境
    echo "🧪 ステージング環境デプロイ中..."
    $PROJECT_DIR/scripts/deploy-universal.sh staging-keypair \
        --env staging \
        --region us-east-1 \
        --dry-run

    # 本番環境
    echo "🚀 本番環境デプロイ中..."
    $PROJECT_DIR/scripts/deploy-universal.sh prod-keypair \
        --env prod \
        --region us-east-1 \
        --dry-run
}

# ===================================================================
# 例3: マルチリージョンデプロイ
# ===================================================================
deploy_multi_region() {
    echo "🌏 例3: マルチリージョンデプロイ"

    # 東京リージョン（アジア向け）
    echo "🗾 東京リージョン デプロイ中..."
    $PROJECT_DIR/scripts/deploy-universal.sh asia-keypair \
        --region ap-northeast-1 \
        --project myapp-asia \
        --dry-run

    # オレゴンリージョン（アメリカ向け）
    echo "🏔️  オレゴンリージョン デプロイ中..."
    $PROJECT_DIR/scripts/deploy-universal.sh us-west-keypair \
        --region us-west-2 \
        --project myapp-us \
        --dry-run

    # ヨーロッパリージョン（EU向け）
    echo "🏰 アイルランドリージョン デプロイ中..."
    $PROJECT_DIR/scripts/deploy-universal.sh eu-keypair \
        --region eu-west-1 \
        --project myapp-eu \
        --dry-run
}

# ===================================================================
# 例4: 複数サイト一括管理
# ===================================================================
deploy_multiple_sites() {
    echo "🌐 例4: 複数サイト一括管理"

    # サイト一覧定義
    sites=(
        "blog:blog-keypair:us-east-1"
        "portfolio:portfolio-keypair:us-east-1"
        "shop:shop-keypair:ap-northeast-1"
        "docs:docs-keypair:eu-west-1"
    )

    for site_config in "${sites[@]}"; do
        IFS=':' read -r project keypair region <<< "$site_config"
        echo "🎯 サイト '$project' をリージョン '$region' にデプロイ中..."

        $PROJECT_DIR/scripts/deploy-universal.sh "$keypair" \
            --project "$project" \
            --region "$region" \
            --dry-run

        echo "✅ サイト '$project' デプロイ完了"
        echo ""
    done
}

# ===================================================================
# メニュー表示
# ===================================================================
show_menu() {
    echo "選択してください:"
    echo "1) 企業プロジェクト向けデプロイ例"
    echo "2) 開発フロー向け環境別デプロイ例"
    echo "3) マルチリージョンデプロイ例"
    echo "4) 複数サイト一括管理例"
    echo "5) すべての例を実行"
    echo "q) 終了"
    echo ""
    read -p "選択 (1-5, q): " choice

    case $choice in
        1) deploy_company_project ;;
        2) deploy_development_flow ;;
        3) deploy_multi_region ;;
        4) deploy_multiple_sites ;;
        5)
            deploy_company_project
            echo ""
            deploy_development_flow
            echo ""
            deploy_multi_region
            echo ""
            deploy_multiple_sites
            ;;
        q|Q) echo "👋 終了します"; exit 0 ;;
        *) echo "❌ 無効な選択です"; show_menu ;;
    esac
}

# ===================================================================
# 実行
# ===================================================================
if [ "$1" = "--all" ]; then
    deploy_company_project
    echo ""
    deploy_development_flow
    echo ""
    deploy_multi_region
    echo ""
    deploy_multiple_sites
else
    show_menu
fi

echo ""
echo "💡 Tips:"
echo "- 実際にデプロイするには --dry-run を削除してください"
echo "- 各環境に適した設定は config/deploy-config.sh で調整できます"
echo "- Key Pairは事前に作成が必要です"
echo "- リージョンごとにAMI IDの調整が必要な場合があります"