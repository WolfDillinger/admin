// src/components/UserTable.js
import React from "react";
import { socket } from "../socket";
import { SERVER_URL } from "../socket";

export default function UserTable({
  users, // still an object map: { ip: userObj, … }
  highlightIp,
  cardIp,
  onShowCard,
  onShowInfo,
}) {
  const handleDelete = async (ip) => {
    if (!window.confirm(`Really delete all data for ${ip}?`)) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${SERVER_URL}/api/users/${encodeURIComponent(ip)}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        }
      );
      if (!res.ok) {
        throw new Error(`Server responded ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed: " + err.message);
    }
  };

  const toggleFlag = (ip, checked) => {
    socket.emit("toggleFlag", { ip, flag: checked });
  };

  // ── PRESERVE SCROLL POSITION BEFORE UPDATES ──
  useLayoutEffect(() => {
    const container = tableContainerRef.current;
    if (container) container.scrollTop = prevScrollTop.current;
  });

  // 1) Convert users object into an array of [ip, userObj]:
  const entries = Object.entries(users);

  // ── EDIT: sort all “new data” rows to the front ──
  entries.sort(([, a], [, b]) => {
    if (a.hasNewData && !b.hasNewData) return -1;
    if (!a.hasNewData && b.hasNewData) return 1;
    return 0;
  });

  // Helper: determine “online” state
  const isOnline = (u) => u.currentPage && u.currentPage !== "offline";

  // 2) Separate online vs offline
  const onlineEntries = [];
  const offlineEntries = [];

  for (let [ip, u] of entries) {
    if (isOnline(u)) onlineEntries.push([ip, u]);
    else offlineEntries.push([ip, u]);
  }

  // 3) Concatenate: online first, then offline
  const sortedEntries = [...onlineEntries, ...offlineEntries];

  return (
    <div
      ref={tableContainerRef}
      style={{ maxHeight: "70vh", overflowY: "auto" }}
      onScroll={(e) => (prevScrollTop.current = e.target.scrollTop)}
    >
      <table className="table table-striped table-bordered">
        <thead className="thead-light">
          <tr>
            <th></th> {/* checkbox */}
            <th>#</th>
            <th>IP</th>
            <th>ResidenceNumber</th>
            <th>Name</th>
            <th>New Data</th>
            <th>Card</th>
            <th>Page</th>
            <th>Status</th>
            <th>Info</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map(([ip, u], i) => {
            const isHighlighted = ip === highlightIp || ip === cardIp;
            const rowStyle = {
              border: isHighlighted ? "2px solid #28a745" : undefined,
              background: u.flag ? "yellow" : undefined,
            };

            return (
              <tr key={ip} style={rowStyle}>
                <td>
                  <input
                    type="checkbox"
                    checked={!!u.flag}
                    onChange={(e) => toggleFlag(ip, e.target.checked)}
                  />
                </td>
                <td>{i + 1}</td>
                <td>{ip}</td>
                <td>{u.IDorResidenceNumber?.trim() || ""}</td>
                <td>
                  {u.FullName && u.FullName.trim() !== "" ? u.FullName : ""}
                </td>
                <td>
                  <span
                    className={`font-weight-bold ${
                      u.hasNewData ? "text-success" : "text-danger"
                    }`}
                  >
                    {u.hasNewData ? "Yes" : "No"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => onShowCard(ip)}
                  >
                    Card
                  </button>
                </td>
                <td>{(u.currentPage || "offline").replace(".html", "")}</td>
                <td>
                  <span
                    className={`font-weight-bold ${
                      isOnline(u) ? "text-success" : "text-danger"
                    }`}
                  >
                    {isOnline(u) ? "Online" : "Offline"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => onShowInfo(ip)}
                  >
                    Info
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(ip)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
