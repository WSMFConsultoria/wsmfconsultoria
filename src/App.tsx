import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Technology from './pages/Technology';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';
import TeamActions from './pages/TeamActions';

import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPages from './pages/admin/AdminPages';
import AdminMedia from './pages/admin/AdminMedia';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminTeamActions from './pages/admin/AdminTeamActions';
import AdminContacts from './pages/admin/AdminContacts';
import AdminBudgets from './pages/admin/AdminBudgets';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public App Routes */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="sobre" element={<About />} />
          <Route path="servicos" element={<Services />} />
          <Route path="tecnologia" element={<Technology />} />
          <Route path="contato" element={<Contact />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="acoes-equipe" element={<TeamActions />} />
        </Route>

        {/* Admin Control Panel Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="team-actions" element={<AdminTeamActions />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="budgets" element={<AdminBudgets />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
