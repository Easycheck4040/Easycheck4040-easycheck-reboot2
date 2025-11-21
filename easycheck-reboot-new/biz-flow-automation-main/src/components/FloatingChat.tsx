import { useState } from 'react';
import { Bot, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedChatInterface } from './EnhancedChatInterface';
import { cn } from '@/lib/utils';

export const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-glow z-50 hover:scale-110 transition-smooth"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300",
            isExpanded
              ? "inset-4 md:inset-8"
              : "bottom-6 right-6 w-[90vw] md:w-[420px] h-[600px]"
          )}
        >
          <div className="h-full flex flex-col bg-background border">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-gradient-primary">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-white" />
                <span className="font-semibold text-white text-sm">AI Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden">
              <EnhancedChatInterface />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
