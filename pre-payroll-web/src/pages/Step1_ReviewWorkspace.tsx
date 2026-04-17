import { useState } from 'react';
import type { ItemConfig } from './Step0_SelectItems';
import ItemWorkspace from '../components/ItemWorkspace';
import RemarkPanel from '../components/RemarkPanel';

export default function Step1_ReviewWorkspace({ items, onBack }: { items: ItemConfig[], onBack: () => void }) {
  const [activeItemId, setActiveItemId] = useState<string>(items[0]?.id || '');

  const activeItem = items.find((i) => i.id === activeItemId);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Main Area: Item List + Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f4f6f8]">
        
        {/* Top bar for items */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex space-x-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveItemId(item.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeItemId === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <button 
            onClick={onBack}
            className="text-sm text-slate-500 hover:text-slate-700 font-medium px-3 py-1"
          >
            Edit selection
          </button>
        </div>

        {/* Item Workspace */}
        <div className="flex-1 overflow-hidden p-6">
          {activeItem && <ItemWorkspace item={activeItem} />}
        </div>
      </div>

      {/* Right Global Area: Remark */}
      <div className="w-80 bg-white border-l border-slate-200 shrink-0 shadow-sm z-10 flex flex-col">
        <RemarkPanel />
      </div>

      {/* Fixed Footer for Workspace */}
      <div
        className="fixed bottom-0 right-0 h-16 bg-white border-t border-slate-200 px-6 flex items-center justify-between shadow-lg z-20"
        style={{ left: 'var(--sidebar-width)' }}
      >
        <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors">
          Close
        </button>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded-md text-sm font-medium transition-colors shadow-sm">
            Export
          </button>
          <button className="px-6 py-2 bg-[#3d50b6] text-white hover:bg-blue-800 rounded-md text-sm font-medium transition-colors shadow-sm">
            Complete Review
          </button>
        </div>
      </div>
    </div>
  );
}
