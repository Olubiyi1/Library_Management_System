import { createLogger,format,transports,addColors } from "winston";
import { once } from "events";

addColors({
  error: "red",
  warn: "yellow",
  info: "blue",
  debug: "gray",
});

const consoleFormat = format.combine(
  format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  format.colorize({ level: true }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, label, message, stack }) => {
    const source = label ?? "Craftora API";

    if (stack) {
      return `${timestamp} [${level}] [${source}] ${message}\n${stack}`;
    }

    return `${timestamp} [${level}] [${source}] ${message}`;
  })
);

export const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transports: [
    new transports.Console({
      format: consoleFormat,
    }),
  ],
  exitOnError: false,
});

export const exitAfterFlush = async () => {
  logger.end();
  await once(logger, "finish");
};