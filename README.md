# 🎬 Advanced Slider Tool

A powerful, modern web-based presentation and animation editor built with React, TypeScript, and Tailwind CSS. Create stunning animated presentations with a professional drag-and-drop interface.

![Advanced Slider Tool](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.2-38bdf8.svg)

## ✨ Features

### 🎨 Visual Editor
- **Drag & Drop Interface**: Intuitive visual editor with real-time manipulation
- **Multiple Layer Types**: Text, buttons, images, and shapes
- **Live Preview**: See your animations in real-time as you create them
- **Grid & Rulers**: Precision alignment tools for professional layouts
- **Zoom Controls**: Scale from 25% to 400% for detailed editing

### 🎭 Rich Animations
- **20+ Animation Presets**: 
  - **Entrance**: Fade In, Slide In (Left/Right/Up/Down), Scale In, Bounce In, Zoom In, Flip In, Rotate In
  - **Exit**: Fade Out, Slide Out (Left/Right/Up/Down), Scale Out, Bounce Out, Zoom Out, Flip Out, Rotate Out
- **Timing Controls**: Customizable duration, delay, and easing functions
- **Animation Timeline**: Visual timeline editor with layer tracks
- **Preview System**: Test animations before export

### 🎯 Professional Tools
- **Custom Color Picker**: Modern HSL-based color selection with hex input
- **Typography Controls**: Font family, size, weight, and color customization
- **Layout System**: Precise positioning with X/Y coordinates and dimensions
- **Layer Management**: Z-index control, opacity, rotation, and visibility
- **Template Library**: Pre-built slide templates for quick starts

### 📱 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Theme Ready**: Modern interface with clean aesthetics
- **Font Awesome Icons**: Professional iconography throughout
- **Contextual Panels**: Smart sidebar with tabs for different editing modes
- **Keyboard Shortcuts**: Power user shortcuts for efficiency

### 🚀 Export Options
- **HTML Export**: Standalone HTML files with embedded CSS and JavaScript
- **JSON Export**: Save and load project configurations
- **CSS Export**: Extract pure CSS animations for web development
- **Video Export**: Generate video files from your presentations *(coming soon)*

### ⌨️ Keyboard Shortcuts
- `Space` - Play/Pause animation preview
- `Ctrl + Z` / `Ctrl + Y` - Undo/Redo
- `Ctrl + C` / `Ctrl + V` - Copy/Paste layers
- `Ctrl + D` - Duplicate selected layer
- `Delete` - Delete selected layer
- `Ctrl + S` - Save project
- `Ctrl + E` - Export project
- `Arrow Keys` - Move layer by 1px
- `Shift + Arrow` - Move layer by 10px
- `Ctrl + +/-` - Zoom in/out
- `Tab` - Switch between sidebar tabs
- `Escape` - Deselect/Close modals

## 🛠️ Technologies Used

### Core Framework
- **React 18.2.0** - Modern React with hooks and functional components
- **TypeScript 5.2.2** - Type-safe development with full IntelliSense
- **Vite 5.0.0** - Lightning-fast build tool and dev server

### Styling & UI
- **Tailwind CSS 3.3.2** - Utility-first CSS framework
- **PostCSS & Autoprefixer** - CSS post-processing and vendor prefixes
- **Font Awesome 7.0.0** - Professional icon library

### State Management
- **Zustand 5.0.6** - Lightweight state management
- **Immer 10.1.1** - Immutable state updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/advanced-slider-tool.git
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
│   ├── components/           # React components
│   │   ├── Canvas.tsx       # Main canvas editor
│   │   ├── Timeline.tsx     # Animation timeline
│   │   ├── Sidebar.tsx      # Properties sidebar
│   │   ├── TopBar.tsx       # Navigation header
│   │   ├── panels/          # Sidebar panels
│   │   │   ├── PropertiesPanel.tsx
│   │   │   ├── AnimationsPanel.tsx
│   │   │   └── LayersPanel.tsx
│   │   └── ui/              # UI components
│   │       ├── ColorPicker.tsx
│   │       ├── CustomDropdown.tsx
│   │       └── CleanDropdown.tsx
│   ├── context/             # React context
│   │   └── SliderContext.tsx
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── animations.ts    # Animation presets
│   │   ├── templates.ts     # Slide templates
│   │   └── export.ts        # Export functionality
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
└── postcss.config.js       # PostCSS config
```

## 🎯 Usage Guide

### Creating Your First Slide

1. **Start with a Template**
   - Open the sidebar and navigate to the Templates tab
   - Choose from Hero Section, Features, or Call-to-Action templates
   - Click to apply and customize

2. **Add Elements**
   - Use the toolbar to add text, buttons, or shapes
   - Drag elements directly on the canvas
   - Use the Properties panel to customize appearance

3. **Apply Animations**
   - Select any element
   - Go to the Animations panel
   - Choose entrance and exit animations
   - Adjust timing and easing

4. **Preview & Export**
   - Use the timeline controls to preview animations
   - Export as HTML, JSON, or CSS when ready

### Timeline Editor

The timeline provides precise control over animation timing:

- **Play/Pause**: Control animation playback
- **Scrubbing**: Drag the playhead to any point
- **Layer Tracks**: Visual representation of each element's animations
- **Resize**: Adjust timeline height for better visibility
- **Markers**: Green (start) and red (end) animation markers

### Color Picker

The advanced color picker offers:
- **HSL Color Space**: Intuitive saturation/lightness area
- **Hue Slider**: Full spectrum hue selection
- **Color Palette**: Quick access to common colors
- **Hex Input**: Direct hex code entry
- **Live Preview**: Real-time color updates

## 🔧 Configuration

### Customizing Animations

Add new animation presets in `src/utils/animations.ts`:

```typescript
export const customAnimation: AnimationPreset = {
  name: 'My Custom Animation',
  type: 'entrance',
  keyframes: `
    from { opacity: 0; transform: scale(0.5); }
    to { opacity: 1; transform: scale(1); }
  `,
  duration: 800,
  easing: 'ease-out'
};
```

### Adding New Templates

Create slide templates in `src/utils/templates.ts`:

```typescript
const myTemplate: Slide = {
  id: 'my-template',
  name: 'My Template',
  background: {
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  layers: [
    // Define your layers here
  ],
  duration: 5000
};
```

## 🎨 Customization

### Theming

The application uses Tailwind CSS for styling. Customize the theme in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-primary-color',
        secondary: '#your-secondary-color',
      }
    }
  }
}
```

### Adding New Layer Types

Extend the layer system by:

1. Adding new types to `src/types/index.ts`
2. Implementing rendering logic in `Canvas.tsx`
3. Creating property panels for customization

## 🤝 Partnership & Custom Development

### 💼 Business Partnerships
We welcome partnerships and custom development opportunities:

### 🛠️ Custom Development Services
- **Feature Development**: Custom features tailored to your needs
- **Integration Services**: API integrations and third-party connections
- **White-label Solutions**: Branded versions for your organization
- **Consulting**: Technical consulting and implementation guidance

### 📋 Enterprise Solutions
- **Multi-tenant Architecture**: SaaS deployment options
- **Custom Branding**: Full white-label customization
- **Advanced Features**: Enterprise-grade functionality
- **Dedicated Support**: Priority technical support

### 📞 Get Started
Contact us to discuss your requirements:
- **Email**: [your-email@example.com](mailto:your-email@example.com)
- **Project Consultation**: Free initial consultation available

## 📜 License

This project is proprietary software licensed under a Commercial License Agreement. See the [LICENSE](LICENSE) file for complete terms and conditions.

**Commercial Use**: This software requires a valid license for commercial use. Contact us for licensing options and pricing.

**Evaluation**: A limited evaluation period may be available. Contact us for trial access.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Font Awesome** - For the comprehensive icon library
- **Vite Team** - For the fast build tool
- **Zustand** - For lightweight state management

## 📞 Support & Licensing

### 💼 Commercial Licensing
- � **License Inquiries**: [your-email@example.com](mailto:your-email@example.com)
- 💰 **Pricing**: Contact us for custom pricing based on your needs
- � **License Keys**: Provided upon purchase completion
- 📋 **Enterprise**: Volume licensing available for organizations

### 🛠️ Technical Support
- 🎯 **Priority Support**: Included with commercial licenses
- 📚 **Documentation**: Comprehensive guides and API documentation
- 🎓 **Training**: Available for enterprise customers
- 🔧 **Custom Development**: Tailored solutions available

### � Contact Information
- **Email**: [your-email@example.com](mailto:your-email@example.com)
- **Website**: [your-website.com](https://your-website.com)
- **Business Hours**: Monday-Friday, 9 AM - 6 PM (Your Timezone)

## 🗺️ Roadmap

### v1.1.0 (Coming Soon)
- [ ] Video layer support
- [ ] Audio integration
- [ ] Advanced easing curve editor
- [ ] Collaborative editing

### v1.2.0 (Future)
- [ ] Mobile app version
- [ ] Cloud storage integration
- [ ] Template marketplace
- [ ] Advanced export formats

### v2.0.0 (Vision)
- [ ] 3D animations and layers
- [ ] WebGL rendering
- [ ] Real-time collaboration
- [ ] Plugin system

---

**Made with ❤️ by the Dhruvit Navadiya**

*Turn your ideas into stunning animated presentations*
