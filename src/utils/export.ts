import { SliderProject } from '../types';

export interface ExportOptions {
  format: 'html' | 'json' | 'css' | 'video';
  includeAnimations: boolean;
  includeStyles: boolean;
  autoplay: boolean;
  loop: boolean;
}

export class SliderExporter {
  static exportToJSON(project: SliderProject): string {
    return JSON.stringify(project, null, 2);
  }

  static exportToHTML(project: SliderProject, options: ExportOptions): string {
    const cssStyles = this.generateCSS(project, options);
    const jsCode = this.generateJavaScript(project, options);
    const htmlContent = this.generateHTML(project);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
    <style>
${cssStyles}
    </style>
</head>
<body>
${htmlContent}
    <script>
${jsCode}
    </script>
</body>
</html>`;
  }

  static generateCSS(project: SliderProject, options: ExportOptions): string {
    return `
/* Slider Revolution Export */
.slider-container {
    position: relative;
    width: 100%;
    max-width: 1200px;
    height: 600px;
    margin: 0 auto;
    overflow: hidden;
    background: #000;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.8s ease-in-out;
}

.slide.active {
    opacity: 1;
}

.layer {
    position: absolute;
    transition: all 0.3s ease;
}

.navigation {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.8);
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.3s ease;
    z-index: 100;
}

.navigation:hover {
    background: rgba(255,255,255,1);
    transform: translateY(-50%) scale(1.1);
}

.nav-prev {
    left: 20px;
}

.nav-next {
    right: 20px;
}

.pagination {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 100;
}

.pagination-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
    cursor: pointer;
    transition: all 0.3s ease;
}

.pagination-dot.active,
.pagination-dot:hover {
    background: rgba(255,255,255,1);
    transform: scale(1.2);
}

/* Animation Classes */
${options.includeAnimations ? this.generateAnimationCSS() : ''}

/* Responsive Design */
@media (max-width: 768px) {
    .slider-container {
        height: 400px;
    }
    
    .layer {
        font-size: 0.8em !important;
    }
    
    .navigation {
        width: 40px;
        height: 40px;
        font-size: 14px;
    }
}
    `;
  }

  static generateAnimationCSS(): string {
    return `
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-100px); }
    to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInRight {
    from { opacity: 0; transform: translateX(100px); }
    to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInUp {
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInDown {
    from { opacity: 0; transform: translateY(-50px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
}

@keyframes bounceIn {
    0% { opacity: 0; transform: scale3d(0.3, 0.3, 0.3); }
    20% { transform: scale3d(1.1, 1.1, 1.1); }
    40% { transform: scale3d(0.9, 0.9, 0.9); }
    60% { opacity: 1; transform: scale3d(1.03, 1.03, 1.03); }
    80% { transform: scale3d(0.97, 0.97, 0.97); }
    100% { opacity: 1; transform: scale3d(1, 1, 1); }
}

.fade-in { animation: fadeIn 0.6s ease-out forwards; }
.slide-in-left { animation: slideInLeft 0.8s ease-out forwards; }
.slide-in-right { animation: slideInRight 0.8s ease-out forwards; }
.slide-in-up { animation: slideInUp 0.8s ease-out forwards; }
.slide-in-down { animation: slideInDown 0.8s ease-out forwards; }
.scale-in { animation: scaleIn 0.6s ease-out forwards; }
.bounce-in { animation: bounceIn 1s ease-out forwards; }
    `;
  }

  static generateJavaScript(project: SliderProject, options: ExportOptions): string {
    return `
class SliderRevolution {
    constructor(container) {
        this.container = container;
        this.slides = Array.from(container.querySelectorAll('.slide'));
        this.currentSlide = 0;
        this.autoplay = ${options.autoplay};
        this.loop = ${options.loop};
        this.autoplayTimer = null;
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupPagination();
        this.showSlide(0);
        
        if (this.autoplay) {
            this.startAutoplay();
        }
    }
    
    setupNavigation() {
        const prevBtn = this.container.querySelector('.nav-prev');
        const nextBtn = this.container.querySelector('.nav-next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    setupPagination() {
        const dots = Array.from(this.container.querySelectorAll('.pagination-dot'));
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
    }
    
    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        
        const dots = Array.from(this.container.querySelectorAll('.pagination-dot'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            
            // Trigger animations
            this.animateSlide(this.slides[index]);
        }
        
        this.currentSlide = index;
    }
    
    animateSlide(slide) {
        const layers = Array.from(slide.querySelectorAll('.layer'));
        layers.forEach((layer, index) => {
            const animationClass = layer.dataset.animation || 'fade-in';
            const delay = parseInt(layer.dataset.delay || '0') + (index * 200);
            
            setTimeout(() => {
                layer.classList.add(animationClass);
            }, delay);
        });
    }
    
    nextSlide() {
        let next = this.currentSlide + 1;
        if (next >= this.slides.length) {
            next = this.loop ? 0 : this.slides.length - 1;
        }
        this.goToSlide(next);
    }
    
    prevSlide() {
        let prev = this.currentSlide - 1;
        if (prev < 0) {
            prev = this.loop ? this.slides.length - 1 : 0;
        }
        this.goToSlide(prev);
    }
    
    goToSlide(index) {
        if (index !== this.currentSlide) {
            this.showSlide(index);
            
            if (this.autoplay) {
                this.stopAutoplay();
                this.startAutoplay();
            }
        }
    }
    
    startAutoplay() {
        this.autoplayTimer = setInterval(() => {
            this.nextSlide();
        }, ${project.settings.transitionDuration + 3000});
    }
    
    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        new SliderRevolution(sliderContainer);
    }
});
    `;
  }

  static generateHTML(project: SliderProject): string {
    const slidesHTML = project.slides.map((slide, slideIndex) => {
      const layersHTML = slide.layers.map(layer => {
        const animation = layer.animation.entrance.toLowerCase().replace(/\s+/g, '-');
        
        return `
        <div class="layer" 
             data-animation="${animation}" 
             data-delay="${layer.animation.delay}"
             style="
                 left: ${layer.style.x}px;
                 top: ${layer.style.y}px;
                 width: ${layer.style.width}px;
                 height: ${layer.style.height}px;
                 font-size: ${layer.style.fontSize || 16}px;
                 font-weight: ${layer.style.fontWeight || 'normal'};
                 color: ${layer.style.color || '#000'};
                 background-color: ${layer.style.backgroundColor || 'transparent'};
                 border-radius: ${layer.style.borderRadius || 0}px;
                 opacity: ${layer.style.opacity};
                 transform: rotate(${layer.style.rotation}deg);
                 z-index: ${layer.style.zIndex};
                 display: flex;
                 align-items: center;
                 justify-content: ${layer.type === 'button' ? 'center' : 'flex-start'};
             ">
            ${layer.type === 'image' 
              ? `<img src="${layer.content}" alt="Layer Image" style="width: 100%; height: 100%; object-fit: cover;">`
              : layer.content
            }
        </div>`;
      }).join('');

      return `
    <div class="slide ${slideIndex === 0 ? 'active' : ''}" 
         style="background: ${slide.background.value};">
        ${layersHTML}
    </div>`;
    }).join('');

    const paginationHTML = project.slides.map((_, index) => 
      `<div class="pagination-dot ${index === 0 ? 'active' : ''}"></div>`
    ).join('');

    return `
    <div class="slider-container">
        ${slidesHTML}
        
        <button class="navigation nav-prev">‹</button>
        <button class="navigation nav-next">›</button>
        
        <div class="pagination">
            ${paginationHTML}
        </div>
    </div>`;
  }

  static async exportAsVideo(project: SliderProject): Promise<Blob> {
    // This would require a more complex implementation with canvas recording
    // For now, we'll return a placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 600;
    
    // This is a simplified version - real implementation would need MediaRecorder API
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob || new Blob());
      });
    });
  }
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
