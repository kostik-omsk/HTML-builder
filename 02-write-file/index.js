const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const filename = path.join(__dirname, 'text.txt');

fs.writeFile(filename, '', (err) => {
  if (err) throw err;
});

stdout.write('Введите текст\n');

const exit = () => {
  console.log('Программа завершена');
  process.exit();
};

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') exit();

  fs.appendFile(filename, data, (err) => {
    if (err) throw err;
    console.log(`Текст "${data.toString().trim()}" успешно добавлен в файл "${filename}"`);
  });
});

process.on('SIGINT', exit);
