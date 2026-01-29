import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Sun, Moon, Sparkles, Map, HeartHandshake } from 'lucide-react'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'О проекте | Звездный Журнал',
  description: 'Наша миссия — освещать путь с помощью древних знаний астрологии и эзотерики.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* --- HERO Секция --- */}
      <section className="relative w-full py-32 md:py-48 flex items-center justify-center overflow-hidden">
        {/* Декоративный фон */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950 opacity-60"></div>
          {/* Звезды (можно заменить на картинку космоса) */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <span className="inline-block mb-4 text-amber-500 text-sm font-bold uppercase tracking-[0.2em]">
            Наша философия
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight">
            Мы соединяем <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              Звезды и Судьбы
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed">
            Проект создан для тех, кто ищет ответы за пределами материального мира. Мы переводим
            язык планет на язык человеческой жизни.
          </p>
        </div>
      </section>

      {/* --- Секция "История / О нас" --- */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Левая колонка: Текст */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif text-white">
              Больше, чем просто гороскопы
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
              <p>
                В эпоху информационного шума легко потерять связь со своим внутренним «Я». Мы
                создали этот журнал как тихую гавань, где древняя мудрость встречается с современным
                ритмом жизни.
              </p>
              <p>
                Наша команда состоит из практикующих астрологов, тарологов и исследователей
                эзотерических традиций. Мы не верим в фатальность судьбы. Мы верим в то, что карты и
                звезды — это навигатор, а руль всегда в ваших руках.
              </p>
            </div>

            <div className="flex gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-3xl font-serif text-amber-400">5+</span>
                <span className="text-sm text-slate-500 uppercase tracking-wider">Лет опыта</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-serif text-amber-400">10k+</span>
                <span className="text-sm text-slate-500 uppercase tracking-wider">Читателей</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-serif text-amber-400">∞</span>
                <span className="text-sm text-slate-500 uppercase tracking-wider">
                  Тайн открыто
                </span>
              </div>
            </div>
          </div>

          {/* Правая колонка: Изображение (Заглушка) */}
          <div className="relative h-[500px] w-full rounded-2xl overflow-hidden border border-white/10 group">
            {/* Замени src на реальное фото команды или атмосферное фото */}
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-600">
              <span className="text-xs uppercase tracking-widest">
                Фотография атмосферы / Алтарь
              </span>
            </div>
            {/* Эффект свечения при наведении */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        </div>
      </section>

      {/* --- Секция ценностей (Иконки) --- */}
      <section className="py-24 bg-slate-900/50 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <ValueCard
              icon={<Star size={32} />}
              title="Точность"
              desc="Мы используем классические астрологические расчеты, а не генераторы случайных фраз."
            />
            <ValueCard
              icon={<HeartHandshake size={32} />}
              title="Эмпатия"
              desc="Мы говорим о сложном бережно. Никаких запугиваний, только поддержка и варианты развития событий."
            />
            <ValueCard
              icon={<Sparkles size={32} />}
              title="Практичность"
              desc="Магия должна работать. Все наши ритуалы и советы адаптированы под современную жизнь."
            />
          </div>
        </div>
      </section>

      {/* --- Команда (Статичная, но можно подключить Payload) --- */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Наши проводники</h2>
          <p className="text-slate-400">Люди, которые читают звезды для вас</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TeamMember
            name="Анна Астральная"
            role="Основатель, Астролог"
            image="/path/to/anna.jpg" // Замени на реальный путь
          />
          <TeamMember name="Марк Таро" role="Мастер Таро, Рунолог" image="/path/to/mark.jpg" />
          <TeamMember
            name="Елена Луна"
            role="Специалист по лунным циклам"
            image="/path/to/elena.jpg"
          />
        </div>
      </section>

      {/* --- CTA (Призыв к действию) --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-amber-600/5"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">
            Готовы узнать свою судьбу?
          </h2>
          <p className="text-slate-400 mb-8 text-lg max-w-xl mx-auto">
            Начните с чтения наших еженедельных прогнозов или погрузитесь в изучение Арканов.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/news"
              className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-full transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]"
            >
              Читать журнал
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

// --- Вспомогательные компоненты для чистоты кода ---

const ValueCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) => (
  <div className="p-8 rounded-2xl bg-slate-950 border border-white/5 hover:border-amber-500/30 transition-colors group">
    <div className="w-16 h-16 mx-auto bg-slate-900 rounded-full flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-500">
      {icon}
    </div>
    <h3 className="text-xl font-serif text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
  </div>
)

const TeamMember = ({ name, role, image }: { name: string; role: string; image?: string }) => (
  <div className="group">
    <div className="relative h-80 w-full bg-slate-800 rounded-xl overflow-hidden mb-5 grayscale group-hover:grayscale-0 transition-all duration-700">
      {image && !image.includes('path/to') ? (
        <Image src={image} alt={name} fill className="object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-900 border border-white/5">
          <UserPlaceholder />
        </div>
      )}
    </div>
    <h3 className="text-xl font-serif text-white group-hover:text-amber-200 transition-colors">
      {name}
    </h3>
    <p className="text-amber-500/80 text-sm uppercase tracking-wider font-bold mt-1">{role}</p>
  </div>
)

const UserPlaceholder = () => (
  <svg className="w-20 h-20 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)
