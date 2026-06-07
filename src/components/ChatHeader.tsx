'use client';

import { ChevronDown } from 'lucide-react';

interface ChatHeaderProps {
  title?: string;
}

export default function ChatHeader({ title = 'NovaChat' }: ChatHeaderProps) {
  return (
    <header className='flex items-center justify-between px-6 py-3 border-b border-gray-100'>
      <div className='flex items-center gap-2'>
        <div className='w-2 h-2 rounded-full bg-blue-400' />
        <span className='text-sm font-medium text-gray-700'>{title}</span>
        <ChevronDown className='w-3.5 h-3.5 text-gray-400' />
      </div>
      <div className='flex items-center gap-2'>
        <button className='px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors'>
          Edit
        </button>
        <button className='px-3 py-1.5 text-xs text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors'>
          Publish agent
        </button>
      </div>
    </header>
  );
}
