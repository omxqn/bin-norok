"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import type { Role } from "@prisma/client";
import { createUser, updateUser } from "@/actions/users";
import { DeleteUserButton } from "@/components/admin/DeleteButtons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ROLES } from "@/lib/constants";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export function AddUserForm({ isAr }: { isAr: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await createUser({
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
          role: String(formData.get("role") ?? "EDITOR") as Role,
        });
        toast.success(isAr ? "تمت إضافة المستخدم" : "User created");
        formRef.current?.reset();
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : isAr ? "فشلت الإضافة" : "Failed to create user");
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="heritage-card p-5 md:p-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
      <div>
        <Label htmlFor="new-name">{isAr ? "الاسم" : "Name"}</Label>
        <Input id="new-name" name="name" required minLength={2} />
      </div>
      <div>
        <Label htmlFor="new-email">{isAr ? "البريد الإلكتروني" : "Email"}</Label>
        <Input id="new-email" name="email" type="email" dir="ltr" required />
      </div>
      <div>
        <Label htmlFor="new-password">{isAr ? "كلمة المرور" : "Password"}</Label>
        <Input id="new-password" name="password" type="password" required minLength={8} placeholder={isAr ? "٨ أحرف على الأقل" : "min 8 chars"} />
      </div>
      <div>
        <Label htmlFor="new-role">{isAr ? "الدور" : "Role"}</Label>
        <Select id="new-role" name="role" defaultValue="EDITOR">
          {ROLES.map((role) => (
            <option key={role.value} value={role.value}>
              {isAr ? role.labelAr : role.labelEn}
            </option>
          ))}
        </Select>
      </div>
      <Button type="submit" disabled={isPending} className="h-10">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
          <>
            <UserPlus className="w-4 h-4 me-2" /> {isAr ? "إضافة" : "Add"}
          </>
        )}
      </Button>
    </form>
  );
}

export function UserRoleSelect({ user, isAr }: { user: UserData; isAr: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleRoleChange(newRole: string) {
    startTransition(async () => {
      try {
        await updateUser(user.id, {
          name: user.name,
          email: user.email,
          role: newRole as Role,
        });
        toast.success(isAr ? "تم تحديث الدور" : "Role updated");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : isAr ? "فشل التحديث" : "Failed to update");
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={user.role}
        disabled={isPending}
        onChange={(e) => handleRoleChange(e.target.value)}
        className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white disabled:opacity-50"
      >
        {ROLES.map((role) => (
          <option key={role.value} value={role.value}>
            {isAr ? role.labelAr : role.labelEn}
          </option>
        ))}
      </select>
      <DeleteUserButton id={user.id} />
    </div>
  );
}
