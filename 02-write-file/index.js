const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const filename = path.join(__dirname, 'text.txt');

stdout.write('Введите текст\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    console.log('Программа завершена');
    process.exit();
  }

  fs.appendFile(filename, data, (err) => {
    if (err) throw err;
    console.log(`Текст "${data.toString().trim()}" успешно добавлен в файл "${filename}"`);
  });
});

process.on('SIGINT', () => {
  console.log('\nПрограмма завершена');
  process.exit();
});
