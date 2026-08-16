import ProfileSessionGuard from "@/components/auth/ProfileSessionGuard";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfileSessionGuard>{children}</ProfileSessionGuard>;
}
