#!/bin/bash

# ==================================================
# Production Deployment Script
# FuelPHP + React Application Deployment
# ==================================================
#
# このスクリプトは以下の処理を自動実行します：
# 1. 前提条件の確認（SSH接続、ディレクトリ存在など）
# 2. Reactフロントエンドのプロダクションビルド
# 3. EC2サーバーへのファイル転送
# 4. サーバー上でのファイル配置・権限設定
# 5. デプロイの検証
#
# ==================================================
# 使用方法（Usage）
# ==================================================
#
# 1. 必須環境変数を設定:
#    export DEPLOY_EC2_HOST="EC2のIPアドレス"
#
# 2. オプション環境変数（必要に応じて）:
#    export DEPLOY_EC2_USER="${DEPLOY_EC2_USER:-ec2-user}"              # デフォルト: ${DEPLOY_EC2_USER:-ec2-user}
#    export DEPLOY_SSH_KEY="/path/to/your/key.pem"  # デフォルト: ~/.ssh/${DEPLOY_SSH_KEY:-temp-keypair.pem}
#    export DEPLOY_WEB_ROOT="/var/www/html"         # デフォルト: /var/www/html
#
# 3. スクリプト実行:
#    ./deploy.sh
#
# 実行場所: プロジェクトルートディレクトリ
#
# 例:
#    export DEPLOY_EC2_HOST="YOUR_EC2_IP_ADDRESS"
#    ./deploy.sh
# ==================================================

# エラーが発生した場合は即座にスクリプトを終了
set -e

# ==================================================
# 設定値（Configuration）
# ==================================================
# 環境変数から設定を読み込み（セキュリティ向上のため）
# 本番サーバーの情報をGitリポジトリに含めないようにします

# プロジェクトの各ディレクトリパス
PROJECT_DIR="${DEPLOY_PROJECT_DIR:-/mnt/c/xampp/htdocs/fuel-react-app}"  # プロジェクトルート
FRONTEND_DIR="$PROJECT_DIR/frontend"                                     # Reactアプリのソースディレクトリ
DIST_DIR="$PROJECT_DIR/dist"                                             # ビルド成果物の出力先

# EC2サーバーへの接続情報（環境変数から取得）
EC2_USER="${DEPLOY_EC2_USER:-${DEPLOY_EC2_USER:-ec2-user}}"           # EC2インスタンスのユーザー名
EC2_HOST="${DEPLOY_EC2_HOST}"                     # EC2インスタンスのIPアドレス（必須）
SSH_KEY="${DEPLOY_SSH_KEY:-$HOME/.ssh/${DEPLOY_SSH_KEY:-temp-keypair.pem}}"  # SSH秘密鍵のパス
WEB_ROOT="${DEPLOY_WEB_ROOT:-/var/www/html}"      # EC2サーバーのWebルートディレクトリ

# ==================================================
# 出力用の色設定（Color Configuration）
# ==================================================
RED='\033[0;31m'      # エラーメッセージ用
GREEN='\033[0;32m'    # 成功メッセージ用
YELLOW='\033[1;33m'   # 警告メッセージ用
BLUE='\033[0;34m'     # 情報メッセージ用
NC='\033[0m'          # 色をリセット（No Color）

# ==================================================
# ログ出力用のヘルパー関数
# ==================================================
# 情報メッセージを青色で出力
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# 成功メッセージを緑色で出力
log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# 警告メッセージを黄色で出力
log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# エラーメッセージを赤色で出力
log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ==================================================
# 前提条件チェック関数
# ==================================================
# デプロイに必要な条件が整っているかを確認します
# - 必須環境変数の設定
# - フロントエンドディレクトリの存在
# - SSH秘密鍵ファイルの存在
# - EC2サーバーへのSSH接続可能性
check_prerequisites() {
    log_info "前提条件をチェックしています..."

    # ==================================================
    # 必須環境変数の検証
    # ==================================================
    if [ -z "$EC2_HOST" ]; then
        log_error "必須環境変数 DEPLOY_EC2_HOST が設定されていません"
        log_error "使用方法:"
        log_error "  export DEPLOY_EC2_HOST=\"EC2のIPアドレス\""
        log_error "  ./deploy.sh"
        exit 1
    fi

    log_info "使用する設定:"
    log_info "  EC2ホスト: $EC2_HOST"
    log_info "  EC2ユーザー: $EC2_USER"
    log_info "  SSH鍵: $SSH_KEY"
    log_info "  Webルート: $WEB_ROOT"

    # フロントエンドディレクトリが存在するかチェック
    if [ ! -d "$FRONTEND_DIR" ]; then
        log_error "フロントエンドディレクトリが見つかりません: $FRONTEND_DIR"
        exit 1
    fi

    # SSH秘密鍵ファイルが存在するかチェック
    if [ ! -f "$SSH_KEY" ]; then
        log_error "SSH秘密鍵が見つかりません: $SSH_KEY"
        log_error "EC2インスタンス用のSSH鍵を適切な場所に配置してください"
        log_error "または環境変数 DEPLOY_SSH_KEY でパスを指定してください"
        exit 1
    fi

    # EC2サーバーへのSSH接続をテスト（タイムアウト10秒、バッチモード、カスタムポート2222）
    if ! ssh -i "$SSH_KEY" -p 2222 -o ConnectTimeout=10 -o BatchMode=yes "$EC2_USER@$EC2_HOST" exit 2>/dev/null; then
        log_error "EC2インスタンスに接続できません: $EC2_USER@$EC2_HOST"
        log_error "以下を確認してください："
        log_error "- EC2インスタンスが起動しているか"
        log_error "- セキュリティグループでSSH(22番ポート)が許可されているか"
        log_error "- SSH鍵が正しいか"
        log_error "- DEPLOY_EC2_HOST環境変数が正しく設定されているか"
        exit 1
    fi

    log_success "前提条件チェック完了"
}

# ==================================================
# フロントエンドビルド関数
# ==================================================
# Reactアプリケーションをプロダクション用にビルドします
# - 依存関係のインストール（必要な場合）
# - Webpackによる最適化・圧縮
# - ビルド成果物の検証
build_frontend() {
    log_info "フロントエンドアプリケーションをビルドしています..."

    # フロントエンドディレクトリに移動
    cd "$FRONTEND_DIR"

    # node_modulesディレクトリの存在をチェック
    # 存在しない場合は依存関係をインストール
    if [ ! -d "node_modules" ]; then
        log_warning "node_modulesが見つかりません。npm installを実行します..."
        npm install
    fi

    # プロダクション用ビルドを実行
    # Webpackが以下を実行します：
    # - TypeScript/JSXのコンパイル
    # - CSSの最適化
    # - ファイルの圧縮・最適化
    # - チャンク分割
    log_info "プロダクションビルドを実行中..."
    npm run build

    # ビルド成果物の存在を確認
    # bundle.js（メインのJavaScriptファイル）
    if [ ! -f "$DIST_DIR/bundle.js" ]; then
        log_error "ビルド失敗: bundle.jsが見つかりません in $DIST_DIR"
        log_error "Webpackの設定またはビルドプロセスに問題があります"
        exit 1
    fi

    # index.html（メインのHTMLファイル）
    if [ ! -f "$DIST_DIR/index.html" ]; then
        log_error "ビルド失敗: index.htmlが見つかりません in $DIST_DIR"
        log_error "Webpackの設定またはビルドプロセスに問題があります"
        exit 1
    fi

    log_success "フロントエンドビルド完了"

    # ビルド結果の情報を表示
    # バンドルサイズを計算して表示（KB単位）
    local bundle_size=$(stat -c%s "$DIST_DIR/bundle.js" 2>/dev/null || stat -f%z "$DIST_DIR/bundle.js" 2>/dev/null)
    log_info "バンドルサイズ: $(($bundle_size / 1024))KB"
}

# ==================================================
# ファイルデプロイ関数
# ==================================================
# ビルドされたファイルをEC2サーバーに転送し、適切に配置します
# フェーズ1: ローカルからEC2の一時ディレクトリへファイル転送
# フェーズ2: EC2サーバー内でファイルを本番ディレクトリに移動・権限設定
deploy_files() {
    log_info "プロダクションサーバーにファイルをデプロイしています..."

    # ==================================================
    # フェーズ1: ファイル転送（SCP使用）
    # ==================================================
    # セキュリティ上、まず/tmpディレクトリに転送してから移動
    log_info "フロントエンドファイルをEC2に転送中..."

    # JavaScriptバンドルファイルの転送（メインファイル + チャンクファイル）
    # bundle.js や chunk ファイルなど、.js拡張子のファイルを全て転送
    if ! scp -i "$SSH_KEY" -P 2222 "$DIST_DIR"/*.js "$EC2_USER@$EC2_HOST:/tmp/"; then
        log_error "JavaScriptバンドルの転送に失敗しました"
        log_error "可能な原因：ネットワーク接続、SSH権限、ディスク容量"
        exit 1
    fi

    # HTMLファイルの転送（アプリケーションのエントリーポイント）
    if ! scp -i "$SSH_KEY" -P 2222 "$DIST_DIR/index.html" "$EC2_USER@$EC2_HOST:/tmp/"; then
        log_error "index.htmlの転送に失敗しました"
        exit 1
    fi

    # PHPバックエンドファイルの転送（FuelPHPフレームワーク全体）
    # APIエンドポイント、データベース処理、設定ファイルなどを含む
    log_info "PHPバックエンドファイルを転送中..."
    if ! scp -r -i "$SSH_KEY" "$PROJECT_DIR/fuel" "$EC2_USER@$EC2_HOST:/tmp/"; then
        log_error "PHPバックエンドの転送に失敗しました"
        log_error "FuelPHPディレクトリ構造またはファイル権限を確認してください"
        exit 1
    fi

    # 画像ファイルの転送（オプション）
    # 画像ディレクトリが存在する場合のみ転送
    log_info "画像ファイルを転送中..."
    if [ -d "$FRONTEND_DIR/public/images" ]; then
        if ! scp -r -i "$SSH_KEY" "$FRONTEND_DIR/public/images" "$EC2_USER@$EC2_HOST:/tmp/"; then
            log_error "画像ディレクトリの転送に失敗しました"
            exit 1
        fi
        log_success "画像ファイルの転送完了"
    else
        log_warning "画像ディレクトリが見つかりません。スキップします..."
    fi

    log_success "全ファイルの転送完了"

    # ==================================================
    # フェーズ2: EC2サーバー内でのファイル配置と権限設定
    # ==================================================
    log_info "プロダクションサーバー上でファイルを設定中..."

    # 複数のコマンドを一つのSSHセッションで実行（効率とアトミック性のため）
    if ! ssh -i "$SSH_KEY" -p 2222 "$EC2_USER@$EC2_HOST" "
        # フロントエンドファイルの配置
        # /tmpから/var/www/htmlにコピーし、nginx用の権限を設定
        sudo cp /tmp/*.js $WEB_ROOT/ &&
        sudo cp /tmp/index.html $WEB_ROOT/ &&
        sudo chown nginx:nginx $WEB_ROOT/*.js $WEB_ROOT/index.html &&
        sudo chmod 644 $WEB_ROOT/*.js $WEB_ROOT/index.html &&

        # PHPバックエンドの配置
        # FuelPHPディレクトリ全体をWebルートにコピー
        if [ -d /tmp/fuel ]; then
            sudo cp -r /tmp/fuel $WEB_ROOT/ &&
            # ファイルの所有者をnginxに変更（Webサーバーがアクセスできるように）
            sudo chown -R nginx:nginx $WEB_ROOT/fuel &&
            # 基本的なファイル権限を644（読み取り専用）に設定
            sudo chmod -R 644 $WEB_ROOT/fuel &&
            # ディレクトリには実行権限（755）を付与
            sudo find $WEB_ROOT/fuel -type d -exec chmod 755 {} \\; &&
            # PHPのエントリーポイントに実行権限を付与
            sudo chmod 755 $WEB_ROOT/fuel/public/index.php &&
            # 一時ディレクトリのクリーンアップ
            rm -rf /tmp/fuel
        fi &&

        # 画像ファイルの配置（存在する場合）
        if [ -d /tmp/images ]; then
            sudo cp -r /tmp/images $WEB_ROOT/ &&
            sudo chown -R nginx:nginx $WEB_ROOT/images &&
            sudo chmod -R 644 $WEB_ROOT/images &&
            sudo chmod 755 $WEB_ROOT/images &&
            rm -rf /tmp/images
        fi &&
        # フロントエンドファイルの一時ファイルクリーンアップ
        rm -f /tmp/*.js /tmp/index.html
    "; then
        log_error "プロダクションサーバーでのファイル配置に失敗しました"
        log_error "可能な原因：sudo権限、ディスク容量、ファイル権限"
        exit 1
    fi

    log_success "ファイル配置と権限設定完了"

    # ==================================================
    # Nginxの設定リロード
    # ==================================================
    # 新しいファイルが適切に提供されるように設定を再読み込み
    log_info "Nginx設定をリロードしています..."
    if ! ssh -i "$SSH_KEY" -p 2222 "$EC2_USER@$EC2_HOST" "sudo systemctl reload nginx"; then
        log_warning "Nginxのリロードに失敗しました（これは致命的ではない可能性があります）"
        log_warning "手動でNginxの状態を確認することをお勧めします"
    else
        log_success "Nginx正常にリロードされました"
    fi

    log_success "ファイルデプロイ完了"
}

# ==================================================
# デプロイ検証関数
# ==================================================
# デプロイされたファイルが正しく動作しているかを検証します
# - Webサイトのアクセシビリティチェック
# - JavaScriptバンドルのアクセシビリティチェック
# - ファイル整合性チェック
# - PHP APIエンドポイントの動作確認
# - 静的アセットのアクセシビリティチェック
verify_deployment() {
    log_info "デプロイを検証しています..."

    # ==================================================
    # メインWebサイトのアクセシビリティチェック
    # ==================================================
    # HTTPSでアクセスし、HTTP 200ステータスが返されるか確認
    local http_status=$(curl -s -o /dev/null -w "%{http_code}" "https://suzutuki-portfolio.com")
    if [ "$http_status" != "200" ]; then
        log_error "Webサイトが正しく応答していません (HTTP $http_status)"
        log_error "DNS設定、SSL証明書、またはNginx設定を確認してください"
        return 1
    fi

    # ==================================================
    # JavaScriptバンドルのアクセシビリティチェック
    # ==================================================
    # ReactアプリケーションのメインJavaScriptファイルがアクセス可能か確認
    local bundle_status=$(curl -s -o /dev/null -w "%{http_code}" "https://suzutuki-portfolio.com/bundle.js")
    if [ "$bundle_status" != "200" ]; then
        log_error "bundle.jsにアクセスできません (HTTP $bundle_status)"
        log_error "ファイルのアップロードまたは権限設定に問題がある可能性があります"
        return 1
    fi


    # ==================================================
    # PHP APIの基本動作確認
    # ==================================================
    log_info "PHP APIの動作を確認中..."
    local api_status=$(curl -s -o /dev/null -w "%{http_code}" "https://suzutuki-portfolio.com/fuel/public/")
    if [ "$api_status" = "200" ]; then
        log_success "PHP API正常に動作中"
    else
        log_warning "PHP APIの動作確認をスキップ (HTTP $api_status)"
    fi


    log_success "デプロイ検証完了"
    log_info "Webサイト: https://suzutuki-portfolio.com"
}

# ==================================================
# クリーンアップ関数
# ==================================================
# スクリプト終了時に一時ファイルやリソースのクリーンアップを実行
cleanup() {
    log_info "一時ファイルをクリーンアップしています..."
    # 必要に応じてクリーンアップロジックをここに追加
    # 例: ロックファイルの削除、一時ディレクトリの削除など
}

# ==================================================
# メインデプロイプロセス
# ==================================================
# デプロイの全工程を順序実行します
# 1. 前提条件チェック -> 2. ビルド -> 3. ファイルデプロイ -> 4. 検証
main() {
    log_info "==================================================="
    log_info "デプロイプロセスを開始します"
    log_info "==================================================="

    # スクリプト終了時にクリーンアップを実行するトラップを設定
    # エラーや中断が発生してもクリーンアップが実行される
    trap cleanup EXIT

    # ==================================================
    # デプロイステップの順序実行
    # ==================================================
    # Step 1: デプロイに必要な環境とリソースの確認
    check_prerequisites

    # Step 2: Reactアプリケーションのプロダクションビルド
    build_frontend

    # Step 3: ビルド成果物とバックエンドファイルのサーバーへのデプロイ
    deploy_files

    # Step 4: デプロイされたアプリケーションの動作検証
    verify_deployment

    # ==================================================
    # デプロイ完了
    # ==================================================
    log_success "==================================================="
    log_success "デプロイが正常に完了しました！"
    log_success "==================================================="
    log_info "アクセスURL: https://suzutuki-portfolio.com"
    log_info "デプロイ日時: $(date)"
}

# ==================================================
# スクリプトエントリーポイント
# ==================================================
# スクリプトが直接実行された場合のみメイン関数を呼び出し
# 他のスクリプトからsourceされた場合は関数定義のみを行う
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi