const fs = require('fs');
const path = require('path');

// Определяем путь к файлу
const filePath = path.join(__dirname, 'text.txt');

// Создаем ReadStream из файла
const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

// Направляем поток чтения в стандартный поток вывода
readStream.pipe(process.stdout);
