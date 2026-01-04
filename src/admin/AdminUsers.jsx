import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import "../styles/adminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-page">Loading users…</div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />

      <div className="admin-page">
        <h2>Users</h2>

        <div className="admin-users-card">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Address</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td>{u.name || "-"}</td>
                  <td>{u.phoneNumber || "-"}</td>
                  <td>
                    <span className={`role-pill ${u.role}`}>{u.role}</span>
                  </td>
                  <td>{u.address }</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
