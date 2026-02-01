import React, { useEffect, useMemo, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Currency = 'RUB' | 'USD'

interface AddProductDialogProps {
  open: boolean
  onClose: () => void
  onCreated: (product: any) => void
}

const defaultValues = {
  title: '',
  price: '',
  currency: 'RUB' as Currency,
  stock: '1',
}

export const AddProductDialog = ({ open, onClose, onCreated }: AddProductDialogProps) => {
  const [values, setValues] = useState(defaultValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setValues(defaultValues)
      setIsSubmitting(false)
    }
  }, [open])

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: values.title.trim(),
          price: Number(values.price),
          currency: values.currency,
          stock: Number(values.stock),
        }),
      })

      if (!res.ok) throw new Error('Ошибка создания товара')

      const created = await res.json()
      onCreated(created)
      toast.success('Товар создан')
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Не удалось создать товар')
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
            <h3 className="text-lg font-semibold text-white">Новый товар</h3>
            <p className="text-sm text-slate-400">Заполните базовые данные и сохраните</p>
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
