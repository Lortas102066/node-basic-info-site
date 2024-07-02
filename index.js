const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    // Build file path
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    // Correct file path if no file extension is present and it is not a directory request
    if (!path.extname(filePath)) {
        filePath += '.html';  // Assume it's an HTML file if no extension is specified
    }

    // Extension of file
    let extname = path.extname(filePath);

    // Initial Content Type
    let contentType = 'text/html';

    // Check ext and set content type
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        default:
            // If no recognized extension, default to HTML
            contentType = 'text/html';
    }

    // Read File
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == 'ENOENT') {
                // File not found, serve 404 page
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                    res.writeHead(404, {'Content-Type': 'text/html'});  // Use 404 status code
                    res.end(content, 'utf-8');
                });
            } else {
                // Some server error
                res.writeHead(500);
                res.end(`Server error: ${err.code}`);
            }
        } else {
            // Serve the file
            res.writeHead(200, {'Content-Type': contentType});
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, function () {
    console.log(`Server Running on port ${PORT}`);
});
