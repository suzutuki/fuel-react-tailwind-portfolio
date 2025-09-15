#!/bin/bash
# ===================================================================
# Let's Encrypt SSL証明書設定スクリプト
# EC2インスタンスでHTTPS化を自動実行
# ===================================================================

set -e  # エラー時即座に停止

# ログ設定
exec > >(tee /var/log/ssl-setup.log) 2>&1
echo "=== SSL Setup started at $(date) ==="

# 環境変数
DOMAIN="suzutuki-portfolio.com"
WWW_DOMAIN="www.suzutuki-portfolio.com"
EMAIL="renath31@gmail.com"

echo "Setting up SSL for domains: $DOMAIN, $WWW_DOMAIN"

# パッケージ更新
echo "Updating packages..."
yum update -y

# EPEL repository and certbot installation
echo "Installing certbot..."
amazon-linux-extras install epel -y
yum install -y certbot python3-certbot-nginx

# Nginx設定の確認
echo "Checking Nginx configuration..."
nginx -t

# Let's Encrypt証明書取得
echo "Obtaining SSL certificate..."
certbot --nginx \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --domains "$DOMAIN,$WWW_DOMAIN" \
    --redirect

# Nginx再起動
echo "Restarting Nginx..."
systemctl restart nginx

# 自動更新設定
echo "Setting up automatic renewal..."
echo "0 12 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx" | crontab -

# SSL設定確認
echo "SSL configuration completed!"
echo "Testing SSL certificate..."
certbot certificates

# ファイアウォール設定（HTTPS用）
echo "Configuring firewall for HTTPS..."
iptables -I INPUT -p tcp --dport 443 -j ACCEPT
service iptables save

echo "=== SSL Setup completed successfully at $(date) ==="
echo "Website is now available at:"
echo "  https://$DOMAIN"
echo "  https://$WWW_DOMAIN"