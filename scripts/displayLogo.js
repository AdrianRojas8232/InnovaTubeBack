const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  if (input.trim() === 'rs') {
    console.log('Reiniciando la aplicación...');
    rl.close();
    process.exit();
  }
});

rl.prompt();
