import winston from "winston";
const {transports, format} = winston;
import split from "split";
import config from '../config/config';


const print = format.printf((info) => {
    const log = `[${info.level.toUpperCase()}]: ${info.message}`;

    return info.stack
        ? `${log}\n${info.stack}`
        : log;
});

let logLevelConsole = config.logger.logLevel;

const logger = winston.createLogger({
    level: logLevelConsole,
    format: format.combine(
        format.errors({stack: true}),
        print,
    ),
    transports: [new transports.Console()],
});

logger.stream = split().on('data', function (line) {
    logger.info(line)
});


export default logger;

