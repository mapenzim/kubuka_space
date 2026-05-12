import { auth } from "@/auth";
import { Flex, Box, Heading, Text, Separator, Button } from "@radix-ui/themes";
import { MailPlus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Extract user role for potential use in conditional rendering
  const userRole = session?.user?.role || "USER"; // Default to "User" if role is not defined

  if (!session || (userRole !== "ADMIN" && userRole !== "SUPERUSER")) {
    // Redirect to home, or to a specific '/unauthorized' page
    redirect("/"); 
  }

  // Reusable Nav Item Component
  const NavItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
    <Button 
      asChild 
      variant="ghost" 
      color="gray" size="3" className="w-full justify-start items-start cursor-pointer ml-2"
      style={{ justifyContent: "flex-start" }} 
    >
      <Link href={href} referrerPolicy="no-referrer">
        {icon}
        <Text size="3" weight="medium" className="text-zinc-400">
          {label}
        </Text>
      </Link>
    </Button>
  );

  return (
    // MAIN PAGE: Full screen, hidden overflow to prevent window scrolling
    <Flex className="h-screen w-full overflow-hidden bg-(--gray-a2)">
      
      {/* SIDE PANE */}
      <Flex 
        direction="column" 
        className="hidden w-64 shrink-0 border-r border-(--gray-a6) bg-sky-900 md:flex"
      >
        {/* Title */}
        <Box p="5">
          <Flex align="center" gap="2">
            <div className="flex size-8 items-center justify-center rounded bg-indigo-500 text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <Heading as="h2" size="5" weight="bold" className="text-zinc-300">
              Kubuka Admin
            </Heading>
          </Flex>
        </Box>

        <Separator size="4" />

        {/* Menuitems */}
        <Flex direction="column" gap="1" p="4" className="flex-1 overflow-y-auto">
          <Text size="1" weight="bold" mb="2" className="uppercase tracking-wider text-zinc-200">
            Overview
          </Text>
          <NavItem 
            href="/admin" 
            label="Dashboard" 
            icon={<svg width="18" height="18" className="text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>} 
          />
          <NavItem 
            href="/admin/posts" 
            label="All Posts" 
            icon={<svg width="18" height="18" className="text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z"/><path d="M18 21v-8a2 2 0 0 0-2-2h-1.5"/><path d="M4 11V4a2 2 0 0 1 2-2h8l6 6v3"/></svg>} 
          />
          <NavItem 
            href="/admin/users" 
            label="Users" 
            icon={<svg width="18" height="18" className="text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} 
          />
          <NavItem 
            href="/admin/store" 
            label="Storefront" 
            icon={<svg width="18" height="18" className="text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>} 
          />
          <NavItem 
            href="/admin/messages" 
            label="Messages" 
            icon={<MailPlus width={18} height={18} className="text-zinc-300" />} 
          />
        </Flex>

        <Separator size="4" />
        
        {/* Bottom Menu Item */}
        <Box p="4">
          <NavItem 
            href="/admin/settings" 
            label="Settings" 
            icon={<svg width="18" height="18" className="text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>} 
          />
        </Box>
      </Flex>

      {/* MAIN PANE */}
      {/* 1. Added `relative` and a base background color to the main wrapper */}
      <Flex direction="column" className="flex-1 overflow-hidden relative transition-colors">
        
        {/* 2. FIXED BACKGROUND PATTERN */}
        {/* Absolute inset-0 fills the pane, pointer-events-none prevents click blocking, z-0 keeps it behind content */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.2]"
          style={{
            // HeroPattern: "Plus"
            // Note: Fill color is set to black (%23000000). The dark mode opacity adjusts the visibility.
            backgroundColor: "#E5E5DB",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23141380' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M11 0l5 20H6l5-20zm42 31a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM0 72h40v4H0v-4zm0-8h31v4H0v-4zm20-16h20v4H20v-4zM0 56h40v4H0v-4zm63-25a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM53 41a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-30 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-28-8a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zM56 5a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zm-3 46a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM21 0l5 20H16l5-20zm43 64v-4h-4v4h-4v4h4v4h4v-4h4v-4h-4zM36 13h4v4h-4v-4zm4 4h4v4h-4v-4zm-4 4h4v4h-4v-4zm8-8h4v4h-4v-4z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Header/Topbar inside main pane */}
        {/* 3. Added `relative z-10` to keep the header solid and above the pattern */}
        <Flex align="center" className="relative z-10 h-16 shrink-0 border-b border-(--gray-a6) bg-(--color-panel) px-6 shadow-sm">
           <Heading as="h3" size="4" className="text-zinc-900">
             Dashboard Overview
           </Heading>
        </Flex>

        {/* Scrollable Area */}
        {/* 4. Added `relative z-10`. Because this container is overflow-y-auto and sits above the pattern, children will scroll over the fixed background. */}
        <Box className="relative z-10 flex-1 overflow-y-auto p-6">
          {children}
        </Box>
      </Flex>
      
    </Flex>
  );
}