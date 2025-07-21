import React, { useEffect, useState } from "react";
import api from "../services/api";
import LayoutWrapper from "../components/LayoutWrapper";


function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleUpdateClick = (user) => {
    setEditingUserId(user._id);
    setSelectedRole(user.role);
  };

  const handleSave = async (id) => {
    try {
      await api.put(`/users/${id}`, { role: selectedRole });
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      alert("Failed to update role");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <LayoutWrapper>
    <div className="container mt-5">
      <h3>All Users 👥</h3>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                {editingUserId === u._id ? (
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="form-select form-select-sm"
                  >
                    <option value="User">User</option>
                    <option value="Organizer">Organizer</option>
                    <option value="Admin">Admin</option>
                  </select>
                ) : (
                  u.role
                )}
              </td>
              <td>
                {editingUserId === u._id ? (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleSave(u._id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingUserId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleUpdateClick(u)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </LayoutWrapper>
  );
}

export default AdminUsers;
