import React, { useEffect, useMemo, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Currency = 'RUB' | 'USD'

interface ProductImage {
  id?: string
  url?: string
  alt?: string
}

interface EditableProduct {
  id: string
  title: string
  price: number
  currency: Currency
  stock: number
  images?: ProductImage[]
}

interface EditProductDialogProps {
  open: boolean
  product: EditableProduct | null
  onClose: () => void
  onUpdated: (product: any) => void
}

const getDefaults = (product: EditableProduct | null) => ({
  title: product?.title ?? '',
  price: product ? String(product.price) : '',
  currency: product?.currency ?? 'RUB',
  stock: product ? String(product.stock) : '1',
})

export const EditProductDialog = ({
  open,
  product,
  onClose,
  onUpdated,
}: EditProductDialogProps) => {
  const [values, setValues] = useState(getDefaults(product))
  const [existingImages, setExistingImages] = useState<ProductImage[]>(product?.images ?? [])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setExistingImages([])
      setNewFiles([])
      setIsSubmitting(false)
      return
    }
    setValues(getDefaults(product))
    setExistingImages(product?.images ?? [])
    setNewFiles([])
  }, [open, product])

  const isValid = useMemo(() => {
    const price = Number(values.price)
    const stock = Number(values.stock)
    return values.title.trim().length > 2 && Number.isFinite(price) && price > 0 && stock >= 0
  }, [values])

  if (!open) return null

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    setNewFiles(files)
  }

  const handleRemoveExisting = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!product || !isValid || isSubmitting) return

    setIsSubmitting(true)

    try {
      const uploadedIds: string[] = []

      if (newFiles.length > 0) {
        for (const file of newFiles) {
          const formData = new FormData()
          formData.append('file', file)

          const uploadRes = await fetch('/api/media', {
            method: 'POST',
            body: formData,
          })

          if (!uploadRes.ok) throw new Error('Ошибка загрузки изображения')

          const uploaded = await uploadRes.json()
          if (uploaded?.doc?.id) {
            uploadedIds.push(uploaded.doc.id)
          } else if (uploaded?.id) {
            uploadedIds.push(uploaded.id)
          }
        }
      }

      const existingIds = existingImages.map((img) => img.id).filter(Boolean) as string[]
      const imagesPayload = [...existingIds, ...uploadedIds]

      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: values.title.trim(),
          price: Number(values.price),
          currency: values.currency,
          stock: Number(values.stock),
          images: imagesPayload,
        }),
      })

      if (!res.ok) throw new Error('Ошибка обновления товара')

      const updated = await res.json()
      onUpdated(updated)
      toast.success('Товар обновлен')
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Не удалось обновить товар')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Закрыть модальное окно"
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Редактировать товар</h3>
            <p className="text-sm text-slate-400">Обновите основные данные товара</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-wide text-slate-400">Название</span>
            <input
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="Название товара"
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
              required
              minLength={3}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-wide text-slate-400">Цена</span>
              <input
                name="price"
                value={values.price}
                onChange={handleChange}
                placeholder="0"
                type="number"
                min="0"
                step="1"
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
                required
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wide text-slate-400">Валюта</span>
              <select
                name="currency"
                value={values.currency}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="RUB">RUB</option>
                <option value="USD">USD</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-wide text-slate-400">Остаток (шт.)</span>
            <input
              name="stock"
              value={values.stock}
              onChange={handleChange}
              placeholder="1"
              type="number"
              min="0"
              step="1"
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
            />
          </label>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-slate-400">Фотографии</span>
              <span className="text-[11px] text-slate-500">PNG/JPG, можно несколько</span>
            </div>

            {existingImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {existingImages.map((img, index) => (
                  <div
                    key={`${img.id ?? img.url}-${index}`}
                    className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-slate-900"
                  >
                    {img.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img.url}
                        alt={img.alt ?? 'Изображение'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-500">
                        Нет фото
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveExisting(index)}
                      className="absolute top-1 right-1 rounded-md bg-black/60 px-2 py-1 text-[10px] uppercase text-white hover:bg-black/80"
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
              className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-slate-200 hover:file:bg-slate-700"
            />

            {newFiles.length > 0 && (
              <div className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
                Выбрано файлов: {newFiles.length}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
