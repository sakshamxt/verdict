import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import NotificationHandler from './components/ui/NotificationHandler'; // Our custom toast handler

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Navbar />
      <NotificationHandler /> {/* Place it high in the component tree */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;