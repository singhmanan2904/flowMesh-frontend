import { TOKEN_KEY } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get(TOKEN_KEY);
  if (!token) {
    redirect("/login");
  }
  return children;
}
