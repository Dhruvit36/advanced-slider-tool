import React, { useState } from 'react';
import { useSlider } from '../context/SliderContext';
import { SliderExporter, downloadFile, ExportOptions } from '../utils/export';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { state } = useSlider();
  const [exportFormat, setExportFormat] = useState<'html' | 'json' | 'css'>('html');
  const [options, setOptions] = useState<ExportOptions>({
    format: 'html',
    includeAnimations: true,
    includeStyles: true,
    autoplay: true,
    loop: true
  });
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !state.project) return null;

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      switch (exportFormat) {
        case 'html':
          const htmlContent = SliderExporter.exportToHTML(state.project, options);
          downloadFile(htmlContent, `${state.project.name}.html`, 'text/html');
          break;
          
        case 'json':
          const jsonContent = SliderExporter.exportToJSON(state.project);
          downloadFile(jsonContent, `${state.project.name}.json`, 'application/json');
          break;
          
        case 'css':
          const cssContent = SliderExporter.generateCSS(state.project, options);
          downloadFile(cssContent, `${state.project.name}.css`, 'text/css');
          break;
      }
      
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden transform transition-all relative z-[10000]">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <i className="fas fa-download text-white text-lg"></i>
              </div>
              <h2 className="text-xl font-bold text-white">Export Slider</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:bg-opacity-20 transition-all"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Export Format Section */}
          <div>
            <label className="block text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <i className="fas fa-file-export mr-2 text-purple-600"></i>
              Export Format
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-300 hover:bg-purple-50 group has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50">
                <input
                  type="radio"
                  value="html"
                  checked={exportFormat === 'html'}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="w-5 h-5 text-purple-600 border-2 border-gray-300 focus:ring-purple-500 focus:ring-2 accent-purple-600"
                />
                <div className="ml-4 flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors">
                    <i className="fab fa-html5 text-orange-600 text-lg"></i>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">HTML</span>
                    <p className="text-sm text-gray-500">Complete webpage</p>
                  </div>
                </div>
              </label>
              
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-300 hover:bg-purple-50 group has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50">
                <input
                  type="radio"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="w-5 h-5 text-purple-600 border-2 border-gray-300 focus:ring-purple-500 focus:ring-2 accent-purple-600"
                />
                <div className="ml-4 flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-200 transition-colors">
                    <i className="fas fa-code text-yellow-600 text-lg"></i>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">JSON</span>
                    <p className="text-sm text-gray-500">Project data</p>
                  </div>
                </div>
              </label>
              
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-300 hover:bg-purple-50 group has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50">
                <input
                  type="radio"
                  value="css"
                  checked={exportFormat === 'css'}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="w-5 h-5 text-purple-600 border-2 border-gray-300 focus:ring-purple-500 focus:ring-2 accent-purple-600"
                />
                <div className="ml-4 flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <i className="fab fa-css3-alt text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">CSS</span>
                    <p className="text-sm text-gray-500">Styles only</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Options Section */}
          {exportFormat === 'html' && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-200">
              <h3 className="font-semibold text-lg mb-4 text-gray-800 flex items-center">
                <i className="fas fa-cogs mr-2 text-blue-600"></i>
                Options
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-play text-purple-600"></i>
                    </div>
                    <span className="font-medium text-gray-900">Include animations</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={options.includeAnimations}
                    onChange={(e) => setOptions(prev => ({ ...prev, includeAnimations: e.target.checked }))}
                    className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 accent-purple-600"
                  />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-play-circle text-purple-600"></i>
                    </div>
                    <span className="font-medium text-gray-900">Autoplay slides</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={options.autoplay}
                    onChange={(e) => setOptions(prev => ({ ...prev, autoplay: e.target.checked }))}
                    className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 accent-purple-600"
                  />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-redo text-purple-600"></i>
                    </div>
                    <span className="font-medium text-gray-900">Loop slides</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={options.loop}
                    onChange={(e) => setOptions(prev => ({ ...prev, loop: e.target.checked }))}
                    className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 accent-purple-600"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Project Info Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
              <i className="fas fa-info-circle mr-2 text-gray-600"></i>
              Project Info
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-gray-600 flex items-center">
                  <i className="fas fa-tag mr-2"></i>
                  Name:
                </span>
                <span className="font-medium text-gray-900">{state.project.name}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-gray-600 flex items-center">
                  <i className="fas fa-images mr-2"></i>
                  Slides:
                </span>
                <span className="font-medium text-gray-900">{state.project.slides.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-gray-600 flex items-center">
                  <i className="fas fa-layer-group mr-2"></i>
                  Total Layers:
                </span>
                <span className="font-medium text-gray-900">{state.project.slides.reduce((sum, slide) => sum + slide.layers.length, 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all font-medium flex items-center"
          >
            <i className="fas fa-times mr-2"></i>
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center shadow-lg hover:shadow-xl"
          >
            {isExporting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Exporting...
              </>
            ) : (
              <>
                <i className="fas fa-download mr-2"></i>
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
