import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User, Sparkles, FileText, Calculator, Mail } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  {
    icon: FileText,
    label: 'Generate Invoice',
    prompt: 'Generate an invoice for Client X'
  },
  {
    icon: Calculator,
    label: 'Monthly Revenue',
    prompt: 'What has been our revenue this month?'
  },
  {
    icon: Mail,
    label: 'Send Email',
    prompt: 'Send a follow-up email to our leads'
  }
];

export const EnhancedChatInterface = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t('chat.welcome') + ' I can help you with invoices, expenses, revenue reports, emails, and much more. Try asking me something like "Generate an invoice for Client X" or "What\'s our revenue this month?"',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const messageContent = customPrompt || input;
    if (!messageContent.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response with context-aware replies
    setTimeout(() => {
      let response = '';
      const lowerContent = messageContent.toLowerCase();

      if (lowerContent.includes('invoice') || lowerContent.includes('fatura')) {
        response = 'I\'ll generate an invoice for you right away. To create a professional invoice, I need a few details:\n\n1. Client name\n2. Items/services provided\n3. Amount\n4. Due date\n\nOnce you provide these details, I\'ll create the invoice and can send it directly to your client or manager via email.';
      } else if (lowerContent.includes('revenue') || lowerContent.includes('faturamento')) {
        response = 'Based on our records, here\'s your revenue summary for this month:\n\n📊 Total Revenue: €45,230\n📈 vs Last Month: +12.5%\n💰 Outstanding Invoices: €8,450\n\nTop performing services:\n1. Consulting - €18,500\n2. Development - €15,200\n3. Design - €11,530\n\nWould you like a detailed breakdown or export this data?';
      } else if (lowerContent.includes('email') || lowerContent.includes('send')) {
        response = 'I can help you with email tasks! I can:\n\n✉️ Send follow-up emails to clients\n📧 Schedule automatic reminders\n📨 Draft professional responses\n🎯 Send campaigns to leads\n\nWhat type of email would you like me to send? Please provide the recipient and message details.';
      } else if (lowerContent.includes('expense') || lowerContent.includes('despesa')) {
        response = 'Let me pull up your expense summary:\n\n💳 This Month\'s Expenses: €12,340\n📊 Categories:\n- Office Supplies: €2,100\n- Software Licenses: €3,500\n- Travel: €4,200\n- Marketing: €2,540\n\nWould you like to add a new expense or export this report?';
      } else {
        response = `I understand your request. I'm your AI assistant with access to all your business data. I can help you with:\n\n📄 Invoicing & Billing\n💰 Financial Reports\n📧 Email Management\n📊 Analytics & Reports\n👥 HR Tasks\n📱 Marketing Campaigns\n\nIn production, I would connect to your actual data and perform these tasks automatically. How else can I assist you today?`;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <Card className="flex flex-col h-full shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gradient-primary">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">Easycheck AI Assistant</h3>
            <p className="text-xs text-white/80">Your intelligent business companion</p>
          </div>
          <div className="flex items-center gap-1 text-white/90">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs">Online</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="p-4 border-b bg-muted/30">
          <p className="text-sm text-muted-foreground mb-3">Quick Actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.prompt)}
                  className="text-xs"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gradient-primary'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="flex-1 max-w-[80%]">
                <div
                  className={`rounded-xl p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-1">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-xl p-3 bg-muted">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="min-h-[60px] max-h-[120px] resize-none pr-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Sparkles className="absolute right-3 top-3 h-4 w-4 text-primary" />
          </div>
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[60px] w-[60px] shadow-glow"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </Card>
  );
};
