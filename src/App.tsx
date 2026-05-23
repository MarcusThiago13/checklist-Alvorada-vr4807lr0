import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ChecklistProvider } from '@/stores/useChecklistStore'
import Index from './pages/Index'
import ChecklistDetail from './pages/ChecklistDetail'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <ChecklistProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/checklist/:id" element={<ChecklistDetail />} />
            <Route path="/starred" element={<Index />} />
            <Route path="/completed" element={<Index />} />
            <Route path="/trash" element={<Index />} />
            <Route path="/category/:name" element={<Index />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </ChecklistProvider>
  </BrowserRouter>
)

export default App
