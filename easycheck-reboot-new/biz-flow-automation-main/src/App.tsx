import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { FloatingChat } from './components/FloatingChat';
import { Home } from './pages/Home';
import { Pricing } from './pages/Pricing';
import { Auth } from './pages/Auth';
import { Accounting } from './pages/categories/Accounting';
import { Communication } from './pages/categories/Communication';
import { Administrative } from './pages/categories/Administrative';
import { HR } from './pages/categories/HR';
import { Marketing } from './pages/categories/Marketing';
import { FeatureTemplate } from './pages/features/FeatureTemplate';
import { Receipt, Mail, FileText, Users, TrendingUp, Calculator, Download, Send, Calendar, Bell, Table, CheckSquare, FolderKanban, FileCheck, MessageSquare, Share2 } from 'lucide-react';
import NotFound from './pages/NotFound';
import './i18n/config';

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing auth state
    const authState = localStorage.getItem('isAuthenticated');
    if (authState === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
          
          {/* Floating Chat - Only visible when authenticated */}
          {isAuthenticated && <FloatingChat />}
          
          <Routes>
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
            
            {/* Category Routes */}
            <Route path="/accounting" element={<ProtectedRoute><Accounting /></ProtectedRoute>} />
            <Route path="/communication" element={<ProtectedRoute><Communication /></ProtectedRoute>} />
            <Route path="/administrative" element={<ProtectedRoute><Administrative /></ProtectedRoute>} />
            <Route path="/hr" element={<ProtectedRoute><HR /></ProtectedRoute>} />
            <Route path="/marketing" element={<ProtectedRoute><Marketing /></ProtectedRoute>} />
            
            {/* Accounting Features */}
            <Route path="/accounting/invoices" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<Receipt className="h-8 w-8 text-white" />}
                  title="Invoice Generation"
                  description="Generate professional invoices automatically with AI"
                  gradient="from-blue-500 to-cyan-500"
                />
              </ProtectedRoute>
            } />
            <Route path="/accounting/expenses" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<Calculator className="h-8 w-8 text-white" />}
                  title="Expense Management"
                  description="Track and categorize expenses automatically"
                  gradient="from-blue-500 to-cyan-500"
                />
              </ProtectedRoute>
            } />
            <Route path="/accounting/exports" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<Download className="h-8 w-8 text-white" />}
                  title="Software Exports"
                  description="Export to Bob50, Sage, BDO, Winbooks, Exact and more"
                  gradient="from-blue-500 to-cyan-500"
                />
              </ProtectedRoute>
            } />
            <Route path="/accounting/billing" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<FileText className="h-8 w-8 text-white" />}
                  title="Automatic Billing"
                  description="Automated billing reminders and payment collection"
                  gradient="from-blue-500 to-cyan-500"
                />
              </ProtectedRoute>
            } />

            {/* Communication Features */}
            <Route path="/communication/emails" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<Mail className="h-8 w-8 text-white" />}
                  title="Email Management"
                  description="Automatic email reading and intelligent responses"
                  gradient="from-cyan-500 to-teal-500"
                />
              </ProtectedRoute>
            } />
            <Route path="/communication/followups" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<Send className="h-8 w-8 text-white" />}
                  title="Automatic Follow-ups"
                  description="Never miss a follow-up with automated reminders"
                  gradient="from-cyan-500 to-teal-500"
                />
              </ProtectedRoute>
            } />
            <Route path="/communication/meetings" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<Calendar className="h-8 w-8 text-white" />}
                  title="Meeting Scheduling"
                  description="Schedule meetings effortlessly with AI assistance"
                  gradient="from-cyan-500 to-teal-500"
                />
              </ProtectedRoute>
            } />
            <Route path="/communication/reminders" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<Bell className="h-8 w-8 text-white" />}
                  title="Client Reminders"
                  description="Automatic client reminders and notifications"
                  gradient="from-cyan-500 to-teal-500"
                />
              </ProtectedRoute>
            } />

            {/* Administrative Features */}
            <Route path="/administrative/reports" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<FileText className="h-8 w-8 text-white" />}
                  title="Report Generation"
                  description="Generate comprehensive reports with AI insights"
                  gradient="from-teal-500 to-green-500"
                />
              </ProtectedRoute>
            } />
            <Route path="/administrative/spreadsheets" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<Table className="h-8 w-8 text-white" />}
                  title="Spreadsheet Organization"
                  description="Organize and analyze data automatically"
                  gradient="from-teal-500 to-green-500"
                />
              </ProtectedRoute>
            } />
            <Route path="/administrative/tasks" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<CheckSquare className="h-8 w-8 text-white" />}
                  title="Task Control"
                  description="Track and manage tasks efficiently"
                  gradient="from-teal-500 to-green-500"
                />
              </ProtectedRoute>
            } />
            <Route path="/administrative/projects" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<FolderKanban className="h-8 w-8 text-white" />}
                  title="Project Management"
                  description="Manage projects with AI-powered organization"
                  gradient="from-teal-500 to-green-500"
                />
              </ProtectedRoute>
            } />

            {/* HR Features */}
            <Route path="/hr/screening" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<FileCheck className="h-8 w-8 text-white" />}
                  title="Resume Screening"
                  description="AI-powered resume screening and candidate matching"
                  gradient="from-green-500 to-emerald-500"
                />
              </ProtectedRoute>
            } />
            <Route path="/hr/interviews" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<Calendar className="h-8 w-8 text-white" />}
                  title="Interview Scheduling"
                  description="Schedule interviews seamlessly with candidates"
                  gradient="from-green-500 to-emerald-500"
                />
              </ProtectedRoute>
            } />
            <Route path="/hr/messaging" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<MessageSquare className="h-8 w-8 text-white" />}
                  title="Candidate Messaging"
                  description="Automated candidate communication and updates"
                  gradient="from-green-500 to-emerald-500"
                />
              </ProtectedRoute>
            } />
            <Route path="/hr/onboarding" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<Users className="h-8 w-8 text-white" />}
                  title="Onboarding Automation"
                  description="Streamline employee onboarding processes"
                  gradient="from-green-500 to-emerald-500"
                />
              </ProtectedRoute>
            } />

            {/* Marketing Features */}
            <Route path="/marketing/posts" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<Share2 className="h-8 w-8 text-white" />}
                  title="Social Media Posts"
                  description="Create engaging social media content with AI"
                  gradient="from-emerald-500 to-blue-500"
                />
              </ProtectedRoute>
            } />
            <Route path="/marketing/leads" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<Users className="h-8 w-8 text-white" />}
                  title="Lead Responses"
                  description="Respond to leads instantly and intelligently"
                  gradient="from-emerald-500 to-blue-500"
                />
              </ProtectedRoute>
            } />
            <Route path="/marketing/campaigns" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<TrendingUp className="h-8 w-8 text-white" />}
                  title="Campaign Generation"
                  description="Generate complete marketing campaigns"
                  gradient="from-emerald-500 to-blue-500"
                />
              </ProtectedRoute>
            } />
            <Route path="/marketing/content" element={
              <ProtectedRoute>
                <FeatureTemplate 
                  icon={<FileText className="h-8 w-8 text-white" />}
                  title="Content Creation"
                  description="Create high-quality content for all channels"
                  gradient="from-emerald-500 to-blue-500"
                />
              </ProtectedRoute>
            } />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
