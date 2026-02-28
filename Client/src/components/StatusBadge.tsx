import React from 'react'

const colors: Record<string, string> = {
  Draft: 'bg-gray-200 text-gray-800',
  Submitted: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cls = colors[status] || 'bg-gray-100'
  return <span className={`px-2 py-1 rounded text-xs font-medium ${cls}`}>{status}</span>
}

export default StatusBadge
