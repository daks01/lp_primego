# Readme

> Сайт собран с помощью Astro.Build 
- [Blog](https://github.com/withastro/astro/assets/2244813/ff10799f-a816-4703-b967-c78997e8323d)
- [Documentation](https://docs.astro.build) 
- [Discord server](https://astro.build/chat)

Фичи:
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly
- ✅ Sitemap
- ✅ JSX в качестве шаблонизатора
- ✅ генерация статичного сайта
- ✅ возможность писать компоненты на любом фреймворке: react, vue, svelte etc
- ✅ и встраивать их в статичный сайт как интерактивные острова

## 🧞 API
[Инструкция по разработке API](backend/readme.md)

## 🧞 Как какать 
для локальной разработки и билда статичного сайта нужно:
- поставить Node.js (lts) https://nodejs.org/en
- в терминале перейти в корнь проекта 
- поставить зависимости
  `npm i`
- для старта локального девсервера выполнить
  `npm run dev`

Список команд:
| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🚀 Структура

```text
├── public/
├── backend/
│   ├── googleAppScriptBackend.gs
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── content/
│   │   ├── islands/
│   ├── assets/
│   ├── layouts/
│   ├── utils/
│   └── pages/
├── astro.config.mjs
├── README.md
└── package.json
```

В папке `/layout` лежит шаблон для всех страниц

Файлы `*.astro` в папке `src/pages/` - это страницы сайта.
Роуты строятся на основе имен этих файлов

В папке `src/components/` в подпахках лежат:
- `ui` - компоненты (кнопка, контейнер итп)
- `layout` - компоненты (шапка, подвал)
- `content` - переиспользуемые блоки (секции) с контентом
  из которых собраны страницы
- `islands` - vue (react\svelte\etc) компоненты
  (встраиваются подобно виджетам, не блокирую общий ренедр страницы)

Статика:
- фавиконки и шрифты лежат в `public/`
  (те файлы, которые не нуждаются в трансформации или оптимизации)
- глобальные стили в `/assets/css`
- картинки `/assets/images`
  подключаются через компонент <Image /> или <Picture > и оптимизируются при билде
  картики, подключенные через <img> или `style='background-image'` не оптимизируются,(

## Деплой
билд и деплой происходит автоматически (GitlabAction) на push в репозиторий

### Staging
- для деплоя на стейдж нужно запушить в ветку 'main'

### Production
- для деплоя на прод нужно подлить ветку 'main' в ветку 'production'

