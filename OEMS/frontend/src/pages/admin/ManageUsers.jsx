import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Empty, Loading } from '../../components/State';
import api from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/admin/users').then(({ data }) => setUsers(data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const changeRole = async (id, role) => {
    await api.patch(`/admin/users/${id}/role`, { role });
    load();
  };

  return (
    <>
      <PageHeader title="Manage Users" subtitle="Change roles for student, teacher, and admin accounts." />
      {loading ? <Loading /> : users.length === 0 ? <Empty /> : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="table-cell">Name</th><th className="table-cell">Email</th><th className="table-cell">Role</th><th className="table-cell">Joined</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="table-cell font-medium">{user.name}</td>
                  <td className="table-cell">{user.email}</td>
                  <td className="table-cell">
                    <select className="input max-w-40" value={user.role} onChange={(e) => changeRole(user._id, e.target.value)}>
                      <option value="student">student</option>
                      <option value="teacher">teacher</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="table-cell">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ManageUsers;
