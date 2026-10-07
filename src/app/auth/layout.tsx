import AuthLayout from "@/features/auth/layouts/AuthLayout";

export default function AuthenticationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AuthLayout>{children}</AuthLayout>;
}
