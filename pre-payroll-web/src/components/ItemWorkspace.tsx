import { useState } from 'react';
import type { ItemConfig } from '../pages/Step0_SelectItems';
import { RefreshCw, Filter, MessageSquarePlus, Check, X } from 'lucide-react';
import AIPanel from './AIPanel';
import { ITEM_MOCK_DATA } from './mockData';

export default function ItemWorkspace({ item }: { item: ItemConfig }) {
  const currentMockData = ITEM_MOCK_DATA[item.id] || ITEM_MOCK_DATA.attendance;

  const [activeTab, setActiveTab] = useState<'ignored' | 'confirmed'>('confirmed');
  // Initialize with current item data
  const [detailsData, setDetailsData] = useState<Record<string, string>[]>(currentMockData.detailsData);
  const [summaryData, setSummaryData] = useState<Record<string, string>[]>(currentMockData.summaryData);
  // Track which item we're currently displaying to know when to reset
  const [currentItemId, setCurrentItemId] = useState(item.id);

  if (item.id !== currentItemId) {
    setCurrentItemId(item.id);
    setDetailsData(currentMockData.detailsData);
    setSummaryData(currentMockData.summaryData);
    setActiveTab('confirmed');
  }

  const handleDetailsAction = (id: string, action: 'ignored' | 'confirmed', empCode: string) => {
    // 1. Update the specific row in Details
    setDetailsData(prev => prev.map(row => 
      row.id === id ? { ...row, state: action } : row
    ));

    // 2. Re-calculate Summary based on the updated Details data for this Employee
    setSummaryData(prev => prev.map(row => {
      if (row.EmployeeCode === empCode) {
        // Wait for next tick/render to calculate, or calculate synchronously using current state + pending change
        const updatedDetails = detailsData.map(r => r.id === id ? { ...r, state: action } : r);
        
        // Find all active (confirmed) details for this employee
        const activeEmpDetails = updatedDetails.filter(r => r.EmployeeCode === empCode && r.state === 'confirmed');
        
        // Recalculate amount/quantity (simple sum logic)
        let newAmount = 0;
        let hasAmountField = false;
        let amountField = '';
        
        if ('HolidayAmount' in row) { hasAmountField = true; amountField = 'HolidayAmount'; }
        else if ('LeaveAmount' in row) { hasAmountField = true; amountField = 'LeaveAmount'; }
        else if ('Quantity' in row) { hasAmountField = true; amountField = 'Quantity'; }
        else if ('TimeHours' in row) { hasAmountField = true; amountField = 'TimeHours'; }

        if (hasAmountField) {
          newAmount = activeEmpDetails.reduce((sum, dRow) => sum + parseFloat(dRow[amountField] || '0'), 0);
          
          // If amount becomes 0, we can automatically mark the summary row as ignored too, or just update the value
          const newState = newAmount === 0 ? 'ignored' : 'confirmed';
          
          return { 
            ...row, 
            [amountField]: newAmount.toFixed(2),
            state: newState
          };
        }
      }
      return row;
    }));
  };

  const handleSummaryAction = (id: string, action: 'ignored' | 'confirmed', empCode: string) => {
    // 1. Update the specific row in Summary
    setSummaryData(prev => prev.map(row => 
      row.id === id ? { ...row, state: action } : row
    ));

    // 2. Sync action to ALL details rows belonging to this employee
    setDetailsData(prev => prev.map(row => 
      row.EmployeeCode === empCode ? { ...row, state: action } : row
    ));
  };

  const filteredDetails = detailsData.filter(row => row.state === activeTab);
  const filteredSummary = summaryData.filter(row => row.state === activeTab);

  const detailsCounts = {
    ignored: detailsData.filter(r => r.state === 'ignored').length,
    confirmed: detailsData.filter(r => r.state === 'confirmed').length,
  };

  const renderActionButtons = (row: Record<string, string>, isSummary: boolean) => {
    const handleAction = isSummary ? handleSummaryAction : handleDetailsAction;
    
    return (
      <div className="flex items-center justify-end space-x-2">
        {activeTab === 'confirmed' && (
          <button onClick={() => handleAction(row.id, 'ignored', row.EmployeeCode)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors" title="Ignore">
            <X className="w-4 h-4" />
          </button>
        )}
        
        {activeTab === 'ignored' && (
          <button onClick={() => handleAction(row.id, 'confirmed', row.EmployeeCode)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Confirm impact">
            <Check className="w-4 h-4" />
          </button>
        )}

        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Add to remark">
          <MessageSquarePlus className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col pb-16">
      
      {/* Left: Main Content (Header, Summary, Details) */}
      <div className="flex-1 flex flex-col min-w-0 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Item Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-bold text-slate-900">{item.name}</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                In progress
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Last detected: Today 10:45 AM
            </div>
          </div>
          <button className="flex items-center px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            Re-detect
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* AI Overview panel */}
          <div className="border-b border-slate-200">
            <AIPanel item={item} />
          </div>

          {/* Global Tabs */}
          <div className="px-5 pt-4 pb-0 border-b border-slate-200 bg-white sticky top-0 z-20 flex space-x-6">
            <button 
              onClick={() => setActiveTab('confirmed')}
              className={`text-sm font-medium pb-3 border-b-2 -mb-px transition-colors ${activeTab === 'confirmed' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Confirmed Impact ({detailsCounts.confirmed})
            </button>
            <button 
              onClick={() => setActiveTab('ignored')}
              className={`text-sm font-medium pb-3 border-b-2 -mb-px transition-colors ${activeTab === 'ignored' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Ignored ({detailsCounts.ignored})
            </button>
          </div>

          {/* Summary */}
          <div className="p-5 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
              <Filter className="w-4 h-4 mr-1.5 text-slate-400" />
              Summary
            </h3>
            
            {currentMockData.summaryColumns.length === 0 ? (
              <div className="text-sm text-slate-500 bg-white border border-slate-200 rounded-lg p-4">
                No summary definition for this item.
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-max">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        {currentMockData.summaryColumns.map((col: { key: string; label: string }) => (
                          <th key={col.key} className="px-4 py-2 whitespace-nowrap">{col.label}</th>
                        ))}
                        <th className="px-4 py-2 whitespace-nowrap text-right sticky right-0 bg-slate-50 border-l border-slate-200 z-10">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
                      {filteredSummary.length === 0 ? (
                        <tr>
                          <td colSpan={currentMockData.summaryColumns.length + 1} className="px-5 py-8 text-center text-slate-500">
                            No records found in this view.
                          </td>
                        </tr>
                      ) : (
                        filteredSummary.map((row: Record<string, string>, i: number) => (
                          <tr key={row.id || i} className="hover:bg-slate-50 group">
                            {currentMockData.summaryColumns.map((col: { key: string; label: string }, j: number) => (
                              <td key={col.key} className={`px-4 py-2 whitespace-nowrap ${j === 0 ? 'font-medium text-slate-900' : ''}`}>
                                {row[col.key] ?? ''}
                              </td>
                            ))}
                            <td className="px-4 py-2 whitespace-nowrap text-right sticky right-0 bg-white border-l border-slate-200 z-10 group-hover:bg-slate-50">
                              {renderActionButtons(row, true)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Table Mock */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    {currentMockData.detailsColumns.map((col: { key: string; label: string }) => (
                      <th key={col.key} className="px-5 py-2.5 whitespace-nowrap">{col.label}</th>
                    ))}
                    <th className="px-5 py-2.5 text-right whitespace-nowrap sticky right-0 bg-slate-50 border-l border-slate-200 z-10">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
                  {filteredDetails.length === 0 ? (
                    <tr>
                      <td colSpan={currentMockData.detailsColumns.length + 1} className="px-5 py-8 text-center text-slate-500">
                        No records found in this view.
                      </td>
                    </tr>
                  ) : (
                    filteredDetails.map((row: Record<string, string>, idx: number) => {
                      const isUnreviewed = row.state === 'unreviewed';
                      return (
                        <tr key={row.id || idx} className={`transition-colors group ${isUnreviewed ? 'hover:bg-amber-50/30 bg-amber-50/10' : 'hover:bg-slate-50'}`}>
                          {/* Render dynamic columns */}
                           {currentMockData.detailsColumns.map((col: { key: string; label: string }, i: number) => (
                             <td key={col.key} className={`px-5 py-3 whitespace-nowrap ${i === 0 ? 'font-medium text-slate-900' : ''}`}>
                               {row[col.key] ?? ''}
                             </td>
                           ))}

                          {/* Actions */}
                          <td className={`px-5 py-3 text-right whitespace-nowrap sticky right-0 border-l border-slate-200 z-10 transition-colors ${isUnreviewed ? 'bg-amber-50/10 group-hover:bg-amber-50/30' : 'bg-white group-hover:bg-slate-50'}`}>
                            {renderActionButtons(row, false)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
