import { ZodSchema } from "zod";


export const validateMiddleware = (schema: ZodSchema) => (req, res, next) => {
    try {
        const result = schema.safeParse(req.body)
        req.body = result
        console.log(result)
        next()
    } catch (error) {
        console.error( 'validateMiddleware ERROR', error)
    }
   
    }
