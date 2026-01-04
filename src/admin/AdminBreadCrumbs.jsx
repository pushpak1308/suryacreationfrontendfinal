import { Link, useLocation } from "react-router-dom";
import "./admin.css";

const AdminBreadcrumbs = () => {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  const crumbs = parts.map((part, index) => {
    const path = "/" + parts.slice(0, index + 1).join("/");
    const label =
      part === "admin"
        ? "Dashboard"
        : part.charAt(0).toUpperCase() + part.replace("-", " ").slice(1);

    return { label, path };
  });

  return (
    <div className="admin-breadcrumbs">
      {crumbs.map((c, i) => (
        <span key={c.path}>
          {i !== crumbs.length - 1 ? (
            <>
              <Link to={c.path}>{c.label}</Link>
              <span className="crumb-sep">›</span>
            </>
          ) : (
            <strong>{c.label}</strong>
          )}
        </span>
      ))}
    </div>
  );
};

export default AdminBreadcrumbs;
