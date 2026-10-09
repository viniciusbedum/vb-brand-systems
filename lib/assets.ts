import { createClient } from '@/lib/supabase'

export type AssetRecord = {
  id: string
  name: string
  size: number
  type: string
  storage_path: string
  category: string
  uploaded_by: string | null
  created_at: string
  url?: string
}

export async function uploadAsset(
  file: File,
  category: string,
  userId: string
): Promise<AssetRecord> {
  const supabase = createClient()
  const ext = file.name.split('.').pop() ?? ''
  const randomId = Math.random().toString(36).slice(2, 9)
  const storagePath = `${category}/${userId}/${Date.now()}-${randomId}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('brand-assets')
    .upload(storagePath, file)

  if (uploadError) throw uploadError

  const { data, error: insertError } = await supabase
    .from('brand_assets')
    .insert({
      name: file.name,
      size: file.size,
      type: file.type,
      storage_path: storagePath,
      category,
      uploaded_by: userId,
    })
    .select()
    .single()

  if (insertError) throw insertError

  const { data: signedData } = await supabase.storage
    .from('brand-assets')
    .createSignedUrl(storagePath, 3600)

  return {
    ...(data as AssetRecord),
    url: signedData?.signedUrl ?? undefined,
  }
}

export async function listAssets(category: string): Promise<AssetRecord[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('brand_assets')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) throw error

  const records = (data ?? []) as AssetRecord[]

  if (records.length === 0) return []

  const paths = records.map((r) => r.storage_path)

  const { data: signedUrls, error: signedError } = await supabase.storage
    .from('brand-assets')
    .createSignedUrls(paths, 3600)

  if (signedError) throw signedError

  const urlMap = new Map(
    (signedUrls ?? []).map((s) => [s.path, s.signedUrl])
  )

  return records.map((r) => ({
    ...r,
    url: urlMap.get(r.storage_path) ?? undefined,
  }))
}

export async function deleteAsset(id: string, storagePath: string): Promise<void> {
  const supabase = createClient()

  const { error: storageError } = await supabase.storage
    .from('brand-assets')
    .remove([storagePath])

  if (storageError) throw storageError

  const { error: dbError } = await supabase
    .from('brand_assets')
    .delete()
    .eq('id', id)

  if (dbError) throw dbError
}
