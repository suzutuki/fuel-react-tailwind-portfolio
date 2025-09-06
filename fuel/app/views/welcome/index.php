<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FuelPHP + React + TypeScript + TailwindCSS</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        .card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            margin: 20px 0;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        h2 {
            font-size: 1.5rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        .tech-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .tech-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .button {
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 25px;
            margin: 10px;
            transition: all 0.3s;
        }
        .button:hover {
            background: #45a049;
            transform: translateY(-2px);
        }
        .status {
            background: rgba(76, 175, 80, 0.2);
            border: 1px solid #4CAF50;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>🚀 プロジェクトセットアップ完了！</h1>
            <h2>FuelPHP + React + TypeScript + TailwindCSS</h2>
            
            <div class="status">
                ✅ プロジェクトの基本構成が完了しました
            </div>

            <div class="tech-grid">
                <div class="tech-item">
                    <h3>⚡ FuelPHP</h3>
                    <p>バックエンドAPI</p>
                </div>
                <div class="tech-item">
                    <h3>⚛️ React</h3>
                    <p>フロントエンドUI</p>
                </div>
                <div class="tech-item">
                    <h3>📘 TypeScript</h3>
                    <p>型安全開発</p>
                </div>
                <div class="tech-item">
                    <h3>🎨 TailwindCSS</h3>
                    <p>スタイリング</p>
                </div>
            </div>

            <div style="margin-top: 40px;">
                <h3>次のステップ</h3>
                <p>frontendディレクトリで以下のコマンドを実行してください：</p>
                <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; font-family: monospace; margin: 20px 0;">
                    cd frontend<br>
                    npm install<br>
                    npm run dev
                </div>
                <p>開発サーバーは <strong>http://localhost:3000</strong> で起動します</p>
            </div>
        </div>
    </div>
</body>
</html>