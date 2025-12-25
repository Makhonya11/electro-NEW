import z from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(64),
})

export const registerSchema = loginSchema.extend({
  name: z.string().min(2).max(36).optional(),
  phone: z.string().regex(
     /^\+[1-9]\d{1,14}$/,
  'Invalid phone number'
  ).optional()
})

export const updateProfileSchema = registerSchema.extend({
  image: z.string().optional()
})


