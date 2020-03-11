import config from 'config'
import _ from 'lodash'
import os from 'os'
import pino from 'pino'

import isDebug from './is-debug'

export default function loggerGenerator(
  name: string,
  level?: string,
  labels?: Record<string, string>
): pino.Logger {
  const isDebugMode = isDebug()

  let logLevel = isDebugMode ? 'trace' : 'info'

  if (config.has('logger.level')) {
    logLevel = config.get('logger.level')
  }

  if (level) {
    logLevel = level
  }

  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'testing') {
    logLevel = 'silent'
  }

  const baseLabels = _.assign(
    {
      hostname: os.hostname(),
      pid: process.pid,
    },
    labels
  )

  const logger = pino({
    name,
    level: logLevel,
    base: baseLabels,
    prettyPrint: isDebugMode
      ? {
          translateTime: 'SYS:HH:MM:ss',
          ignore: _.join(_.keys(baseLabels), ','),
        }
      : false,
  })

  return logger
}
