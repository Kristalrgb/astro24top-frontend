import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BlogCard, BlogPost } from '@/components/cards/BlogCard'
import { getPayload } from 'payload'
import configPromise from '@payload-config' // Путь может отличаться в зависимости от setup

export const BlogSection = async () => {
  // 1. Инициализируем Payload
  const payload = await getPayload({ config: configPromise })

  // 2. Получаем данные (fetch)
  const { docs: newsItems } = await payload.find({
    collection: 'news',
    limit: 3, // Нам нужно только 3 карточки для этой секции
    sort: '-publishedDate', // Сортируем: сначала новые
  })

  // 3. Преобразуем данные из Payload в формат для BlogCard
  // Нам нужно привести типы Payload к типам BlogPost

  // @ts-ignore
  const posts: BlogPost[] = newsItems.map((item) => {
    // Обработка картинки: Payload может вернуть ID или объект.
    // TypeScript не всегда знает, что там объект, поэтому делаем проверку.
    const imageUrl =
      item.image && typeof item.image === 'object' && 'url' in item.image
        ? (item.image.url as string)
        : undefined

    // Форматируем дату (Intl.DateTimeFormat для русской локали)
    const formattedDate = item.publishedDate
      ? new Date(item.publishedDate).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : new Date(item.createdAt).toLocaleDateString('ru-RU')

    return {
      id: item.id,
      slug: item.slug || String(item.id), // Fallback, если slug пустой
      title: item.title,
      // Маппинг категорий (если в базе храним 'forecast', а показать хотим 'Прогноз')
      category: formatCategory(item.category),
      publishDate: formattedDate,
      imageUrl: imageUrl,
    }
  })

  return (
    <section className="py-24 container mx-auto px-4">
      {/* Заголовок секции */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">Звездный журнал</h2>
          <p className="text-slate-400">Полезные статьи о влиянии планет и магии.</p>
        </div>

        <Link
          href="/blog"
          className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm uppercase tracking-wider"
        >
          Читать все <ArrowRight size={16} />
        </Link>
      </div>

      {/* Сетка статей */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => <BlogCard key={post.id} data={post} />)
        ) : (
          <p className="text-slate-500">Статей пока нет.</p>
        )}
      </div>

      {/* Кнопка "Читать все" для мобильных */}
      <div className="mt-10 text-center md:hidden">
        <Link
          href="/blog"
          className="inline-block border-b border-slate-500 pb-1 text-slate-400 hover:text-white transition-colors"
        >
          Перейти в блог
        </Link>
      </div>
    </section>
  )
}


function formatCategory(catKey?: string | null): string {
  switch (catKey) {
    case 'forecast':
      return 'Прогноз'
    case 'education':
      return 'Обучение'
    case 'esoterics':
      return 'Эзотерика'
    default:
      return 'Новости'
  }
}
