import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useUsersStore } from '@/store/users';

export function AppSidebar() {
  const { connectedUsers } = useUsersStore();

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Connected users</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {connectedUsers.map((user) => (
                <SidebarMenuItem key={user.name}>
                  <SidebarMenuButton asChild>
                    <div className="flex">
                      <p>{user.name}</p>
                      <div
                        className="w-3 h-3 rounded-full border-solid border border-black"
                        style={{ backgroundColor: user.color }}
                      />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
