import type { ItemConfig } from '../pages/Step0_SelectItems';
import { Sparkles, FileText, Target, AlertTriangle } from 'lucide-react';

const AI_DATA: Record<string, { summary: string; blocks: Record<string, string | number>[] }> = {
  holiday: {
    summary: 'Detected 3 records of clock-ins on statutory holidays or rest days. Need to confirm if these are valid holiday attendances.',
    blocks: [
      {
        title: 'A1 Holiday/Rest Day Clock-in',
        reason: 'Employees have clock-in records on designated holidays.',
        impact: 'May trigger holiday overtime pay or require manual exemption.',
        confidence: 'High',
        count: 3,
        type: 'warning'
      }
    ]
  },
  attendance: {
    summary: 'Detected 12 records needing review. Main issues involve missing clock-ins and abnormal night shift patterns.',
    blocks: [
      {
        title: 'A1 Missing Clock-in',
        reason: '8 employees missed clock-in or clock-out during payroll period.',
        impact: 'Potential unpaid attendance if not resolved or exempted.',
        confidence: 'High',
        count: 8,
        type: 'warning'
      },
      {
        title: 'A1 Continuous Night Shift',
        reason: '4 employees exceeded the continuous night shift threshold.',
        impact: 'May violate scheduling policies.',
        confidence: 'Medium',
        count: 4,
        type: 'info'
      }
    ]
  },
  ot: {
    summary: 'Detected 7 overtime records. Some exceed weekly thresholds and others are pending approval.',
    blocks: [
      {
        title: 'A1 OT Threshold Exceeded',
        reason: 'Overtime hours > 20h/week or > 36h/month.',
        impact: 'May require adjustment or limit future approvals.',
        confidence: 'High',
        count: 5,
        type: 'warning'
      },
      {
        title: 'A1 Unapproved OT',
        reason: 'Overtime records not in Approved status within current period.',
        impact: 'May delay payment for these hours.',
        confidence: 'Medium',
        count: 2,
        type: 'info'
      }
    ]
  },
  leave: {
    summary: 'Detected 4 records with abnormal leave patterns or overlaps with attendance.',
    blocks: [
      {
        title: 'A1 Attendance & Leave Overlap',
        reason: 'Valid clock-in exists during an approved leave period.',
        impact: 'Conflict between paid time worked and paid time off.',
        confidence: 'High',
        count: 3,
        type: 'warning'
      },
      {
        title: 'A2 Abnormal Leave Pattern',
        reason: 'Frequent Friday half-day leaves detected.',
        impact: 'Requires review to confirm if it is a valid business case.',
        confidence: 'Low',
        count: 1,
        type: 'info'
      }
    ]
  },
  leave_status: {
    summary: 'Detected 5 pending leave requests that could impact current payroll calculations.',
    blocks: [
      {
        title: 'A2 Pending Leave Impacts Payroll',
        reason: 'Leave status is Pending but falls within current pay period.',
        impact: 'May result in incorrect deduction if approved late.',
        confidence: 'High',
        count: 5,
        type: 'warning'
      }
    ]
  },
  leave_encash_ye: {
    summary: 'Detected 2 records where actual encashment does not match policy entitlement.',
    blocks: [
      {
        title: 'A2 Encashment Qualification Error',
        reason: 'Actual encashed amount differs from policy entitlement.',
        impact: 'Incorrect year-end payout.',
        confidence: 'Medium',
        count: 2,
        type: 'warning'
      }
    ]
  }
};

export default function AIPanel({ item }: { item: ItemConfig }) {
  const data = AI_DATA[item.id] || AI_DATA.attendance;

  return (
    <div className="bg-slate-50/30 flex flex-col">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-transparent">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-800">AI Overview</h3>
        </div>
        <span className="text-xs text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{item.name}</span>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col lg:flex-row gap-6">
        
        {/* Executive Summary */}
        <div className="lg:w-1/3">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Executive Summary</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            {data.summary}
          </p>
        </div>

        {/* Detection Blocks */}
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {data.blocks.map((block, idx) => (
            <div key={idx} className={`border rounded-lg p-4 shadow-sm ${block.type === 'warning' ? 'border-amber-200 bg-amber-50/50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-start">
                {block.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 mr-2 shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-slate-400 mt-0.5 mr-2 shrink-0" />
                )}
                <div>
                  <h5 className="text-sm font-semibold text-slate-800">{block.title}</h5>
                  <p className="text-xs text-slate-600 mt-1">
                    <span className="font-medium text-slate-700">Why flagged:</span> {block.reason}
                  </p>
                  {block.impact && (
                    <p className="text-xs text-slate-600 mt-1">
                      <span className="font-medium text-slate-700">Impact:</span> {block.impact}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className={`${block.confidence === 'High' ? 'text-blue-600' : 'text-slate-500'} font-medium`}>Confidence: {block.confidence}</span>
                    <button className="text-slate-500 hover:text-blue-600 flex items-center">
                      <Target className="w-3 h-3 mr-1" />
                      Review {block.count} records
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}