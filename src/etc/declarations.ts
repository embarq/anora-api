import { RequestHandler } from 'express';

export interface ControllerMethods {
  [key: string]: RequestHandler
}
