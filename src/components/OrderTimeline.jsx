import "../styles/orderTimeline.css";

const STATUS_ORDER = [
  "CREATED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const OrderTimeline = ({ history }) => {
  const safeHistory = Array.isArray(history) ? history : [];

  const isCancelled = safeHistory.some((h) => h.status === "CANCELLED");

  return (
    <div className="order-timeline">
      {STATUS_ORDER.map((status) => {
        const step = safeHistory.find((h) => h.status === status);
        const reached = Boolean(step);

        return (
          <div
            key={status}
            className={`timeline-item ${reached ? "reached" : ""} ${
              status === "CANCELLED" ? "cancelled" : ""
            }`}
            style={{
              opacity:
                isCancelled && status !== "CANCELLED" && !reached ? 0.35 : 1,
            }}
          >
            <div className="timeline-dot" />

            <div className="timeline-content">
              <div className="timeline-status">{status}</div>

              {step ? (
                <div className="timeline-date">
                  {new Date(step.updatedAt).toLocaleString()}
                </div>
              ) : (
                <div className="timeline-pending">Pending</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
