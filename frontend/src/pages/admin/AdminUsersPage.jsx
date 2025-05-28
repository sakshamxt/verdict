import { useState, useEffect, useCallback } from 'react';
import { adminGetAllUsersApi, adminDeleteUserApi, adminUpdateUserApi } from '../../api/adminApi';
import Button from '../../components/ui/Button';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal'; // Generic Modal for role editing
import { UserCircleIcon, TrashIcon, Cog8ToothIcon, ShieldCheckIcon, UserIcon as RoleUserIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

const EditUserRoleModal = ({ isOpen, onClose, user, onSave, isLoading }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { role: user?.role || 'user' }
    });

    useEffect(() => {
        if (user) {
            reset({ role: user.role });
        }
    }, [user, reset]);

    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit Role for ${user.name}`} size="md">
            <form onSubmit={handleSubmit(onSave)} className="space-y-4">
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-text-primary">Role</label>
                    <select
                        id="role"
                        {...register("role", { required: "Role is required" })}
                        className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-accent focus:ring-accent sm:text-sm text-text-primary p-3"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <p className="error-message">{errors.role.message}</p>}
                </div>
                <div className="pt-2 flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button type="submit" isLoading={isLoading} disabled={isLoading}>Save Role</Button>
                </div>
            </form>
        </Modal>
    );
};


const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [userToEditRole, setUserToEditRole] = useState(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);


  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminGetAllUsersApi();
      setUsers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch users.");
      console.error("Fetch users error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await adminDeleteUserApi(userToDelete._id);
      setIsConfirmModalOpen(false);
      setUserToDelete(null);
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error("Delete user error:", err);
      alert(err.response?.data?.error || "Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditRoleClick = (user) => {
    setUserToEditRole(user);
    setIsEditRoleModalOpen(true);
  };

  const handleSaveRole = async (data) => {
    if (!userToEditRole) return;
    setIsUpdatingRole(true);
    try {
        await adminUpdateUserApi(userToEditRole._id, { role: data.role });
        setIsEditRoleModalOpen(false);
        setUserToEditRole(null);
        fetchUsers(); // Refresh
    } catch (error) {
        console.error("Update role error:", error);
        alert(error.response?.data?.error || "Failed to update role.");
    } finally {
        setIsUpdatingRole(false);
    }
  };


  if (isLoading && users.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-8">Manage Users</h1>

      {users.length === 0 && !isLoading ? (
        <p className="text-text-secondary text-center py-10">No users found.</p>
      ) : (
        <div className="bg-secondary shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Registered</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-secondary divide-y divide-slate-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserCircleIcon className="h-8 w-8 text-slate-400 mr-3 flex-shrink-0" />
                      <div className="text-sm font-medium text-text-primary">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-slate-600 text-slate-200'
                    }`}>
                      {user.role === 'admin' ? <ShieldCheckIcon className="h-4 w-4 mr-1 inline"/> : <RoleUserIcon className="h-4 w-4 mr-1 inline"/>}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                     <Button variant="ghost" size="sm" onClick={() => handleEditRoleClick(user)} title="Edit Role">
                        <Cog8ToothIcon className="h-5 w-5 text-slate-400 hover:text-accent" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(user)} title="Delete User">
                      <TrashIcon className="h-5 w-5 text-slate-400 hover:text-danger" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        {isEditRoleModalOpen && userToEditRole && (
            <EditUserRoleModal
                isOpen={isEditRoleModalOpen}
                onClose={() => setIsEditRoleModalOpen(false)}
                user={userToEditRole}
                onSave={handleSaveRole}
                isLoading={isUpdatingRole}
            />
        )}
      {isConfirmModalOpen && userToDelete && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title={`Delete User: ${userToDelete.name}`}
          message="Are you sure you want to delete this user? All their reviews will also be deleted. This action cannot be undone."
          confirmText="Delete"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;