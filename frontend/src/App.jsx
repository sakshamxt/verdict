
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;