const z = require("zod");

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").trim(),
  lastName: z.string().optional().default(""),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  role: z.enum(["student", "instructor"]).default("student"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").trim(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number({ invalid_type_error: "Price must be a number" }).min(0, "Price must be non-negative"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

const courseUpdateSchema = courseSchema.partial();

module.exports = { signupSchema, loginSchema, courseSchema, courseUpdateSchema };
