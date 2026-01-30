# 🎨 SketchCodeCompose

Visual HTML/CSS editor that generates clean, semantic code.

## 🌟 Features

- **Visual Composition**: Draw your UI like in Figma/Miro
- **Clean Code Generation**: Generates readable HTML/CSS
- **Semantic Learning**: Color-coded tags to learn proper markup
- **Smart Guides**: Snap to grid, alignment guides, spacing indicators
- **Flexible Layout**: Supports Flexbox and Grid
- **Auto-save**: Never lose your work
- **Export Options**: HTML/CSS, React (future), Vue (future)

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
SketchCodeCompose/
├── src/
│   ├── components/       # Vue components
│   ├── core/            # Business logic
│   ├── stores/          # Pinia stores
│   ├── composables/     # Vue composables
│   ├── constants/       # Constants
│   ├── assets/          # Styles and assets
│   └── main.js          # Entry point
├── public/              # Static files
└── package.json
```

## 🎯 Current Status

**v0.2.0 - Canvas Core** ✅

### ✅ Реализовано
- ✅ Архитектура проекта (Vue 3 + Pinia)
- ✅ Core models (Element, Project)
- ✅ Все Pinia stores (project, canvas, selection, settings, layout, editor)
- ✅ Адаптивная система панелей (4 режима: Default, Designer, Developer, Mini)
- ✅ Canvas с DOM-based рендерингом
- ✅ Выделение элементов (одиночное и множественное)
- ✅ Drag & Drop для перемещения элементов
- ✅ **Block Tool**: создание/удаление элементов (левый/правый клик)
- ✅ Создание дочерних элементов (клик внутри родителя)
- ✅ **Resize**: 9 ручек (8○ круглых + 1■ квадратная)
- ✅ **Reparent**: изменение родителя через центральную ручку
- ✅ Пропорциональное масштабирование (угловые ручки)
- ✅ Figma-style точечная сетка
- ✅ Snap to grid (перемещение + resize)
- ✅ Настройка размера сетки (1-64px)
- ✅ Горячие клавиши (G, Shift+G, Ctrl+N, Delete, Escape)
- ✅ Burger Menu с навигацией
- ✅ Floating Toolbar на Canvas
- ✅ Автосохранение

### ⏳ В разработке (Фаза 2)
- ⏳ Properties Panel - редактирование свойств элементов
- ⏳ Tree Panel - иерархическое дерево
- ⏳ Code Generation - HTML/CSS генераторы

### 📋 Планы (см. [ROADMAP.md](ROADMAP.md))
- Distance Indicators (расстояния как в Figma)
- Smart Guides (линии выравнивания)
- Undo/Redo (Command pattern)
- Zoom & Pan
- Save/Load проектов
- Export в HTML/CSS

## 📖 Документация

- [🗺️ ROADMAP](ROADMAP.md) - Карта развития проекта
- [🚀 Быстрый старт](docs/QUICK_START.md) - Гайд по использованию
- [🔧 Resize & Reparent](docs/RESIZE_REPARENT.md) - Техническая документация

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

