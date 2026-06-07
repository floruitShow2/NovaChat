'use client';

import { useState, useMemo, Children, isValidElement } from 'react';
import classname from 'classnames';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const language = className?.replace('language-', '') || 'text';
  const lang = language.replace('hljs ', '') || 'text';

  const codeText = useMemo(() => {
    let text = '';
    const localChildren = children as React.ReactElement;
    if (localChildren.type === 'code') {
      const textChildren = localChildren.props.children as React.ReactNode;
      Children.forEach(textChildren, (child) => {
        if (typeof child === 'string') {
          text += child;
        } else if (isValidElement(child) && typeof child.props?.children === 'string') {
          text += child.props.children;
        }
      });
    }

    return text;
  }, [children]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='relative group my-3'>
      <div className='flex items-center justify-between mb-2 px-4'>
        <span className='text-xs font-medium text-gray-500 tracking-wide'>{lang}</span>
        <button
          onClick={handleCopy}
          className='flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors opacity-0 group-hover:opacity-100'
          title={copied ? '已复制' : '复制代码'}
        >
          {copied ? (
            <>
              <Check className='w-3 h-3 text-green-500' />
              <span className='text-green-500'>已复制</span>
            </>
          ) : (
            <>
              <Copy className='w-3 h-3' />
              <span>复制</span>
            </>
          )}
        </button>
      </div>
      <pre className='bg-[#0d1117] p-2 rounded-lg overflow-auto'>
        <code className={classname('rounded-lg overflow-x-auto', className)}>{children}</code>
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className='prose prose-sm max-w-none'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre({ children }) {
            const codeChild = Children.toArray(children).find(
              (child) => isValidElement(child) && (child as React.ReactElement).type === 'code'
            ) as React.ReactElement<{ className?: string }> | undefined;

            const codeClassName = codeChild?.props?.className;

            return <CodeBlock className={codeClassName}>{children}</CodeBlock>;
          },
          h1({ children }) {
            return <h1 className='text-xl font-bold text-gray-900 mt-6 mb-3'>{children}</h1>;
          },
          h2({ children }) {
            return <h2 className='text-lg font-semibold text-gray-800 mt-5 mb-2'>{children}</h2>;
          },
          h3({ children }) {
            return <h3 className='text-base font-semibold text-gray-700 mt-4 mb-2'>{children}</h3>;
          },
          h4({ children }) {
            return <h4 className='text-sm font-semibold text-gray-700 mt-3 mb-1.5'>{children}</h4>;
          },
          p({ children }) {
            return <p className='text-sm text-gray-800 leading-relaxed mb-2'>{children}</p>;
          },
          ul({ children }) {
            return (
              <ul className='list-disc list-inside text-sm text-gray-800 mb-2 pl-2'>{children}</ul>
            );
          },
          ol({ children }) {
            return (
              <ol className='list-decimal list-inside text-sm text-gray-800 mb-2 pl-2'>
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className='mb-1'>{children}</li>;
          },
          blockquote({ children }) {
            return (
              <blockquote className='border-l-4 border-blue-500 pl-3 italic text-sm text-gray-600 my-3'>
                {children}
              </blockquote>
            );
          },
          strong({ children }) {
            return <strong className='font-semibold text-gray-900'>{children}</strong>;
          },
          em({ children }) {
            return <em className='italic'>{children}</em>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                className='text-blue-600 hover:text-blue-700 underline transition-colors'
                target='_blank'
                rel='noopener noreferrer'
              >
                {children}
              </a>
            );
          },
          hr() {
            return <hr className='border-gray-200 my-4' />;
          },
          table({ children }) {
            return (
              <div className='overflow-x-auto my-3'>
                <table className='w-full text-sm border-collapse'>{children}</table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className='border border-gray-300 px-3 py-2 bg-gray-50 font-semibold text-left'>
                {children}
              </th>
            );
          },
          td({ children }) {
            return <td className='border border-gray-300 px-3 py-2'>{children}</td>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
