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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LogOut, MessageSquare, Plus, User as UserIcon, Trash2 } from "lucide-react"
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

  // Watch for newly spun up threads dynamically and re-fetch to sync memory correctly
  useEffect(() => {
    if (user?.id) {
      fetchThreads(user.id)
    }
  }, [currentThreadId, user?.id])

  const fetchThreads = async (userId: string) => {
    try {
      // Pull heavily to guarantee we hit older anonymous schemas
      const response = await client.searchThreads({
        limit: 100
      });
      
      // Manually filter to inject securely mapped UUID threads AND backward-compatible legacy threads
      const validThreads = response.filter((t: any) => {
        const meta = t.metadata;
        // Accept old anonymous chats
        if (!meta || Object.keys(meta).length === 0) return true;
        // Accept correct UUID mappings
        if (meta.user_id === userId) return true;
        // Accept the temporary double-wrapped bug schemas
        if (meta.metadata && meta.metadata.user_id === userId) return true;
        
        return false;
      });

      // Sort to display newest first
      setThreads(validThreads.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch(err) {
      console.error(err)
    }
  }

  const handleDeleteThread = async (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation() // Prevent triggering the select
    try {
      await client.deleteThread(threadId)
      // Remove cleanly from UI manually
      setThreads(prev => prev.filter(t => t.thread_id !== threadId))
      // If we destroyed the active thread, snap back cleanly to a blank state
      if (currentThreadId === threadId) {
        window.location.reload()
      }
    } catch(err) {
      console.error('Failed to delete thread:', err)
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
                  <SidebarMenuAction
                    showOnHover
                    onClick={(e) => handleDeleteThread(e, thread.thread_id)}
                    className="text-red-500 hover:text-red-700 bg-background/50 hover:bg-red-50"
                  >
                    <Trash2 />
                    <span className="sr-only">Delete Chat</span>
                  </SidebarMenuAction>
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
