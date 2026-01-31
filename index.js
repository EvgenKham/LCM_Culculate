
const http = require('http');
const url = require('url');

const YOUR_EMAIL = 'hamitcevich@gmail.com';
const EMAIL_PATH = YOUR_EMAIL.toLowerCase().replace(/[^a-z0-9]/g, '_');

function parseBigIntSafe(str) {
  try {
    const cleaned = String(str).replace(/[^0-9\-]/g, '');
    if (!cleaned || cleaned === '-') return null;

    const num = BigInt(cleaned);
    return num;
  } catch (error) {
    return null;
  }
}

function gcdBigInt(a, b) {
  while (b !== 0n) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function lcmBigInt(x, y) {
  if (x === 0n || y === 0n) return 0n;
  const absX = x < 0n ? -x : x;
  const absY = y < 0n ? -y : y;
  return (absX * absY) / gcdBigInt(absX, absY);
}

function isNaturalBigInt(num) {
  return num !== null && typeof num === 'bigint' && num > 0n;
}

function canUseNumber(num) {
  return num <= Number.MAX_SAFE_INTEGER && num >= Number.MIN_SAFE_INTEGER;
}

function calculateLCM(xStr, yStr) {
  const xBig = parseBigIntSafe(xStr);
  const yBig = parseBigIntSafe(yStr);

  if (isNaturalBigInt(xBig) && isNaturalBigInt(yBig)) {
    const result = lcmBigInt(xBig, yBig);
    return result.toString();
  }

  const xNum = parseInt(String(xStr).replace(/[^0-9\-]/g, '')) || NaN;
  const yNum = parseInt(String(yStr).replace(/[^0-9\-]/g, '')) || NaN;

  if (Number.isInteger(xNum) && Number.isInteger(yNum) && xNum > 0 && yNum > 0) {
    if (xNum > Number.MAX_SAFE_INTEGER || yNum > Number.MAX_SAFE_INTEGER) {
      return 'NaN';
    }
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    const result = Math.abs(xNum * yNum) / gcd(xNum, yNum);
    return result.toString();
  }

  return 'NaN';
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  if (parsed.pathname !== '/' + EMAIL_PATH) {
    res.statusCode = 404;
    res.end('404 - Use /' + EMAIL_PATH + '?x=number&y=number');
    return;
  }

  const xStr = parsed.query.x || '';
  const yStr = parsed.query.y || '';

  const result = calculateLCM(xStr, yStr);

  res.end(result);
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