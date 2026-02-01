import { CollectionConfig, FieldHook } from 'payload'
import { formatSlug } from '@/components/utils/formatSlug'

const formatSlugHook: FieldHook = async ({ value, data }) => {

  if (value && typeof value === 'string') {
    return formatSlug(value)
  }

  if (data?.title && typeof data.title === 'string') {
    return formatSlug(data.title)
  }

  return value
}
export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedDate'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Генерируется автоматически из заголовка, если оставить пустым.',
      },
      hooks: {
        beforeValidate: [formatSlugHook],
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Прогноз', value: 'forecast' },
        { label: 'Обучение', value: 'education' },
        { label: 'Эзотерика', value: 'esoterics' },
      ],
      defaultValue: 'esoterics',
      required: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'author_id',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'author_name',
      type: 'text',
      required: true,
    },
  ],
}
