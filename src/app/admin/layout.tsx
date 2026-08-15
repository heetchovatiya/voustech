import { getAdminSession } from "@/lib/auth";
import { AdminHeaderNav } from "@/components/admin/AdminHeaderNav";
import "../globals.css";

export const metadata = {
  title: "VousTech Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        {session ? (
          <AdminHeaderNav username={session.username} email={session.email}>
            {children}
          </AdminHeaderNav>
        ) : (
          <div className="min-h-screen bg-slate-950">{children}</div>
        )}
      </body>
    </html>
  );
}
