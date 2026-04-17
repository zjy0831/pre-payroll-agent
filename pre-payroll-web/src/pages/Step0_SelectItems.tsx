import { useState } from 'react';
import { Settings2, CheckCircle2, ChevronRight, CheckSquare, Square, Info } from 'lucide-react';

type SetupParams = {
  dateStart?: string;
  dateEnd?: string;
  countType?: string;
};

export type ItemConfig = {
  id: string;
  name: string;
  desc: string;
  needsSetup: boolean;
  status: 'Not selected' | 'Selected' | 'Needs setup' | 'Ready';
  params?: SetupParams;
};

const PAYRUN = '2026-04';

function getDefaultDateRange(payrun: string) {
  const [yearStr, monthStr] = payrun.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  const pad = (n: number) => String(n).padStart(2, '0');
  const toDateInputValue = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  return {
    dateStart: toDateInputValue(start),
    dateEnd: toDateInputValue(end),
  };
}

function getDefaultSetupParams() {
  const { dateStart, dateEnd } = getDefaultDateRange(PAYRUN);
  return { dateStart, dateEnd, countType: 'Calendar Days' } satisfies SetupParams;
}

const INITIAL_ITEMS: ItemConfig[] = [
  { id: 'holiday', name: 'Holiday', desc: 'Identify attendance on holidays/rest days', needsSetup: true, status: 'Not selected' },
  { id: 'attendance', name: 'Attendance', desc: 'Missing clock-in/out, night shift patterns', needsSetup: false, status: 'Not selected' },
  { id: 'ot', name: 'OT Compensation', desc: 'Overtime threshold and approval check', needsSetup: false, status: 'Not selected' },
  { id: 'leave', name: 'Leave', desc: 'Overlap between attendance and leave, abnormal patterns', needsSetup: true, status: 'Not selected' },
  { id: 'leave_status', name: 'Leave Status', desc: 'Pending leaves impacting payroll', needsSetup: true, status: 'Not selected' },
  { id: 'leave_encash_ye', name: 'Leave Encash Year End', desc: 'Year-end encashment qualification', needsSetup: true, status: 'Not selected' },
];

export default function Step0_SelectItems({ onContinue }: { onContinue: (items: ItemConfig[]) => void }) {
  const [items, setItems] = useState<ItemConfig[]>(INITIAL_ITEMS);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const handleToggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isCurrentlySelected = item.status !== 'Not selected';
          if (isCurrentlySelected) {
            return { ...item, status: 'Not selected', params: undefined };
          } else {
            return item.needsSetup
              ? { ...item, status: 'Ready', params: getDefaultSetupParams() }
              : { ...item, status: 'Ready' };
          }
        }
        return item;
      })
    );
    setActiveItemId(id);
  };

  const handleParamChange = (id: string, key: keyof SetupParams, value: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newParams: SetupParams = { ...(item.params ?? {}), [key]: value };
          const isReady = Boolean(newParams.dateStart && newParams.dateEnd && newParams.countType);
          return {
            ...item,
            params: newParams,
            status: isReady ? 'Ready' : 'Needs setup',
          };
        }
        return item;
      })
    );
  };

  const selectedItems = items.filter((i) => i.status !== 'Not selected');
  const needsSetupItems = selectedItems.filter((i) => i.status === 'Needs setup');
  const canContinue = selectedItems.length > 0 && needsSetupItems.length === 0;

  const activeItem = items.find((i) => i.id === activeItemId);

  return (
    <div className="flex flex-col h-full relative pb-20">
      {/* Top Header Row */}
      <div className="px-8 py-6 bg-white border-b border-slate-200 shrink-0">
        <h2 className="text-2xl font-bold text-slate-900">Select Leave & Attendance Items</h2>
        <p className="text-sm text-slate-500 mt-1">
          The items you select here will determine the review blocks generated in the main workspace.
        </p>
        <div className="flex items-center space-x-6 mt-4 text-sm text-slate-600">
          <div className="flex items-center"><span className="font-semibold mr-2">Payrun:</span> 2026-04</div>
          <div className="flex items-center"><span className="font-semibold mr-2">Assignee:</span> Zhang San</div>
          <div className="flex items-center"><span className="font-semibold mr-2">Due Date:</span> 2026-04-20</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row px-8 py-6 space-y-6 lg:space-y-0 lg:space-x-8">
        
        {/* Left Column: Select Items */}
        <div className="flex-1 lg:w-1/2 flex flex-col min-h-0 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
            <h3 className="text-base font-semibold text-slate-800">Select items</h3>
            <button
              onClick={() => {
                setItems((prev) =>
                  prev.map((i) =>
                    i.needsSetup
                      ? { ...i, status: 'Ready', params: getDefaultSetupParams() }
                      : { ...i, status: 'Ready' }
                  )
                );
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Select all available
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.map((item) => {
              const isSelected = item.status !== 'Not selected';
              const isActive = activeItemId === item.id;
              
              return (
                <div 
                  key={item.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${isActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  onClick={() => setActiveItemId(item.id)}
                >
                  <div className="flex items-start">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleToggleItem(item.id); }}
                      className="mt-0.5 mr-3 text-slate-400 hover:text-blue-600 focus:outline-none"
                    >
                      {isSelected ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 text-sm">{item.name}</span>
                        {item.status === 'Ready' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1"/> Ready</span>}
                        {item.status === 'Needs setup' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800"><Settings2 className="w-3 h-3 mr-1"/> Needs setup</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                      
                      {item.status === 'Ready' && item.params && (
                        <div className="mt-3 p-2 bg-slate-50 rounded text-xs text-slate-600 flex items-start">
                          <Info className="w-3.5 h-3.5 text-slate-400 mr-1.5 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{JSON.stringify(item.params).replace(/[{}"]/g, '')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Setup Form */}
        <div className="flex-1 lg:w-1/2 flex flex-col min-h-0 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
            <h3 className="text-base font-semibold text-slate-800">Set up selected item</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col">
            {!activeItem ? (
              <div className="m-auto text-center text-slate-400">
                <Settings2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Select an item on the left to set it up.</p>
              </div>
            ) : !activeItem.needsSetup ? (
              <div className="m-auto text-center text-slate-500">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-400 opacity-80" />
                <p className="text-sm font-medium">No setup required</p>
                <p className="text-xs mt-1">This item will be processed with default system rules.</p>
              </div>
            ) : activeItem.status === 'Not selected' ? (
              <div className="m-auto text-center text-slate-500">
                <p className="text-sm">Please check the box to select "{activeItem.name}" before setting it up.</p>
              </div>
            ) : (
              <div className="max-w-md">
                <h4 className="font-semibold text-slate-800 mb-4">{activeItem.name} Parameters</h4>
                
                {/* Auto-saving Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date Range <span className="text-red-500">*</span></label>
                    <div className="flex space-x-2">
                      <input 
                        type="date" 
                        value={activeItem.params?.dateStart ?? ''}
                        onChange={(e) => handleParamChange(activeItem.id, 'dateStart', e.target.value)}
                        className="block w-full rounded-md border border-slate-300 py-1.5 px-3 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none" 
                      />
                      <span className="text-slate-400 self-center">-</span>
                      <input 
                        type="date" 
                        value={activeItem.params?.dateEnd ?? ''}
                        onChange={(e) => handleParamChange(activeItem.id, 'dateEnd', e.target.value)}
                        className="block w-full rounded-md border border-slate-300 py-1.5 px-3 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Count total days <span className="text-red-500">*</span></label>
                    <select 
                      value={activeItem.params?.countType ?? ''}
                      onChange={(e) => handleParamChange(activeItem.id, 'countType', e.target.value)}
                      className="block w-full rounded-md border border-slate-300 py-1.5 px-3 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none"
                    >
                      <option value="" disabled>Select an option...</option>
                      <option value="Calendar Days">Calendar Days</option>
                      <option value="Working Days">Working Days</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Summary Bar */}
      <div
        className="fixed bottom-0 right-0 h-16 bg-white border-t border-slate-200 px-8 flex items-center justify-between shadow-lg z-10"
        style={{ left: 'var(--sidebar-width)' }}
      >
        <div className="flex items-center space-x-6 text-sm">
          <div className="text-slate-600"><span className="font-semibold text-slate-900">{selectedItems.length}</span> selected items</div>
          {needsSetupItems.length > 0 && (
            <div className="text-amber-600 font-medium"><span className="font-semibold">{needsSetupItems.length}</span> still need setup</div>
          )}
          {selectedItems.length > 0 && needsSetupItems.length === 0 && (
            <div className="text-green-600 font-medium flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              All selected items are ready
            </div>
          )}
        </div>
        
        <button
          disabled={!canContinue}
          onClick={() => onContinue(selectedItems)}
          className={`flex items-center px-6 py-2 rounded-md font-medium text-sm transition-all ${
            canContinue 
              ? 'bg-[#3d50b6] text-white hover:bg-blue-800 shadow-sm' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          Confirm and Continue
          <ChevronRight className="w-4 h-4 ml-1.5" />
        </button>
      </div>
    </div>
  );
}
