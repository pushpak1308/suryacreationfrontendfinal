import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AdminNavbar from "./AdminNavbar";
import "./admin.css";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#ffcc00", "#42a5f5", "#66bb6a", "#ab47bc"];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState("7");
  const [custom, setCustom] = useState({ from: "", to: "" });

  useEffect(() => {
    let url = "http://localhost:8000/api/admin/dashboard";

    if (range === "30") {
      const to = new Date().toISOString().slice(0, 10);
      const from = new Date(Date.now() - 29 * 86400000)
        .toISOString()
        .slice(0, 10);
      url += `?from=${from}&to=${to}`;
    }

    if (range === "custom" && custom.from && custom.to) {
      url += `?from=${custom.from}&to=${custom.to}`;
    }

    setLoading(true);

    axios
      .get(url)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [range, custom]);

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-page admin-loading">Loading dashboard…</div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />

      <div className="admin-page">
        <h2>Dashboard</h2>

        {/* DATE RANGE */}
        <div className="dashboard-range">
          <button
            className={range === "7" ? "active" : ""}
            onClick={() => setRange("7")}
          >
            Last 7 Days
          </button>
          <button
            className={range === "30" ? "active" : ""}
            onClick={() => setRange("30")}
          >
            Last 30 Days
          </button>
          <button
            className={range === "custom" ? "active" : ""}
            onClick={() => setRange("custom")}
          >
            Custom
          </button>

          {range === "custom" && (
            <div className="custom-range">
              <input
                type="date"
                value={custom.from}
                onChange={(e) => setCustom({ ...custom, from: e.target.value })}
              />
              <input
                type="date"
                value={custom.to}
                onChange={(e) => setCustom({ ...custom, to: e.target.value })}
              />
            </div>
          )}
        </div>

        {/* KPI CARDS */}
        <div className="dashboard-cards">
          <div
            className="dashboard-card"
            onClick={() => navigate("/admin/orders")}
          >
            <h4>Total Orders</h4>
            <p>{stats.totalOrders}</p>
          </div>

          <div className="dashboard-card">
            <h4>Total Revenue</h4>
            <p>₹{stats.totalRevenue}</p>
          </div>

          <div className="dashboard-card">
            <h4>Total Customers</h4>
            <p>{stats.totalCustomers}</p>
          </div>

          <div
            className="dashboard-card warning"
            onClick={() => navigate("/admin/orders?status=PROCESSING")}
          >
            <h4>Pending Orders</h4>
            <p>{stats.pendingOrders}</p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="dashboard-charts">
          <div className="chart-box">
            <h4>Revenue</h4>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={stats.revenueByDay}
                onClick={(e) =>
                  e?.activeLabel &&
                  navigate(`/admin/orders?day=${e.activeLabel}`)
                }
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="value" stroke="#ffcc00" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h4>Orders</h4>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={stats.ordersByDay}
                onClick={(e) =>
                  e?.activeLabel &&
                  navigate(`/admin/orders?day=${e.activeLabel}`)
                }
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#42a5f5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE + RECENT */}
        <div className="dashboard-bottom">
          <div className="chart-box">
            <h4>Order Status</h4>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.orderStatusBreakdown}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={60}
                  outerRadius={100}
                  onClick={(d) => navigate(`/admin/orders?status=${d.status}`)}
                >
                  {stats.orderStatusBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="recent-orders">
            <h4>Recent Orders</h4>
            <ul>
              {stats.recentOrders.map((o) => (
                <li
                  key={o.id}
                  onClick={() => navigate(`/admin/orders?order=${o.id}`)}
                >
                  #{o.id} — ₹{o.total} — {o.status}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
