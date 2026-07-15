'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
  canToggleVisibility?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language,
  title,
  showLineNumbers = true,
  canToggleVisibility = false,
  className = '',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(canToggleVisibility ? false : true);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const displayCode = isVisible ? code : code.replace(/[^\s\n\r]/g, '•');
  const headerLabel = title ?? 'Code Example';

  return (
    <div className={`relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
        <h4 className="text-sm font-semibold text-slate-700">
          {headerLabel}
        </h4>
        <div className="flex gap-2">
          {canToggleVisibility && (
            <button
              onClick={toggleVisibility}
              aria-label={isVisible ? 'Hide code' : 'Show code'}
              className="rounded-md p-1.5 text-slate-600 hover:bg-slate-200"
            >
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          <button
            onClick={copyToClipboard}
            aria-label="Copy code"
            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-200"
          >
            {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={oneLight}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 8px 8px',
            fontSize: '14px',
          }}
        >
          {displayCode}
        </SyntaxHighlighter>
        {!isVisible && canToggleVisibility && (
          <div className="absolute inset-0 flex items-center justify-center bg-rose-50/80">
            <p className="font-semibold text-rose-700">🔒 Secret Hidden</p>
          </div>
        )}
      </div>
    </div>
  );
}
