import { useState } from 'react';
import { MessageSquare, FileText } from 'lucide-react';

export default function RemarkPanel() {
  const [remarkText, setRemarkText] = useState('');
  const [remarks, setRemarks] = useState([
    {
      id: 1,
      author: 'Zhang San',
      time: '10 mins ago',
      content: 'Li Si, 2026-04-12, Missing clock-in, decision: Confirmed Impact.',
      source: 'record'
    }
  ]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="px-5 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2 text-slate-400" />
          Global Remark
        </h3>
        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{remarks.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {remarks.map(r => (
          <div key={r.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800">{r.author}</span>
              <span className="text-[10px] text-slate-400">{r.time}</span>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
              {r.content}
            </div>
            {r.source === 'record' && (
              <div className="mt-2 text-[10px] text-slate-400 flex items-center">
                <FileText className="w-3 h-3 mr-1" />
                From details record
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-slate-200 shrink-0 pb-16">
        <textarea 
          rows={3}
          value={remarkText}
          onChange={e => setRemarkText(e.target.value)}
          placeholder="Add a remark or insert AI summary..."
          className="w-full text-sm rounded-md border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none mb-3"
        />
        <div className="flex justify-between items-center">
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            + Insert AI Summary
          </button>
          <button 
            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs font-semibold transition-colors"
            onClick={() => {
              if (!remarkText.trim()) return;
              setRemarks([...remarks, { id: Date.now(), author: 'Me', time: 'Just now', content: remarkText, source: 'manual' }]);
              setRemarkText('');
            }}
          >
            Save Remark
          </button>
        </div>
      </div>
    </div>
  );
}
