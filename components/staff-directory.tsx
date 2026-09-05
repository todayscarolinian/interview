"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserFormDialog } from "@/components/user-form-dialog";
import {
  isUserList,
  type User,
  type UserFormValues,
  USERS_API_URL,
} from "@/lib/users";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function StaffDirectory() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadUsers = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(USERS_API_URL, { signal });

      if (!response.ok) {
        throw new Error("We could not reach the staff directory.");
      }

      const data: unknown = await response.json();

      if (!isUserList(data)) {
        throw new Error("The staff directory returned an unexpected response.");
      }

      setUsers(data);
    } catch (fetchError) {
      if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
        return;
      }

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Something went wrong while loading the staff directory.",
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  const openAddForm = () => {
    setFormMode("add");
    setSelectedUser(null);
    setSuccessMessage(null);
    setFormOpen(true);
  };

  const openEditForm = (user: User) => {
    setFormMode("edit");
    setSelectedUser(user);
    setSuccessMessage(null);
    setFormOpen(true);
  };

  const saveUser = (values: UserFormValues) => {
    if (formMode === "edit" && selectedUser) {
      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === selectedUser.id ? { ...user, ...values } : user)),
      );
      setSuccessMessage(`${values.name} was updated successfully.`);
    } else {
      const newUser: User = {
        ...values,
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setUsers((currentUsers) => [newUser, ...currentUsers]);
      setPage(1);
      setSuccessMessage(`${values.name} was added successfully.`);
    }

    setFormOpen(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    const loadTask = window.setTimeout(() => {
      void loadUsers(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(loadTask);
      controller.abort();
    };
  }, [loadUsers]);

  return (
    <main className="min-h-screen bg-[#f5f7f4] text-[#18332d]">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <header className="mb-10 flex flex-col gap-6 border-b border-[#cbd8d1] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#3d7764]">
              People operations
            </p>
            <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">Staff directory</h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-[#557069]">
              Find the people who keep the organization moving.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-full border border-[#cbd8d1] bg-white px-4 py-2 text-sm text-[#557069]">
              <Users className="size-4 text-[#3d7764]" aria-hidden="true" />
              <span>{isLoading ? "Loading directory" : `${users.length} team members`}</span>
            </div>
            {!isLoading && !error && (
              <Button onClick={openAddForm}>
                <Plus aria-hidden="true" />
                Add user
              </Button>
            )}
          </div>
        </header>

        {isLoading && <LoadingState />}

        {error && (
          <section className="flex flex-col items-start gap-5 rounded-2xl border border-[#e4b8a9] bg-[#fff8f5] p-6 sm:p-8" role="alert">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-[#a7523a]" aria-hidden="true" />
              <div>
                <h2 className="font-semibold text-[#6f3021]">Directory unavailable</h2>
                <p className="mt-1 text-sm leading-6 text-[#8d594a]">{error}</p>
              </div>
            </div>
            <Button onClick={() => void loadUsers()} variant="outline">
              <RefreshCw aria-hidden="true" />
              Try again
            </Button>
          </section>
        )}

        {!isLoading && !error && (
          <>
            {successMessage && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#b8dbc3] bg-[#f1faf3] px-4 py-3 text-sm font-medium text-[#34704a]" role="status">
                <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
                {successMessage}
              </div>
            )}
            <DirectoryResults
            department={department}
            onDepartmentChange={(value) => {
              setDepartment(value);
              setPage(1);
            }}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            page={page}
            search={search}
            setPage={setPage}
            users={users}
            onEdit={openEditForm}
            />
          </>
        )}
      </div>
      <UserFormDialog
        mode={formMode}
        onClose={() => setFormOpen(false)}
        onSubmit={saveUser}
        open={formOpen}
        user={selectedUser}
      />
    </main>
  );
}

function DirectoryResults({
  department,
  onDepartmentChange,
  onSearchChange,
  page,
  search,
  setPage,
  users,
  onEdit,
}: {
  department: string;
  onDepartmentChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  page: number;
  search: string;
  setPage: (page: number) => void;
  users: User[];
  onEdit: (user: User) => void;
}) {
  const departments = Array.from(new Set(users.map((user) => user.department))).sort();
  const normalizedSearch = search.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !normalizedSearch ||
      user.name.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch);
    const matchesDepartment = department === "all" || user.department === department;

    return matchesSearch && matchesDepartment;
  });
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleUsers = filteredUsers.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <>
      <section aria-label="Directory filters" className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#dce5df] bg-white p-3 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search by name or email</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7b9087]" aria-hidden="true" />
          <input
            className="h-10 w-full rounded-xl border border-transparent bg-[#f5f7f4] pl-10 pr-10 text-sm text-[#18332d] outline-none transition-colors placeholder:text-[#8da098] focus:border-[#79a38d] focus:bg-white focus:ring-3 focus:ring-[#dcebe2]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search name or email"
            type="search"
            value={search}
          />
          {search && (
            <button
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b9087] hover:text-[#18332d]"
              onClick={() => onSearchChange("")}
              type="button"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </label>
        <label>
          <span className="sr-only">Filter by department</span>
          <select
            className="h-10 w-full rounded-xl border border-transparent bg-[#f5f7f4] px-3 text-sm text-[#18332d] outline-none focus:border-[#79a38d] focus:bg-white focus:ring-3 focus:ring-[#dcebe2] sm:w-52"
            onChange={(event) => onDepartmentChange(event.target.value)}
            value={department}
          >
            <option value="all">All departments</option>
            {departments.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </section>

      <div className="mb-4 flex items-center justify-between gap-4 text-sm text-[#6a8178]">
        <p>
          Showing {filteredUsers.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–
          {Math.min(safePage * pageSize, filteredUsers.length)} of {filteredUsers.length} members
        </p>
        {filteredUsers.length > 0 && <p>Page {safePage} of {pageCount}</p>}
      </div>

      {filteredUsers.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-[#cbd8d1] bg-white p-10 text-center">
          <h2 className="font-serif text-2xl">No matching team members</h2>
          <p className="mt-2 text-sm text-[#557069]">Try a different name, email, or department.</p>
        </section>
      ) : (
        <>
          <UserList onEdit={onEdit} users={visibleUsers} />
          <nav aria-label="Directory pagination" className="mt-6 flex items-center justify-center gap-2">
            <Button
              aria-label="Previous page"
              disabled={safePage === 1}
              onClick={() => setPage(safePage - 1)}
              size="icon"
              variant="outline"
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <Button
                aria-current={pageNumber === safePage ? "page" : undefined}
                aria-label={`Page ${pageNumber}`}
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                variant={pageNumber === safePage ? "default" : "ghost"}
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              aria-label="Next page"
              disabled={safePage === pageCount}
              onClick={() => setPage(safePage + 1)}
              size="icon"
              variant="outline"
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </nav>
        </>
      )}
    </>
  );
}

function LoadingState() {
  return (
    <section aria-label="Loading staff directory" className="grid gap-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="flex animate-pulse items-center gap-4 rounded-2xl border border-[#dce5df] bg-white p-4" key={index}>
          <div className="size-12 rounded-full bg-[#e3ebe6]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-[#e3ebe6]" />
            <div className="h-3 w-1/2 rounded bg-[#edf2ee]" />
          </div>
        </div>
      ))}
    </section>
  );
}

function UserList({ onEdit, users }: { onEdit: (user: User) => void; users: User[] }) {
  if (users.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-[#cbd8d1] bg-white p-10 text-center">
        <h2 className="font-serif text-2xl">No team members found</h2>
        <p className="mt-2 text-sm text-[#557069]">There are no users to display right now.</p>
      </section>
    );
  }

  return (
    <section aria-label="Staff members" className="grid gap-3">
      {users.map((user) => (
        <article className="group flex flex-col gap-4 rounded-2xl border border-[#dce5df] bg-white p-4 shadow-[0_2px_12px_rgba(24,51,45,0.03)] transition-shadow hover:shadow-[0_8px_24px_rgba(24,51,45,0.08)] sm:flex-row sm:items-center sm:p-5" key={user.id}>
          <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#dcebe2] font-semibold text-[#3d7764]">
            <span aria-hidden="true">{getInitials(user.name)}</span>
            {user.avatar && (
              <Image
                alt=""
                className="absolute inset-0 size-full object-cover"
                height={56}
                src={user.avatar}
                width={56}
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-[#18332d]">{user.name}</h2>
            <div className="mt-1 flex flex-col gap-1 text-sm text-[#6a8178] sm:flex-row sm:gap-4">
              <span className="flex min-w-0 items-center gap-1.5 truncate">
                <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <BriefcaseBusiness className="size-3.5 shrink-0" aria-hidden="true" />
                {user.department}
              </span>
            </div>
          </div>
          <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${user.status ? "bg-[#e4f2e8] text-[#34704a]" : "bg-[#f0f2f0] text-[#718079]"}`}>
            {user.status ? "Active" : "Away"}
          </span>
          <Button aria-label={`Edit ${user.name}`} onClick={() => onEdit(user)} size="icon" variant="ghost">
            <Pencil aria-hidden="true" />
          </Button>
        </article>
      ))}
    </section>
  );
}