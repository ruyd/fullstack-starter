/* eslint-disable no-console */
import express from 'express'
import axios from 'axios'
import winston from 'winston'
import { config } from './config'
import { decodeToken } from './auth'

const format = winston.format.combine(winston.format.timestamp(), winston.format.simple())
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new winston.transports.File({
      filename: '_error.log',
      level: 'error',
      format,
    }),
    new winston.transports.File({
      filename: '_trace.log',
      format,
    }),
  ],
})

export function traceRoutesMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const methods = ['POST', 'PUT', 'PATCH', 'DELETE']
  const endpoints = ['/cart']
  if (!config.trace || !endpoints.includes(req.originalUrl) || !methods.includes(req.method)) {
    return next()
  }
  const token = req.headers.authorization?.replace('Bearer ', '') || ''
  console.log('Token: ', token)
  const decoded = decodeToken(token)
  console.table({
    method: req.method,
    endpoint: req.originalUrl,
    tokenOk: !!decoded,
    userId: decoded?.userId,
  })
  if (req.body) {
    console.table(req.body)
  }
  next()
}

export function activateAxiosTrace() {
  axios.interceptors.request.use(req => {
    console.log(req.method?.toUpperCase() || 'Request', req.url, config.trace ? req.data : '')
    return req
  })

  axios.interceptors.response.use(req => {
    console.log('> Response:', req.status, req.statusText, config.trace ? req.data : '')
    return req
  })
}

export default logger
