import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";

const API_BASE = "https://surya-creations.onrender.com";

const emptyForm = {
  imageUrl: "",
  heading: "",
  subheading: "",
  ctaText: "",
  ctaLink: "",
  priority: 0,
  active: true,
};

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  /* ================= LOAD ================= */
  const loadBanners = async () => {
    const res = await axios.get(`${API_BASE}/api/banners/admin`);
    setBanners(res.data);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.imageUrl) {
      alert("Banner image URL is required");
      return;
    }

    try {
      if (editingId) {
        // UPDATE
        await axios.put(`${API_BASE}/api/banners/${editingId}`, form);
      } else {
        // CREATE
        await axios.post(`${API_BASE}/api/banners`, form);
      }

      setForm(emptyForm);
      setEditingId(null);
      loadBanners();
    } catch (err) {
      alert("Failed to save banner");
      console.error(err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (banner) => {
    setEditingId(banner.id);
    setForm({
      imageUrl: banner.imageUrl || "",
      heading: banner.heading || "",
      subheading: banner.subheading || "",
      ctaText: banner.ctaText || "",
      ctaLink: banner.ctaLink || "",
      priority: banner.priority || 0,
      active: banner.active ?? true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= CANCEL ================= */
  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <>
      <AdminNavbar />

      <div className="admin-container">
        <h2>{editingId ? "Edit Banner" : "Add Banner"}</h2>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            placeholder="Banner Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            required
          />

          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "12px",
              }}
            />
          )}

          <input
            placeholder="Heading"
            value={form.heading}
            onChange={(e) => setForm({ ...form, heading: e.target.value })}
          />

          <input
            placeholder="Subheading"
            value={form.subheading}
            onChange={(e) => setForm({ ...form, subheading: e.target.value })}
          />

          <input
            placeholder="CTA Text"
            value={form.ctaText}
            onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
          />

          <input
            placeholder="CTA Link (eg: /search?category=frames)"
            value={form.ctaLink}
            onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
          />

          <input
            type="number"
            placeholder="Priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: +e.target.value })}
          />

          <label style={{ display: "flex", gap: "8px" }}>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active
          </label>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit">
              {editingId ? "Update Banner" : "Add Banner"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  background: "#eee",
                  color: "#111",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* ================= LIST ================= */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Heading</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {banners.map((b) => (
              <tr key={b.id}>
                <td>
                  <img
                    src={b.imageUrl}
                    alt=""
                    style={{
                      width: "120px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                </td>
                <td>{b.heading}</td>
                <td>{b.priority}</td>
                <td>{b.active ? "Active" : "Disabled"}</td>
                <td>
                  <button onClick={() => handleEdit(b)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminBanners;
