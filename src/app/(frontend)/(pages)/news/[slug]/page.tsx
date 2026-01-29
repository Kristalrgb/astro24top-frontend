import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react'
import { RichText } from '@/components/utils/RichText'
import { Metadata } from 'next' // Твой компонент

interface PageProps {
  params: {
    slug: string
  }
}

// 1. Генерация статических путей (SSG)
// Next.js заранее создаст HTML файлы для всех существующих новостей при сборке
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const articles = await payload.find({
    collection: 'news',
    limit: 1000,
    draft: false, // Не генерируем страницы для черновиков
  })

  return articles.docs.map((doc) => ({
    slug: doc.slug,
  }))
}

// 2. SEO Метаданные (Title, Description)

// @ts-ignore
export const generateMetadata = async ({ params }: PageProps) => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'news',
    where: {
      slug: { equals: params.slug },
    },
  })

  const post = docs[0]

  if (!post) return { title: '404 - Статья не найдена' } as Metadata

  return {
    title: `${post.title} | Звездный Журнал`,
    description: `Читайте статью "${post.title}" в категории ${post.category}. Автор: ${post.author_name}`,
  } as Metadata
}

// 3. Основной компонент страницы
export default async function BlogPostPage({ params }: PageProps) {
  const payload = await getPayload({ config: configPromise })

  // Получаем статью по slug
  const { docs } = await payload.find({
    collection: 'news',
    where: {
      slug: { equals: params.slug },
    },
  })

  const post = docs[0]

  // Если статья не найдена (например, неверный URL)
  if (!post) {
    return notFound()
  }

  // --- Подготовка данных для рендера ---

  // 1. Обработка картинки (защита от undefined и проверка типа)
  const imageUrl =
    post.image && typeof post.image === 'object' && 'url' in post.image
      ? (post.image.url as string)
      : null

  // 2. Форматирование даты
  const formattedDate = new Date(post.publishedDate || post.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // 3. Красивые названия категорий
  const categoryLabels: Record<string, string> = {
    forecast: 'Прогноз',
    education: 'Обучение',
    esoterics: 'Эзотерика',
  }
  const categoryLabel = categoryLabels[post.category] || post.category

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-24">
      {/* --- HERO Секция (Заголовок + Фон) --- */}
      <section className="relative w-full min-h-[50vh] flex flex-col justify-end">
        {/* Картинка на фоне */}
        <div className="absolute inset-0 z-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority // Загружаем картинку сразу, так как она в первом экране
            />
          ) : (
            // Заглушка градиентом, если картинки нет
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
          )}
          {/* Градиентное затемнение, чтобы текст читался */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        {/* Контент заголовка */}
        <div className="relative z-10 container mx-auto px-4 pb-12 pt-32">
          {/* Кнопка Назад */}
          <Link
            href="/news"
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 group uppercase text-xs tracking-widest"
          >
            <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Назад к списку
          </Link>

          {/* Категория */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/50 text-amber-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              {categoryLabel}
            </span>
          </div>

          {/* Заголовок H1 */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight text-white mb-6 max-w-4xl drop-shadow-lg">
            {post.title}
          </h1>

          {/* Мета-информация (Автор, Дата) */}
          <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm border-t border-white/10 pt-6 max-w-4xl">
            <div className="flex items-center gap-2">
              <User size={16} className="text-amber-500" />
              <span className="font-medium text-slate-200">{post.author_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-amber-500" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- Основной контент (Rich Text) --- */}
      <article className="container mx-auto px-4 mt-12 max-w-3xl">
        <div className="prose prose-invert prose-lg md:prose-xl max-w-none">
          {/* Вставляем твой компонент RichText */}
          <RichText content={post.content} className="rich-text-container" />
        </div>

        {/* --- Футер статьи --- */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link
            href="/news"
            className="text-slate-500 hover:text-amber-400 transition-colors text-sm"
          >
            ← Читать другие статьи
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">Поделиться мудростью:</span>
            <button className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-400 transition-colors border border-white/5">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </article>
    </main>
  )
}
