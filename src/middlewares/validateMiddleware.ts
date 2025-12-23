import { ZodSchema } from "zod";


export const validateMiddleware = (schema: ZodSchema) => (req, res, next) => {
    const result = schema.parse(req.body)
    if (!result?.success) {
        return res.status(400).json({errors: result.error.flatten});
        }

        req.body = result.data
        next()
    }
