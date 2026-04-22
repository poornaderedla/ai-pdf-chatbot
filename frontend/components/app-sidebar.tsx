"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
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
} from "@/components/ui/sidebar"
import { LogOut, MessageSquare, Plus, User as UserIcon } from "lucide-react"
import { client } from "@/lib/langgraph-client"

export function AppSidebar({ currentThreadId, onSelectThread }: { currentThreadId: string | null, onSelectThread: (id: string) => void }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [threads, setThreads] = useState<any[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login")
      } else {
        setUser(session.user)
        fetchThreads(session.user.id)
      }
    })
  }, [router])

  const fetchThreads = async (userId: string) => {
    try {
      const response = await client.threads.search({
        metadata: { user_id: userId },
        limit: 20
      });
      // Sort to show newest first by default if search doesn't
      setThreads(response.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch(err) {
      console.error(err)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (!user) return null;

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 flex flex-row items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold group-data-[collapsible=icon]:mr-0 flex-shrink-0">
          {user.user_metadata?.first_name?.[0] || <UserIcon size={16} />}
        </div>
        <div className="flex flex-col group-data-[collapsible=icon]:hidden">
          <span className="text-sm font-medium">{user.user_metadata?.first_name} {user.user_metadata?.last_name}</span>
          <span className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Chat History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => window.location.reload()} tooltip="New Chat">
                  <Plus />
                  <span>New Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {threads.map((thread) => (
                <SidebarMenuItem key={thread.thread_id}>
                  <SidebarMenuButton 
                    isActive={thread.thread_id === currentThreadId}
                    onClick={() => onSelectThread(thread.thread_id)}
                    tooltip={new Date(thread.created_at).toLocaleString()}
                  >
                    <MessageSquare />
                    <span>{new Date(thread.created_at).toLocaleString()}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50" tooltip="Log out">
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
