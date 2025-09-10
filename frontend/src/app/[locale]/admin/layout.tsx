import AdminLayout from "@/components/admin/AdminLayout";

export default function LocaleAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
