import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  ChartBarIcon,
  FilmIcon,
  UsersIcon,
  ChatBubbleBottomCenterTextIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const commonLinkClasses = "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150";
  const activeLinkClasses = "bg-accent text-white";
  const inactiveLinkClasses = "text-slate-300 hover:bg-slate-700 hover:text-slate-100";

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
    { name: 'Movies', href: '/admin/movies', icon: FilmIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Reviews', href: '/admin/reviews', icon: ChatBubbleBottomCenterTextIcon },
    { name: 'Back to Site', href: '/', icon: HomeIcon, external: true }, // To navigate back to public site
  ];

  const SidebarContent = () => (
    <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto custom-scrollbar">
      <div className="flex items-center flex-shrink-0 px-4 mb-6">
        {/* <img className="h-8 w-auto" src="/logo.svg" alt="MovieVerse Admin" /> */}
        <FilmIcon className="h-8 w-8 text-accent mr-2" />
        <span className="text-xl font-semibold text-text-primary">Admin Panel</span>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {navigation.map((item) =>
          item.external ? (
            <a
              key={item.name}
              href={item.href}
              className={`${commonLinkClasses} ${inactiveLinkClasses}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
              {item.name}
            </a>
          ) : (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/admin/dashboard'} // 'end' prop for exact match on parent/index route
            className={({ isActive }) =>
              `${commonLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
            {item.name}
          </NavLink>
          )
        )}
      </nav>
    </div>
  );


  return (
    <div className="flex h-screen overflow-hidden bg-primary">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 flex z-40" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-secondary">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <SidebarContent />
          </div>
          <div className="flex-shrink-0 w-14" aria-hidden="true">{/* Dummy element to force sidebar to shrink to fit close icon */}</div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-secondary border-r border-border-color">
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none custom-scrollbar">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            {/* Welcome message or breadcrumbs can go here */}
             {/* <h1 className="text-2xl font-semibold text-text-primary">Welcome, {user?.name}!</h1> */}
            <Outlet /> {/* This is where the specific admin page content will be rendered */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;