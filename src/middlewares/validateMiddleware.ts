import { ZodSchema } from "zod";


export const validateMiddleware = (schema: ZodSchema) => (req, res, next) => {
    try {
        const result = schema.parse(req.body)
        req.body = result
        next()
    } catch (error) {
        console.error( 'validateMiddleware ERROR', error)
    }
   
    }
