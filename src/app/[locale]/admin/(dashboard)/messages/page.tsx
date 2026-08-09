import { getMessages } from "@/actions/messages";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { CONTACT_CATEGORIES } from "@/lib/constants";
import { MessageActions } from "@/components/admin/MessageActions";

export default async function AdminMessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const messages = await getMessages();
  const active = messages.filter((m) => !m.isArchived);
  const archived = messages.filter((m) => m.isArchived);

  const sections = [
    { title: isAr ? "الوارد" : "Inbox", list: active },
    { title: isAr ? "الأرشيف" : "Archived", list: archived },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground">
          {isAr ? "رسائل التواصل" : "Contact Messages"}
        </h1>
        <p className="text-gray-500">
          {isAr
            ? `${active.length} نشطة · ${archived.length} مؤرشفة`
            : `${active.length} active · ${archived.length} archived`}
        </p>
      </div>

      {sections.map(
        (section) =>
          section.list.length > 0 && (
            <div key={section.title} className="heritage-card">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-foreground">{section.title}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {section.list.map((message) => (
                  <div key={message.id} className={`px-5 py-4 ${!message.isRead ? "bg-blue-50/40" : ""}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {!message.isRead && (
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          <p className="font-bold text-foreground">{message.name}</p>
                          <span className="text-xs text-gray-400 break-all">{message.email}</span>
                          {message.phone && (
                            <span className="text-xs text-gray-400" dir="ltr">{message.phone}</span>
                          )}
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {isAr
                              ? CONTACT_CATEGORIES.find((c) => c.value === message.category)?.labelAr ?? message.category
                              : CONTACT_CATEGORIES.find((c) => c.value === message.category)?.labelEn ?? message.category}
                          </span>
                        </div>
                        <p className="font-medium text-gray-700 mt-1">{message.subject}</p>
                        <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">{message.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{formatDateTime(message.createdAt, locale)}</p>
                      </div>
                      <div dir="ltr" className="shrink-0">
                        <MessageActions
                          id={message.id}
                          isRead={message.isRead}
                          isArchived={message.isArchived}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
      )}

      {messages.length === 0 && (
        <div className="heritage-card px-5 py-16 text-center text-gray-400">
          {isAr ? "لا توجد رسائل بعد" : "No messages yet"}
        </div>
      )}

    </div>
  );
}
