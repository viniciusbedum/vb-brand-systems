'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlass as Search } from "@/lib/icons";
import { createClient } from '@/lib/supabase'
import type { Profile } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  role: 'admin' | 'staff'
  currentUserId: string
}

function getInitials(name: string | null): string {
  if (!name) return 'U'
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR')
}

export function MembersTab({ role, currentUserId }: Props) {
  const [members, setMembers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'staff'>('all')
  const [pendingRoles, setPendingRoles] = useState<Record<string, 'admin' | 'staff'>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: true })
        setMembers((data ?? []) as Profile[])
      } catch {
        setMembers([])
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])

  async function handleSave(memberId: string) {
    const newRole = pendingRoles[memberId]
    if (!newRole) return
    setSavingId(memberId)
    try {
      const supabase = createClient()
      await supabase.from('profiles').update({ role: newRole }).eq('id', memberId)
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      )
      setPendingRoles((prev) => {
        const next = { ...prev }
        delete next[memberId]
        return next
      })
    } catch {
      // ignore
    } finally {
      setSavingId(null)
    }
  }

  async function handleDelete(memberId: string) {
    setDeletingId(memberId)
    try {
      const supabase = createClient()
      await supabase.from('profiles').delete().eq('id', memberId)
      setMembers((prev) => prev.filter((m) => m.id !== memberId))
    } catch {
      // ignore
    } finally {
      setDeletingId(null)
    }
  }

  // Staff sees only themselves; admin sees all
  const visibleMembers = role === 'staff'
    ? members.filter((m) => m.id === currentUserId)
    : members.filter((m) => {
        const matchesSearch =
          !search ||
          (m.name ?? '').toLowerCase().includes(search.toLowerCase())
        const matchesRole = filterRole === 'all' || m.role === filterRole
        return matchesSearch && matchesRole
      })

  const count = visibleMembers.length
  const memberWord = count === 1 ? 'membro' : 'membros'

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h3 className="text-xl font-semibold tracking-tight">Membros</h3>
        <p className="text-sm text-muted-foreground">
          {role === 'admin'
            ? 'Gerencie membros e suas permissões. Apenas administradores têm acesso a esta área.'
            : 'Visualize seu acesso ao brand system.'}
        </p>
      </div>

      {/* Search + filter — admin only */}
      {role === 'admin' && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              aria-label="Buscar membros por nome"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome…"
              className="pl-9"
            />
          </div>
          <Select
            aria-label="Filtrar por função"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'staff')}
            className="sm:w-48"
          >
            <option value="all">Todas as funções</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </Select>
        </div>
      )}

      {/* List header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Lista de membros</span>
        <span className="text-xs text-muted-foreground">{count} {memberWord}</span>
      </div>

      {/* Members list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : visibleMembers.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Nenhum membro encontrado.</p>
      ) : (
        <div className="space-y-2">
          {visibleMembers.map((member) => {
            const isCurrentUser = member.id === currentUserId
            const currentRole = pendingRoles[member.id] ?? member.role
            const hasPendingChange = pendingRoles[member.id] !== undefined

            return (
              <Card key={member.id} className="flex flex-wrap items-center gap-4 p-4">
                {/* Avatar */}
                <div className="flex size-10 shrink-0 select-none items-center justify-center rounded-full bg-muted text-sm font-semibold">
                  {getInitials(member.name)}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="truncate text-sm font-semibold">
                      {member.name ?? 'Usuário'}
                    </span>
                    {isCurrentUser && <Badge variant="secondary">Você</Badge>}
                    <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                      {member.role}
                    </Badge>
                  </div>
                  {member.created_at && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Cadastro: {formatDate(member.created_at)}
                    </p>
                  )}
                </div>

                {/* Actions — admin can edit others */}
                {role === 'admin' && !isCurrentUser && (
                  <div className="flex shrink-0 items-center gap-2">
                    <Select
                      aria-label={`Função de ${member.name ?? 'Usuário'}`}
                      value={currentRole}
                      onChange={(e) =>
                        setPendingRoles((prev) => ({
                          ...prev,
                          [member.id]: e.target.value as 'admin' | 'staff',
                        }))
                      }
                      className="w-28"
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </Select>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave(member.id)}
                      disabled={!hasPendingChange || savingId === member.id}
                    >
                      {savingId === member.id ? '…' : 'Salvar'}
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(member.id)}
                      disabled={deletingId === member.id}
                    >
                      {deletingId === member.id ? '…' : 'Excluir'}
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
