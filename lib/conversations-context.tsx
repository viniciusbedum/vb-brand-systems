"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { isDemoMode } from "@/lib/features"

export type Conversation = {
  id: string
  title: string
  pinned: boolean
  updated_at: string
}

// Cache de módulo — sobrevive a remounts do provider (troca de ícone na sidebar)
let cache: Conversation[] | null = null

type ConversationsContextValue = {
  conversations: Conversation[]
  loading: boolean
  addConversation: (conv: Conversation) => void
  deleteConversation: (id: string) => void
  renameConversation: (id: string, title: string) => void
  togglePin: (id: string) => Promise<void>
  refetch: () => void
}

const ConversationsContext = createContext<ConversationsContextValue | null>(null)

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(cache ?? [])
  // loading só é true na primeira visita (sem cache ainda)
  const [loading, setLoading] = useState(cache === null)

  const fetchConversations = useCallback((silent: boolean = false) => {
    if (isDemoMode) {
      cache = cache ?? []
      setLoading(false)
      return
    }
    if (!silent) setLoading(true)
    fetch("/api/conversations")
      .then((r) => (r.ok ? r.json() : { conversations: [] }))
      .then((data) => {
        const convs: Conversation[] = data.conversations ?? []
        cache = convs
        setConversations(convs)
      })
      .catch(() => {
        if (cache === null) setConversations([])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    // Se já há cache, busca silenciosa em background; senão, fetch normal com loading
    fetchConversations(cache !== null)

    function handleVisibility() {
      if (document.visibilityState === "visible") fetchConversations(true)
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [fetchConversations])

  function addConversation(conv: Conversation) {
    const next = [conv, ...(cache ?? []).filter((c) => c.id !== conv.id)]
    cache = next
    setConversations(next)
  }

  function deleteConversation(id: string) {
    const next = (cache ?? []).filter((c) => c.id !== id)
    cache = next
    setConversations(next)
  }

  function renameConversation(id: string, title: string) {
    const next = (cache ?? []).map((c) => (c.id === id ? { ...c, title } : c))
    cache = next
    setConversations(next)
  }

  async function togglePin(id: string) {
    const conv = (cache ?? []).find((c) => c.id === id)
    if (!conv) return
    const newPinned = !conv.pinned
    const optimistic = (cache ?? []).map((c) => (c.id === id ? { ...c, pinned: newPinned } : c))
    cache = optimistic
    setConversations(optimistic)
    const res = await fetch(`/api/conversations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: newPinned }),
    })
    if (!res.ok) {
      const reverted = (cache ?? []).map((c) => (c.id === id ? { ...c, pinned: !newPinned } : c))
      cache = reverted
      setConversations(reverted)
    }
  }

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        loading,
        addConversation,
        deleteConversation,
        renameConversation,
        togglePin,
        refetch: () => fetchConversations(false),
      }}
    >
      {children}
    </ConversationsContext.Provider>
  )
}

export function useConversations() {
  const ctx = useContext(ConversationsContext)
  if (!ctx) throw new Error("useConversations must be used within ConversationsProvider")
  return ctx
}
