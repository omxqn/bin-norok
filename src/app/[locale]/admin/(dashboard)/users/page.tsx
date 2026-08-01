import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { AddUserForm, UserRoleSelect } from "@/components/admin/UserManager";

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isSuperAdmin = role === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    return (
      <div className="heritage-card px-5 py-16 text-center text-gray-500">
        {isAr
          ? "إدارة المستخدمين متاحة للمدير العام فقط."
          : "User management is available to the Super Admin only."}
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground">
          {isAr ? "المستخدمون" : "Users"}
        </h1>
        <p className="text-gray-500">
          {isAr
            ? `${users.length} مستخدم — أضف محررين أو مدراء بصلاحيات محددة`
            : `${users.length} users — add editors or admins with scoped permissions`}
        </p>
      </div>

      <AddUserForm isAr={isAr} />

      <div className="heritage-card divide-y divide-gray-100">
        {users.map((user) => (
          <div key={user.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-bold text-foreground">
                {user.name}
                {user.id === (session?.user as { id?: string })?.id && (
                  <span className="ms-2 text-xs bg-gold/15 text-gold-dark px-2 py-0.5 rounded-full font-bold">
                    {isAr ? "أنت" : "You"}
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500" dir="ltr">{user.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {isAr ? "أُنشئ في" : "Created"} {formatDate(user.createdAt, locale)}
              </p>
            </div>
            <div dir="ltr" className="shrink-0">
              <UserRoleSelect
                isAr={isAr}
                user={{ id: user.id, name: user.name, email: user.email, role: user.role }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        {isAr
          ? "الأدوار: المدير العام يدير كل شيء بما فيه المستخدمين · المدير يدير المحتوى والحجوزات · المحرر يعدّل المحتوى فقط."
          : "Roles: Super Admin manages everything incl. users · Admin manages content and bookings · Editor edits content only."}
      </p>
    </div>
  );
}
