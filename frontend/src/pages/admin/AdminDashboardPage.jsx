import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { FilmIcon, UsersIcon, ChatBubbleBottomCenterTextIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';
// Hypothetically, you might fetch some stats here
// import { adminGetStatsApi } from '../../api/adminApi'; // If you create such an endpoint

const StatCard = ({ title, value, icon, linkTo, linkText = "View All" }) => (
    <div className="bg-secondary p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-full bg-accent/10 text-accent">
                {React.createElement(icon, { className: "h-7 w-7" })}
            </div>
        </div>
        <h3 className="text-3xl font-semibold text-text-primary mb-1">{value}</h3>
        <p className="text-sm text-text-secondary mb-4">{title}</p>
        {linkTo && (
            <Link to={linkTo} className="text-sm font-medium text-accent hover:text-accent-hover flex items-center">
                {linkText} <ArrowRightCircleIcon className="h-4 w-4 ml-1" />
            </Link>
        )}
    </div>
);


const AdminDashboardPage = () => {
  // Example state for stats - you would fetch this from an API
  const [stats, setStats] = useState({
    totalMovies: 'N/A',
    totalUsers: 'N/A',
    totalReviews: 'N/A',
  });
  const [loadingStats, setLoadingStats] = useState(false);

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     setLoadingStats(true);
  //     try {
  //       // const response = await adminGetStatsApi(); // Your API call
  //       // setStats(response.data.data);
  //       // Dummy data for now:
  //       setTimeout(() => {
  //         setStats({ totalMovies: 125, totalUsers: 78, totalReviews: 340 });
  //         setLoadingStats(false);
  //       }, 1000);
  //     } catch (error) {
  //       console.error("Failed to fetch admin stats:", error);
  //       setLoadingStats(false);
  //     }
  //   };
  //   fetchStats();
  // }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-8 tracking-tight">Admin Dashboard</h1>
      <p className="text-text-secondary mb-10">Overview of your Verdict application.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
            title="Total Movies"
            value={loadingStats ? "..." : stats.totalMovies}
            icon={FilmIcon}
            linkTo="/admin/movies"
            linkText="Manage Movies"
        />
        <StatCard
            title="Registered Users"
            value={loadingStats ? "..." : stats.totalUsers}
            icon={UsersIcon}
            linkTo="/admin/users"
            linkText="Manage Users"
        />
        <StatCard
            title="Total Reviews"
            value={loadingStats ? "..." : stats.totalReviews}
            icon={ChatBubbleBottomCenterTextIcon}
            linkTo="/admin/reviews"
            linkText="Manage Reviews"
        />
      </div>

      {/* You can add more sections here, like recent activity, charts, etc. */}
      <div className="mt-12 bg-secondary p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
            <Link to="/admin/movies/new"> {/* Assuming you'll have a route for adding new movie */}
                <Button variant="primary">Add New Movie</Button>
            </Link>
            {/* Add more quick action buttons */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;