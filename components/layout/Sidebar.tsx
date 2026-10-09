import { SidebarSearch } from "./SidebarSearch";
import { SidebarContent } from "./SidebarContent";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarToggleButton } from "./SidebarToggleButton";
import { SidebarIconBar } from "./SidebarIconBar";
import { createClient } from "@/lib/supabase-server";
import { brand } from "@/brand/config";
import { isDemoMode, DEMO_USER } from "@/lib/features";

export async function Sidebar() {
  let user = null;
  let profile: { name: string | null; role: "admin" | "staff" } | null = null;

  if (isDemoMode) {
    profile = { name: DEMO_USER.name, role: DEMO_USER.role };
  } else try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;

    if (user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("id", user.id)
        .single();
      profile = profileData;
    }
  } catch {
    // Supabase indisponível — segue sem usuário
  }

  const displayName =
    profile?.name ?? user?.email?.split("@")[0] ?? "Usuário";

  return (
    <aside
      className="glass flex h-full w-full flex-col rounded-xl"
      aria-label="Navegação do Brand System"
    >
      {/* Logo area */}
      <div className="flex h-14 flex-shrink-0 items-center gap-2 px-4">
        <span className="truncate text-sm font-heading font-bold tracking-[0.14em] select-none">
          {brand.wordmark}
        </span>
        <SidebarToggleButton />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarSearch />

        <SidebarIconBar />

        <SidebarContent />
      </nav>

      <div className="flex-shrink-0 px-3 py-4">
        <SidebarFooter
          displayName={displayName}
          email={user?.email ?? null}
          role={profile?.role ?? null}
          userId={user?.id ?? null}
        />
      </div>
    </aside>
  );
}
