import { Response } from 'express';

export const baseHandler = (response: Response, callback: () => Promise<any>): Promise<any> => callback()
    .then(result => response.status(200).json(result))
    .catch(err => response.status(400).json({
      message: err.message
    }))
