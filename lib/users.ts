import { z } from "zod";

export const USERS_API_URL =
  "https://6a9c31af0ad174e139e91538.mockapi.io/api/users";

export type User = {
  id: string;
  createdAt: string;
  name: string;
  avatar: string;
  email: string;
  department: string;
  status: boolean;
};

export const userFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  department: z.string().trim().min(1, "Department is required."),
  avatar: z
    .string()
    .trim()
    .refine((value) => value === "" || z.url().safeParse(value).success, "Enter a valid image URL."),
  status: z.boolean(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export function isUser(value: unknown): value is User {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === "string" &&
    typeof user.createdAt === "string" &&
    typeof user.name === "string" &&
    typeof user.avatar === "string" &&
    typeof user.email === "string" &&
    typeof user.department === "string" &&
    typeof user.status === "boolean"
  );
}

export function isUserList(value: unknown): value is User[] {
  return Array.isArray(value) && value.every(isUser);
}