process.env.NODE_ENV = 'test';

const path = require('path');
const spawn = require('child-process-promise').spawn;

const spawnOptions = { stdio: 'inherit' };

(async () => {
  try {
    await spawn('./node_modules/.bin/sequelize', ['db:migrate:undo:all'], spawnOptions);
    await spawn('./node_modules/.bin/sequelize', ['db:migrate'], spawnOptions);
    await spawn('./node_modules/.bin/sequelize', ['db:seed:all'], spawnOptions);
    console.log('*************************');
    console.log('Migration successful');
  } catch (err) {
    console.log('*************************');
    console.log('Migration failed. Error:', err.message);
    process.exit(1);
  }

  process.exit(0);
})();