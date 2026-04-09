const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 3000;
const FILES_DIR = __dirname;

// Serve static files
app.use(express.static(FILES_DIR));

// API endpoint to list files
app.get('/api/files', (req, res) => {
  const files = [
    'raw_threads_Q2_2025.jsonl',
    'raw_threads_Q3_2025.jsonl',
    'slack_threads_may_01_15.json',
    'EXTRACTION_PROGRESS.md',
    'EXTRACTION_FINAL_STATUS.md',
    'EXTRACTION_SUMMARY.txt'
  ];

  const fileData = files.map(filename => {
    const filepath = path.join(FILES_DIR, filename);
    try {
      const stats = fs.statSync(filepath);
      return {
        name: filename,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2),
        modified: stats.mtime.toISOString(),
        exists: true
      };
    } catch (e) {
      return {
        name: filename,
        size: 0,
        sizeKB: '0',
        modified: null,
        exists: false
      };
    }
  });

  res.json(fileData);
});

// Download endpoint
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(FILES_DIR, filename);

  // Security: prevent directory traversal
  if (!path.resolve(filepath).startsWith(FILES_DIR)) {
    return res.status(403).send('Access denied');
  }

  if (!fs.existsSync(filepath)) {
    return res.status(404).send('File not found');
  }

  res.download(filepath, filename);
});

// Home page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slack Thread Extraction - Download Center</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    
    .header {
      background: white;
      border-radius: 12px;
      padding: 40px;
      margin-bottom: 30px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
    
    .header h1 {
      color: #333;
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    
    .header p {
      color: #666;
      font-size: 1.1em;
      line-height: 1.6;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-top: 30px;
      padding-top: 30px;
      border-top: 2px solid #eee;
    }
    
    .stat {
      text-align: center;
    }
    
    .stat-number {
      font-size: 2em;
      font-weight: bold;
      color: #667eea;
    }
    
    .stat-label {
      color: #666;
      font-size: 0.9em;
      margin-top: 5px;
    }
    
    .files-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
    
    .files-section h2 {
      color: #333;
      margin-bottom: 20px;
      font-size: 1.5em;
    }
    
    .file-list {
      display: grid;
      gap: 15px;
    }
    
    .file-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      transition: all 0.3s ease;
    }
    
    .file-item:hover {
      background: #f0f1f5;
      transform: translateX(5px);
    }
    
    .file-info {
      flex: 1;
    }
    
    .file-name {
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 0.95em;
    }
    
    .file-meta {
      display: flex;
      gap: 20px;
      font-size: 0.85em;
      color: #999;
    }
    
    .file-meta span {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .download-btn {
      padding: 10px 20px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      font-size: 0.9em;
    }
    
    .download-btn:hover {
      background: #5568d3;
      transform: scale(1.05);
    }
    
    .download-btn:active {
      transform: scale(0.98);
    }
    
    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75em;
      font-weight: 600;
    }
    
    .status-exists {
      background: #d4edda;
      color: #155724;
    }
    
    .status-missing {
      background: #f8d7da;
      color: #721c24;
    }
    
    .loading {
      text-align: center;
      color: #666;
      padding: 40px;
    }
    
    .error {
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .footer {
      text-align: center;
      color: white;
      margin-top: 30px;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📥 Slack Thread Extraction</h1>
      <p>Download extracted threads and documentation from channel C059RGKCP0U (product-deliverect-direct)</p>
      
      <div class="stats">
        <div class="stat">
          <div class="stat-number">402</div>
          <div class="stat-label">Threads Identified</div>
        </div>
        <div class="stat">
          <div class="stat-number">181</div>
          <div class="stat-label">Q2 2025 Threads</div>
        </div>
        <div class="stat">
          <div class="stat-number">221</div>
          <div class="stat-label">Q3 2025 Threads</div>
        </div>
      </div>
    </div>
    
    <div class="files-section">
      <h2>Available Files</h2>
      <div class="file-list" id="fileList">
        <div class="loading">⏳ Loading file list...</div>
      </div>
    </div>
    
    <div class="footer">
      <p>Slack Thread Extraction - Q2 & Q3 2025 Data</p>
    </div>
  </div>

  <script>
    async function loadFiles() {
      try {
        const response = await fetch('/api/files');
        const files = await response.json();
        
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';
        
        files.forEach(file => {
          const item = document.createElement('div');
          item.className = 'file-item';
          
          const badge = file.exists 
            ? '<span class="status-badge status-exists">✓ Ready</span>'
            : '<span class="status-badge status-missing">✗ Missing</span>';
          
          const modifiedDate = file.modified 
            ? new Date(file.modified).toLocaleString()
            : 'N/A';
          
          item.innerHTML = \`
            <div class="file-info">
              <div class="file-name">\${file.name}</div>
              <div class="file-meta">
                <span>📦 \${file.sizeKB} KB</span>
                <span>📅 \${modifiedDate}</span>
                \${badge}
              </div>
            </div>
            <button class="download-btn" 
                    onclick="downloadFile('\${file.name}')"
                    \${file.exists ? '' : 'disabled'}>
              Download
            </button>
          \`;
          
          fileList.appendChild(item);
        });
      } catch (error) {
        console.error('Error loading files:', error);
        document.getElementById('fileList').innerHTML = 
          '<div class="error">Error loading file list: ' + error.message + '</div>';
      }
    }
    
    function downloadFile(filename) {
      window.location.href = '/download/' + filename;
    }
    
    // Load files on page load
    loadFiles();
    
    // Refresh file list every 5 seconds
    setInterval(loadFiles, 5000);
  </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Slack Thread Extraction - Download Server                ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  🚀 Server running at: http://localhost:${PORT}            ║
║                                                            ║
║  📁 Files location: ${FILES_DIR}               ║
║                                                            ║
║  Available files:                                          ║
║  • raw_threads_Q2_2025.jsonl                              ║
║  • raw_threads_Q3_2025.jsonl                              ║
║  • slack_threads_may_01_15.json                           ║
║  • EXTRACTION_PROGRESS.md                                 ║
║  • EXTRACTION_FINAL_STATUS.md                             ║
║  • EXTRACTION_SUMMARY.txt                                 ║
║                                                            ║
║  Press Ctrl+C to stop the server                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});
