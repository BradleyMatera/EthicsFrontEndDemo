'use client';

import { useState } from 'react';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';
import { useTheme } from 'next-themes';

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
  const { theme, resolvedTheme } = useTheme();
  
  const isDark = theme === 'dark' || resolvedTheme === 'dark';

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

  const showHeader = Boolean(title) || canToggleVisibility || true;
  const headerLabel = title ?? 'Code Example';

  return (
    <Card className={`relative w-full ${className}`}>
      {showHeader && (
        <CardHeader className="flex items-center justify-between pb-2 pt-4">
          <h4 className="text-base font-semibold text-foreground">
            {headerLabel}
          </h4>
          <div className="flex gap-2">
            {canToggleVisibility && (
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={toggleVisibility}
                aria-label={isVisible ? 'Hide code' : 'Show code'}
              >
                {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            )}
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={copyToClipboard}
              aria-label="Copy code"
            >
              {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            </Button>
          </div>
        </CardHeader>
      )}
      <CardBody className="p-0 pb-4">
        <div className="relative">
          <SyntaxHighlighter
            language={language}
            style={isDark ? oneDark : oneLight}
            showLineNumbers={showLineNumbers}
            customStyle={{
              margin: 0,
              borderRadius: title ? '0 0 8px 8px' : '8px',
              fontSize: '14px',
            }}
          >
            {displayCode}
          </SyntaxHighlighter>
          {!isVisible && canToggleVisibility && (
            <div className="absolute inset-0 bg-danger/10 flex items-center justify-center">
              <p className="text-danger font-semibold">🔒 Secret Hidden</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
