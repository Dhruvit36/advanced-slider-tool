# 🎬 Advanced Slider Tool

A powerful, modern web-based presentation and animation editor built with React, TypeScript, and Tailwind CSS. Create stunning animated presentations with a professional drag-and-drop interface, timeline-based animations, and comprehensive export options.

![Advanced Slider Tool](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.2-38bdf8.svg)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646cff.svg)

## ✨ Features

### 🎨 Visual Editor
- **Drag & Drop Interface**: Intuitive visual editor with real-time manipulation
- **Multiple Layer Types**: Text, buttons, images, and shapes with full customization
- **Live Preview**: See your animations in real-time as you create them
- **Grid & Rulers**: Precision alignment tools with canvas grid and rulers overlay
- **Zoom Controls**: Scale from 25% to 400% for detailed editing
- **Alignment Guides**: Smart alignment guides for precise element positioning
- **Layer Management**: Advanced layer system with opacity, rotation, and z-index control

### 🎭 Rich Animations & Timeline
- **20+ Animation Presets**: 
  - **Entrance**: Fade In, Slide In (Left/Right/Up/Down), Scale In, Bounce In, Zoom In, Flip In, Rotate In
  - **Exit**: Fade Out, Slide Out (Left/Right/Up/Down), Scale Out, Bounce Out, Zoom Out, Flip Out, Rotate Out
- **Advanced Timeline Editor**: Visual timeline with precise timing control
- **Animation Block System**: Individual animation blocks with customizable duration and delay
- **Easing Functions**: Multiple easing options with advanced curve editor
- **Timing Controls**: Customizable duration, delay, and easing functions
- **Preview System**: Real-time animation preview with playback controls
- **Timeline Markers**: Visual start/end markers for animation timing

### 🎯 Professional Tools & Performance
- **Performance Monitoring**: Built-in performance monitoring with FPS tracking
- **Virtual Scrolling**: Optimized rendering for large datasets and smooth scrolling
- **Canvas Optimizations**: High-performance canvas rendering with layer caching
- **Keyboard Shortcuts**: Comprehensive keyboard shortcuts for power users
- **Undo/Redo System**: Full history management with unlimited undo/redo
- **Custom Color Picker**: Advanced HSL-based color selection with palette support
- **Typography Controls**: Complete font styling with Google Fonts integration
- **Template System**: Pre-built slide templates and custom template creation

### 📱 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Multiple Sidebar Versions**: Enhanced sidebar with refactored and performant components
- **Dark Theme Ready**: Modern interface with clean aesthetics and professional styling
- **Font Awesome Icons**: Professional iconography with Font Awesome 7.0.0
- **Advanced Dropdowns**: Multiple dropdown variants (Clean, Enhanced, Compact, Custom)
- **Contextual Panels**: Smart tabbed sidebar (Properties, Animations, Layers, Media)
- **Media Library**: Integrated media management and library system
- **Character Panel**: Advanced text editing with character-level control
- **Scale Controls**: Precision zoom and scale selection tools
- **Tooltip System**: Contextual help and information tooltips

### 🚀 Export & Integration Options
- **HTML Export**: Standalone HTML files with embedded CSS and JavaScript animations
- **JSON Export**: Complete project serialization for save/load functionality
- **CSS Export**: Pure CSS animations for web development integration
- **Multi-format Support**: Export in various formats for different use cases
- **Template Export**: Save custom templates for reuse
- **Video Export**: Generate video files from presentations *(in development)*
- **Performance Reports**: Export performance metrics and optimization data

### ⌨️ Keyboard Shortcuts
- `Space` - Play/Pause animation preview
- `Ctrl + Z` / `Ctrl + Y` - Undo/Redo operations
- `Ctrl + C` / `Ctrl + V` - Copy/Paste layers
- `Ctrl + D` - Duplicate selected layer
- `Delete` - Delete selected layer
- `Ctrl + S` - Save project
- `Ctrl + E` - Export project
- `Arrow Keys` - Move layer by 1px (fine positioning)
- `Shift + Arrow` - Move layer by 10px (coarse positioning)
- `Ctrl + +/-` - Zoom in/out on canvas
- `Ctrl + 0` - Reset zoom to 100%
- `Tab` - Switch between sidebar tabs
- `Escape` - Deselect layers/Close modals
- `?` - Show keyboard shortcuts help panel
- `F` - Fit canvas to viewport
- `1-9` - Quick zoom levels (10%-90%)

## 🛠️ Technologies Used

### Core Framework
- **React 18.2.0** - Modern React with hooks, functional components, and concurrent features
- **TypeScript 5.2.2** - Type-safe development with full IntelliSense and strict typing
- **Vite 5.0.0** - Lightning-fast build tool with hot module replacement (HMR)

### Styling & UI
- **Tailwind CSS 3.3.2** - Utility-first CSS framework with custom configuration
- **PostCSS & Autoprefixer** - CSS post-processing and vendor prefixes
- **Font Awesome 7.0.0** - Professional icon library with extensive icon sets

### State Management & Performance
- **React Context + useReducer** - Built-in React state management with context providers
- **Immer 10.1.1** - Immutable state updates with structural sharing
- **Custom Hooks System** - Specialized hooks for canvas, animations, keyboard shortcuts, and performance
- **Performance Monitoring** - Built-in FPS tracking and performance optimization tools
- **Virtual Scrolling** - Optimized rendering for large datasets

### Development Tools
- **ESLint & Prettier** - Code quality and formatting standards
- **TypeScript Strict Mode** - Enhanced type checking and error prevention
- **Component Architecture** - Modular, reusable component system
- **Custom Hook Library** - Specialized hooks for different functionalities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dhruvit36/advanced-slider-tool.git
   cd advanced-slider-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production
```bash
npm run build
```

Preview the build:
```bash
npm run preview
```

## 📁 Project Structure

```
advanced-slider-tool/
├── src/
│   ├── components/              # React components
│   │   ├── Canvas.tsx          # Main canvas editor with drag & drop
│   │   ├── PerformantCanvas.tsx # Optimized canvas with performance improvements
│   │   ├── Timeline.tsx        # Animation timeline with playback controls
│   │   ├── Sidebar.tsx         # Main properties sidebar
│   │   ├── SidebarRefactored.tsx # Enhanced sidebar with improved UI
│   │   ├── TopBar.tsx          # Navigation header with tools
│   │   ├── PerformantTopBar.tsx # Optimized top bar component
│   │   ├── Shape.tsx           # Shape rendering and manipulation
│   │   ├── ExportModal.tsx     # Export functionality modal
│   │   ├── MediaLibrary.tsx    # Media asset management
│   │   ├── KeyboardShortcuts.tsx # Keyboard shortcuts help panel
│   │   ├── PerformanceMonitor.tsx # Performance monitoring display
│   │   ├── VirtualScroll.tsx   # Virtual scrolling optimization
│   │   ├── SlideThumbnails.tsx # Slide thumbnail navigation
│   │   ├── canvas/             # Canvas-specific components
│   │   │   ├── CanvasLayer.tsx      # Layer management system
│   │   │   ├── CanvasControls.tsx   # Canvas control buttons
│   │   │   ├── CanvasGrid.tsx       # Grid overlay system
│   │   │   ├── CanvasRulers.tsx     # Ruler measurement tools
│   │   │   ├── CanvasStatusBar.tsx  # Canvas status information
│   │   │   └── CanvasAlignmentGuides.tsx # Smart alignment guides
│   │   ├── panels/             # Sidebar panels
│   │   │   ├── PropertiesPanel.tsx  # Element properties editor
│   │   │   ├── AnimationsPanel.tsx  # Animation settings panel
│   │   │   ├── LayersPanel.tsx      # Layer management panel
│   │   │   └── MediaPanel.tsx       # Media library panel
│   │   ├── timeline/           # Timeline-specific components
│   │   │   ├── TimelineControls.tsx     # Playback controls
│   │   │   ├── TimelinePlayhead.tsx     # Timeline cursor/playhead
│   │   │   ├── TimelineMarkers.tsx      # Time markers and indicators
│   │   │   ├── AnimationBlock.tsx       # Individual animation blocks
│   │   │   ├── LayersPanel.tsx          # Timeline layer tracks
│   │   │   └── types.ts                 # Timeline type definitions
│   │   └── ui/                 # Reusable UI components
│   │       ├── ColorPicker.tsx          # Advanced color selection
│   │       ├── CustomDropdown.tsx       # Custom dropdown component
│   │       ├── CleanDropdown.tsx        # Clean dropdown variant
│   │       ├── EnhancedDropdown.tsx     # Enhanced dropdown with features
│   │       ├── CompactSelect.tsx        # Compact selection component
│   │       ├── Select.tsx               # Basic select component
│   │       ├── ScaleSelect.tsx          # Zoom/scale selector
│   │       ├── Tooltip.tsx              # Contextual tooltips
│   │       ├── TypographyEditor.tsx     # Text styling editor
│   │       ├── CharacterPanel.tsx       # Character-level text editing
│   │       ├── AnimationButtonSelector.tsx # Animation preset selector
│   │       ├── EasingButtonSelector.tsx # Easing function selector
│   │       └── index.ts                 # UI components barrel export
│   ├── context/                # React context providers
│   │   └── SliderContext.tsx   # Main application state context
│   ├── hooks/                  # Custom React hooks
│   │   ├── useCanvasAnimations.ts       # Canvas animation logic
│   │   ├── useCanvasDragDrop.ts         # Drag & drop functionality
│   │   ├── useCanvasKeyboardShortcuts.ts # Canvas-specific shortcuts
│   │   ├── useCanvasSettings.ts         # Canvas configuration
│   │   ├── useCanvasZoom.ts             # Canvas zoom functionality
│   │   ├── useKeyboardShortcuts.ts      # Global keyboard shortcuts
│   │   ├── usePerformanceMonitor.ts     # Performance monitoring hook
│   │   └── useUndoRedo.ts               # Undo/redo functionality
│   ├── types/                  # TypeScript definitions
│   │   └── index.ts            # Main type definitions and interfaces
│   ├── utils/                  # Utility functions
│   │   ├── animations.ts       # Animation presets and logic
│   │   ├── animationMapper.ts  # Animation mapping utilities
│   │   ├── templates.ts        # Slide templates
│   │   └── export.ts           # Export functionality (HTML/CSS/JSON)
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # App entry point
│   └── index.css               # Global styles and Tailwind directives
├── public/                     # Static assets
├── package.json                # Dependencies and project configuration
├── vite.config.ts             # Vite build configuration
├── tailwind.config.js         # Tailwind CSS customization
├── postcss.config.js          # PostCSS configuration
├── .gitignore                 # Git ignore rules
├── LICENSE                    # Project license
└── README.md                  # Project documentation
```

## 🎯 Usage Guide

### Creating Your First Slide

1. **Start with the Canvas**
   - The main canvas provides a drag-and-drop interface for creating presentations
   - Use the grid and rulers for precise positioning
   - Zoom controls (25%-400%) for detailed editing

2. **Add Elements**
   - Use the toolbar to add text, buttons, shapes, or images
   - Drag elements directly onto the canvas
   - Use the Properties panel for detailed customization
   - Layer management with opacity, rotation, and z-index controls

3. **Apply Animations**
   - Select any element on the canvas
   - Navigate to the Animations panel in the sidebar
   - Choose from 20+ entrance and exit animations
   - Adjust timing, duration, delay, and easing functions
   - Use the Animation Button Selector for quick preset application

4. **Timeline Management**
   - Use the advanced timeline editor for precise animation control
   - Drag the playhead to scrub through animations
   - Individual animation blocks with customizable properties
   - Layer tracks show all animated elements
   - Timeline markers indicate start/end animation points

5. **Preview & Export**
   - Use timeline controls for real-time animation preview
   - Performance monitor shows FPS and rendering metrics
   - Export as HTML (standalone), JSON (project save), or CSS (animations only)
   - Video export capabilities (in development)

### Advanced Features

#### Performance Monitoring
- Built-in FPS tracking and performance metrics
- Real-time performance data in the status bar
- Optimization suggestions for better performance
- Memory usage tracking for large projects

#### Virtual Scrolling
- Optimized rendering for projects with many elements
- Smooth scrolling performance even with hundreds of layers
- Automatic virtualization of off-screen content

#### Keyboard Shortcuts System
- Comprehensive keyboard shortcuts for power users
- Help panel accessible via `?` key
- Canvas-specific shortcuts for precise control
- Global shortcuts for common operations

### Timeline Editor

The advanced timeline provides comprehensive control over animation timing:

- **Playback Controls**: Play, pause, stop, and scrub through animations
- **Playhead System**: Drag the playhead to any point in the timeline
- **Animation Blocks**: Visual representation of individual animation segments
- **Layer Tracks**: Each element gets its own track showing animation timing
- **Timeline Markers**: Green (start) and red (end) animation indicators
- **Zoom Controls**: Zoom in/out on the timeline for precise editing
- **Performance Optimized**: Smooth playback even with complex animations

### UI Component System

The application features a comprehensive set of reusable UI components:

- **Multiple Dropdown Variants**: Clean, Enhanced, Compact, and Custom dropdowns
- **Advanced Color Picker**: HSL-based with palette and hex input support
- **Typography Editor**: Complete text styling with font controls
- **Character Panel**: Character-level text editing and formatting
- **Scale Controls**: Precision zoom and scale selection
- **Animation Selectors**: Quick access to animation presets and easing functions
- **Tooltip System**: Contextual help throughout the interface

## 🔧 Configuration & Customization

### Adding Custom Animations

Create new animation presets in `src/utils/animations.ts`:

```typescript
export const customAnimation: AnimationPreset = {
  name: 'My Custom Animation',
  type: 'entrance',
  keyframes: `
    from { opacity: 0; transform: scale(0.5) rotate(180deg); }
    to { opacity: 1; transform: scale(1) rotate(0deg); }
  `,
  duration: 800,
  easing: 'ease-out'
};
```

### Creating Custom Templates

Add new slide templates in `src/utils/templates.ts`:

```typescript
const myTemplate: Slide = {
  id: 'my-custom-template',
  name: 'My Custom Template',
  background: {
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  layers: [
    // Define your layers with positions, animations, and properties
  ],
  duration: 5000
};
```

### Customizing the Theme

Modify the Tailwind CSS configuration in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        secondary: '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

### Extending UI Components

Create new UI components following the existing pattern in `src/components/ui/`:

```typescript
// src/components/ui/MyCustomComponent.tsx
export function MyCustomComponent({ ...props }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      {/* Your component content */}
    </div>
  );
}

// Export in src/components/ui/index.ts
export { MyCustomComponent } from './MyCustomComponent';
```

### Performance Optimization

The project includes several performance optimization features:

- **Virtual Scrolling**: Automatically handles large lists and datasets
- **Canvas Performance**: Optimized rendering with `PerformantCanvas` and `PerformantLayer`  
- **Component Memoization**: Strategic use of React.memo and useMemo
- **Performance Monitoring**: Built-in FPS tracking and performance metrics

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the powerful React framework and ecosystem
- **Tailwind CSS** - For the utility-first CSS framework and design system
- **Font Awesome** - For the comprehensive professional icon library
- **Vite Team** - For the lightning-fast build tool and development experience
- **TypeScript Team** - For type-safe JavaScript development
- **Open Source Community** - For the amazing tools and libraries that make this project possible

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📞 Contact Information
- **GitHub**: [Dhruvit36](https://github.com/Dhruvit36)
- **Repository**: [advanced-slider-tool](https://github.com/Dhruvit36/advanced-slider-tool)
- **Issues & Support**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for community support and ideas

---

**Made with ❤️ by Dhruvit Navadiya**

*Transform your ideas into stunning animated presentations with professional-grade tools and performance optimization.*
