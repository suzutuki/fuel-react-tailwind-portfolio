#!/bin/bash
# ===================================================================
# 汎用CloudFormationデプロイスクリプト
# 目的: どこでも使い回せる設定可能なデプロイツール
# 特徴: 設定ファイル読み込み、エラーハンドリング、ログ出力
# ===================================================================

set -e  # エラー時即座に停止

# ===================================================================
# 基本設定とヘルプ表示
# ===================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

show_help() {
    echo "🚀 汎用CloudFormationデプロイスクリプト"
    echo ""
    echo "使用方法:"
    echo "  $0 <keypair-name> [options]"
    echo ""
    echo "引数:"
    echo "  keypair-name     SSH接続用のEC2 Key Pair名"
    echo ""
    echo "オプション:"
    echo "  --config FILE    設定ファイルパス（デフォルト: config/deploy-config.sh）"
    echo "  --region REGION  AWSリージョン（設定ファイルの値を上書き）"
    echo "  --env ENV        環境名（設定ファイルの値を上書き）"
    echo "  --project NAME   プロジェクト名（設定ファイルの値を上書き）"
    echo "  --dry-run        実際の作成は行わず、設定確認のみ"
    echo "  --help           このヘルプを表示"
    echo ""
    echo "例:"
    echo "  $0 my-keypair                                    # 基本使用"
    echo "  $0 my-keypair --region ap-northeast-1           # 東京リージョン"
    echo "  $0 my-keypair --env staging --project myblog    # カスタム設定"
    echo "  $0 my-keypair --config custom-config.sh         # カスタム設定ファイル"
    echo "  $0 my-keypair --dry-run                         # 設定確認のみ"
}

# ===================================================================
# 引数解析
# ===================================================================
KEYPAIR_NAME=""
CONFIG_FILE="$PROJECT_DIR/config/deploy-config.sh"
DRY_RUN=false
REGION_OVERRIDE=""
ENV_OVERRIDE=""
PROJECT_OVERRIDE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            show_help
            exit 0
            ;;
        --config)
            CONFIG_FILE="$2"
            shift 2
            ;;
        --region)
            REGION_OVERRIDE="$2"
            shift 2
            ;;
        --env)
            ENV_OVERRIDE="$2"
            shift 2
            ;;
        --project)
            PROJECT_OVERRIDE="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --*)
            echo "❌ 不明なオプション: $1"
            show_help
            exit 1
            ;;
        *)
            if [ -z "$KEYPAIR_NAME" ]; then
                KEYPAIR_NAME="$1"
            else
                echo "❌ 不明な引数: $1"
                show_help
                exit 1
            fi
            shift
            ;;
    esac
done

# Key Pair名必須チェック
if [ -z "$KEYPAIR_NAME" ]; then
    echo "❌ エラー: Key Pair名を指定してください"
    show_help
    exit 1
fi

# ===================================================================
# 設定ファイル読み込み
# ===================================================================
echo "📄 設定ファイル読み込み: $CONFIG_FILE"
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
else
    echo "⚠️  設定ファイルが見つかりません。デフォルト値を使用します。"
    # デフォルト設定
    export PROJECT_NAME="${PROJECT_OVERRIDE:-portfolio}"
    export ENVIRONMENT="${ENV_OVERRIDE:-prod}"
    export REGION="${REGION_OVERRIDE:-us-east-1}"
    export INSTANCE_TYPE="t3.micro"
    export STACK_PREFIX="${PROJECT_NAME}-${ENVIRONMENT}"
    export NETWORK_STACK_NAME="${STACK_PREFIX}-network"
    export EC2_STACK_NAME="${STACK_PREFIX}-ec2"
fi

# コマンドライン引数で設定上書き
[ -n "$REGION_OVERRIDE" ] && export REGION="$REGION_OVERRIDE"
[ -n "$ENV_OVERRIDE" ] && export ENVIRONMENT="$ENV_OVERRIDE"
[ -n "$PROJECT_OVERRIDE" ] && export PROJECT_NAME="$PROJECT_OVERRIDE"

# 派生値の再計算
export STACK_PREFIX="${PROJECT_NAME}-${ENVIRONMENT}"
export NETWORK_STACK_NAME="${STACK_PREFIX}-network"
export EC2_STACK_NAME="${STACK_PREFIX}-ec2"

# ===================================================================
# ログ設定
# ===================================================================
LOG_DIR="$PROJECT_DIR/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/deploy-$(date +%Y%m%d-%H%M%S).log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# ===================================================================
# 設定表示
# ===================================================================
log "🚀 CloudFormation汎用デプロイを開始します..."
echo "════════════════════════════════════════"
echo "📋 デプロイ設定"
echo "════════════════════════════════════════"
echo "🏷️  プロジェクト: $PROJECT_NAME"
echo "🌍 環境: $ENVIRONMENT"
echo "📍 リージョン: $REGION"
echo "🔑 Key Pair: $KEYPAIR_NAME"
echo "💻 インスタンスタイプ: ${INSTANCE_TYPE:-t3.micro}"
echo "🏗️  ネットワークスタック: $NETWORK_STACK_NAME"
echo "💾 EC2スタック: $EC2_STACK_NAME"
echo "📝 ログファイル: $LOG_FILE"
echo "════════════════════════════════════════"

if [ "$DRY_RUN" = true ]; then
    echo "🔍 DRY-RUN モード: 実際の作成は行いません"
    echo "設定確認完了。--dry-runオプションを外して実行してください。"
    exit 0
fi

# ===================================================================
# AWS CLI設定確認
# ===================================================================
log "🔧 AWS CLI設定確認中..."
if ! aws sts get-caller-identity --region "$REGION" > /dev/null 2>&1; then
    echo "❌ エラー: AWS CLIが設定されていないか、権限が不足しています"
    echo "aws configure を実行してください"
    exit 1
fi

# ===================================================================
# Key Pair存在確認
# ===================================================================
log "🔑 Key Pair存在確認: $KEYPAIR_NAME"
if ! aws ec2 describe-key-pairs --key-names "$KEYPAIR_NAME" --region "$REGION" > /dev/null 2>&1; then
    echo "❌ エラー: Key Pair '$KEYPAIR_NAME' が見つかりません"
    echo "以下のコマンドでKey Pairを作成してください:"
    echo "aws ec2 create-key-pair --key-name $KEYPAIR_NAME --region $REGION --query 'KeyMaterial' --output text > ${KEYPAIR_NAME}.pem"
    echo "chmod 400 ${KEYPAIR_NAME}.pem"
    exit 1
fi

# ===================================================================
# VPCスタックデプロイ
# ===================================================================
log "🏗️  Step 1: VPCスタックをデプロイ中..."
if aws cloudformation describe-stacks --stack-name "$NETWORK_STACK_NAME" --region "$REGION" > /dev/null 2>&1; then
    log "ℹ️  VPCスタック '$NETWORK_STACK_NAME' は既に存在します"
else
    log "VPCスタック作成中..."
    aws cloudformation create-stack \
        --stack-name "$NETWORK_STACK_NAME" \
        --template-body file://"$PROJECT_DIR/templates/01-vpc-network.yaml" \
        --parameters ParameterKey=ProjectName,ParameterValue="$PROJECT_NAME" \
                     ParameterKey=Environment,ParameterValue="$ENVIRONMENT" \
        --region "$REGION" || {
            log "❌ VPCスタック作成に失敗しました"
            exit 1
        }

    log "⏳ VPCスタックの作成完了を待機中..."
    aws cloudformation wait stack-create-complete \
        --stack-name "$NETWORK_STACK_NAME" \
        --region "$REGION" || {
            log "❌ VPCスタック作成がタイムアウトまたは失敗しました"
            exit 1
        }

    log "✅ VPCスタック作成完了!"
fi

# ===================================================================
# EC2スタックデプロイ
# ===================================================================
log "💻 Step 2: EC2スタックをデプロイ中..."
if aws cloudformation describe-stacks --stack-name "$EC2_STACK_NAME" --region "$REGION" > /dev/null 2>&1; then
    log "ℹ️  EC2スタック '$EC2_STACK_NAME' は既に存在します。更新を試行..."
    aws cloudformation update-stack \
        --stack-name "$EC2_STACK_NAME" \
        --template-body file://"$PROJECT_DIR/templates/02-ec2-instance.yaml" \
        --parameters ParameterKey=ProjectName,ParameterValue="$PROJECT_NAME" \
                     ParameterKey=Environment,ParameterValue="$ENVIRONMENT" \
                     ParameterKey=NetworkStackName,ParameterValue="$NETWORK_STACK_NAME" \
                     ParameterKey=KeyPairName,ParameterValue="$KEYPAIR_NAME" \
                     ParameterKey=InstanceType,ParameterValue="${INSTANCE_TYPE:-t3.micro}" \
        --region "$REGION" 2>/dev/null || log "ℹ️  更新対象の変更がない可能性があります"
else
    log "EC2スタック作成中..."
    aws cloudformation create-stack \
        --stack-name "$EC2_STACK_NAME" \
        --template-body file://"$PROJECT_DIR/templates/02-ec2-instance.yaml" \
        --parameters ParameterKey=ProjectName,ParameterValue="$PROJECT_NAME" \
                     ParameterKey=Environment,ParameterValue="$ENVIRONMENT" \
                     ParameterKey=NetworkStackName,ParameterValue="$NETWORK_STACK_NAME" \
                     ParameterKey=KeyPairName,ParameterValue="$KEYPAIR_NAME" \
                     ParameterKey=InstanceType,ParameterValue="${INSTANCE_TYPE:-t3.micro}" \
        --region "$REGION" || {
            log "❌ EC2スタック作成に失敗しました"
            exit 1
        }

    log "⏳ EC2スタックの作成完了を待機中..."
    aws cloudformation wait stack-create-complete \
        --stack-name "$EC2_STACK_NAME" \
        --region "$REGION" || {
            log "❌ EC2スタック作成がタイムアウトまたは失敗しました"
            exit 1
        }

    log "✅ EC2スタック作成完了!"
fi

# ===================================================================
# デプロイ結果表示
# ===================================================================
log "🎉 デプロイ完了! 結果を表示中..."

PUBLIC_IP=$(aws cloudformation describe-stacks \
    --stack-name "$EC2_STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`PublicIP`].OutputValue' \
    --output text 2>/dev/null)

WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name "$EC2_STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text 2>/dev/null)

SSH_COMMAND=$(aws cloudformation describe-stacks \
    --stack-name "$EC2_STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`SSHCommand`].OutputValue' \
    --output text 2>/dev/null)

echo ""
echo "═══════════════════════════════════════════════════"
echo "🎯 デプロイ完了情報"
echo "═══════════════════════════════════════════════════"
echo "🌐 パブリックIP: $PUBLIC_IP"
echo "🔗 WebサイトURL: $WEBSITE_URL"
echo "🔧 SSH接続: $SSH_COMMAND"
echo "📝 ログファイル: $LOG_FILE"
echo ""
echo "📋 次のステップ:"
echo "1. WebサイトURL にアクセスして動作確認"
echo "2. SSH接続でサーバーにログイン"
echo "3. アプリケーションファイルのアップロード"
echo "═══════════════════════════════════════════════════"

log "🎊 デプロイプロセス完了"