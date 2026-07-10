const http = require('http');

const wsUrl = process.env.AGY_BROWSER_WS_URL || '';
console.log('AGY_BROWSER_WS_URL:', wsUrl);

const match = wsUrl.match(/ws:\/\/127\.0\.0\.1:(\d+)\//);
if (!match) {
  console.log('No port found in AGY_BROWSER_WS_URL');
  process.exit(1);
}

const port = match[1];
console.log('Connecting to devtools on port:', port);

http.get(`http://127.0.0.1:${port}/json/list`, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const list = JSON.parse(data);
      console.log('Open Targets:');
      console.log(JSON.stringify(list, null, 2));
    } catch (e) {
      console.error('Failed to parse response:', e);
      console.log('Raw data:', data);
    }
  });
}).on('error', (err) => {
  console.error('HTTP request failed:', err);
});
