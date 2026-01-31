
const http = require('http');
const url = require('url');

const YOUR_EMAIL = 'hamitcevich@gmail.com';

const EMAIL_PATH = YOUR_EMAIL.toLowerCase().replace(/[^a-z0-9]/g, '_');

function findGCD(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function findLCM(x, y) {
  if (x === 0 || y === 0) return 0;
  return Math.abs(x * y) / findGCD(x, y);
}

function isNatural(num) {
  return Number.isInteger(num) && num > 0;
}

function safeParseInt(param) {
  if (param === undefined || param === null) return NaN;
  const cleaned = String(param).replace(/[^0-9\-]/g, '');
  const result = parseInt(cleaned);
  return isNaN(result) ? NaN : result;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  const expectedPath = '/' + EMAIL_PATH;

  if (pathname !== expectedPath) {
    res.statusCode = 404;
    res.end(`404 - Use path: ${expectedPath}?x=number&y=number`);
    return;
  }

  const x = safeParseInt(query.x);
  const y = safeParseInt(query.y);

  if (isNaN(x) || isNaN(y) || !isNatural(x) || !isNatural(y)) {
    res.end('NaN');
    return;
  }

  const result = findLCM(x, y);
  res.end(result.toString());
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('✅ Сервер НОК запущен!');
  console.log('='.repeat(50));
  console.log(`📧 Ваш email: ${YOUR_EMAIL}`);
  console.log(`📍 Email путь: /${EMAIL_PATH}`);
  console.log(`🔗 Основной URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
  console.log(`🎯 Целевой URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/${EMAIL_PATH}?x={}&y={}`);
  console.log('\n📋 Примеры запросов:');
  console.log(`1. https://.../${EMAIL_PATH}?x=12&y=18 → "36"`);
  console.log(`2. https://.../${EMAIL_PATH}?x=7&y=5 → "35"`);
  console.log(`3. https://.../${EMAIL_PATH}?x=0&y=5 → "NaN"`);
  console.log(`4. https://.../${EMAIL_PATH}?x={8}&y={6} → "24"`);
  console.log('='.repeat(50));
});