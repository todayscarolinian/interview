"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import {
  userFormSchema,
  type User,
  type UserFormValues,
} from "@/lib/users";

type UserFormDialogProps = {
  mode: "add" | "edit";
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
};

const emptyValues: UserFormValues = {
  name: "",
  email: "",
  department: "",
  avatar: "",
  status: true,
};

export function UserFormDialog({
  mode,
  onClose,
  onSubmit,
  open,
  user,
}: UserFormDialogProps) {
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<UserFormValues>({ defaultValues: emptyValues });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      user
        ? {
            name: user.name,
            email: user.email,
            department: user.department,
            avatar: user.avatar,
            status: user.status,
          }
        : emptyValues,
    );
    clearErrors();
  }, [clearErrors, open, reset, user]);

  const submit = (values: UserFormValues) => {
    const result = userFormSchema.safeParse(values);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (typeof field === "string") {
          setError(field as keyof UserFormValues, { message: issue.message });
        }
      }

      return;
    }

    onSubmit(result.data);
  };

  if (!open) {
    return null;
  }

  return (
    <div
      aria-labelledby="user-form-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#18332d]/35 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
    >
      <button aria-label="Close form" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <section className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3d7764]">
              {mode === "add" ? "New profile" : "Update profile"}
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#18332d]" id="user-form-title">
              {mode === "add" ? "Add a team member" : "Edit team member"}
            </h2>
          </div>
          <button aria-label="Close form" className="rounded-full p-2 text-[#6a8178] hover:bg-[#f0f4f1] hover:text-[#18332d]" onClick={onClose} type="button">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit(submit)} noValidate>
          <Field error={errors.name?.message} label="Name" required>
            <input {...register("name")} autoComplete="name" className={inputClass(Boolean(errors.name))} placeholder="e.g. Winifred Keebler" />
          </Field>
          <Field error={errors.email?.message} label="Email" required>
            <input {...register("email")} autoComplete="email" className={inputClass(Boolean(errors.email))} placeholder="name@company.com" type="email" />
          </Field>
          <Field error={errors.department?.message} label="Department" required>
            <input {...register("department")} className={inputClass(Boolean(errors.department))} placeholder="e.g. Design" />
          </Field>
          <Field error={errors.avatar?.message} label="Avatar URL">
            <input {...register("avatar")} className={inputClass(Boolean(errors.avatar))} placeholder="https://..." type="url" />
          </Field>
          <label className="flex items-center gap-3 text-sm font-medium text-[#38574d]">
            <input {...register("status")} className="size-4 accent-[#3d7764]" type="checkbox" />
            Active team member
          </label>
          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button className="h-10 rounded-xl px-4 text-sm font-semibold text-[#557069] hover:bg-[#f0f4f1]" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="h-10 rounded-xl bg-[#18332d] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#2b5248] disabled:cursor-not-allowed disabled:opacity-50" disabled={isSubmitting} type="submit">
              {mode === "add" ? "Add member" : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({
  children,
  error,
  label,
  required,
}: {
  children: React.ReactNode;
  error?: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#38574d]">
      <span>
        {label}
        {required && <span className="ml-1 text-[#a7523a]" aria-hidden="true">*</span>}
      </span>
      {children}
      {error && <span className="text-xs font-normal text-[#a7523a]">{error}</span>}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return `h-10 rounded-xl border bg-[#f8faf8] px-3 text-sm text-[#18332d] outline-none placeholder:text-[#8da098] focus:bg-white focus:ring-3 ${hasError ? "border-[#d6846c] focus:border-[#a7523a] focus:ring-[#f8ddd5]" : "border-[#dce5df] focus:border-[#79a38d] focus:ring-[#dcebe2]"}`;
}