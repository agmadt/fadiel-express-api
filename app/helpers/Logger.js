const winston = require('winston');

const Logger = {

  log: (message = null) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();

    const logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
          new winston.transports.File({ filename: './logs/log-'+year+'-'+month+'-'+date+'.log', level: 'info' }),
      ],
    });

    logger.log({
      level: 'info',
      time: year+'-'+month+'-'+date+' '+hours+':'+minutes+':'+seconds,
      message: message,
    })
  }

}

module.exports = Logger;