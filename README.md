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
- поставить [git-lfs](https://docs.github.com/en/repositories/working-with-files/managing-large-files/installing-git-large-file-storage) 
- в терминале перейти в корнь проекта 
- поставить зависимости
  `npm сi`
- для старта локального девсервера выполнить
  `npm run dev`

## 🚀 Структура

```text
├── public/
│   ├── fonts
│   ├── video
│   │   ├── README.md
│   │   ├── hevc.mov
│   │   ├── vp9.webm
├── backend/
│   ├── README.md
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
├── .env
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

### Backend
в качестве CRM используются гуглтаблицы 
в качестве API тоже используются гуглтаблицы с настроенными через AppScript раздачей json

[документация по настройке бекенда](./backend/README.md)

### 3d Animation
анимация на главной сделана через transparent video
поддерживается два браузера

[документация по конвертации](./public/video/README.md)
