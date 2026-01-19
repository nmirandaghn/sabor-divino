import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Toast } from "../components/ui";

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Format date for display
const formatDate = (dateStr) => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format time for display (12-hour format)
const formatTime = (time24) => {
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const getAuthToken = useCallback(() => {
    return localStorage.getItem("adminToken");
  }, []);

  const fetchReservations = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await fetch(`/api/admin/reservations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch reservations");
      }

      setReservations(data.data);
    } catch (error) {
      setToast({
        type: "error",
        message: error.message || "Failed to load reservations",
      });
    } finally {
      setIsLoading(false);
    }
  }, [getAuthToken, navigate]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleDelete = async (id) => {
    const token = getAuthToken();

    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel reservation");
      }

      setToast({
        type: "success",
        message: "Reservation cancelled successfully",
      });

      // Remove from list
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      setToast({
        type: "error",
        message: error.message || "Failed to cancel reservation",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-800">
              Reservations Dashboard
            </h1>
            <p className="mt-1 text-gray-600">
              Manage all restaurant reservations
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-500">
              Total Reservations
            </p>
            <p className="mt-1 text-3xl font-bold text-primary-800">
              {reservations.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-500">Today</p>
            <p className="mt-1 text-3xl font-bold text-accent-600">
              {
                reservations.filter(
                  (r) => r.date === new Date().toISOString().split("T")[0],
                ).length
              }
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-500">Upcoming</p>
            <p className="mt-1 text-3xl font-bold text-secondary-600">
              {
                reservations.filter(
                  (r) => r.date >= new Date().toISOString().split("T")[0],
                ).length
              }
            </p>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {reservations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium">No reservations yet</p>
              <p className="mt-1">
                Reservations will appear here when customers book tables.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Party
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className={
                        reservation.date <
                        new Date().toISOString().split("T")[0]
                          ? "bg-gray-50 opacity-60"
                          : ""
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(reservation.date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(reservation.time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {reservation.party_size}{" "}
                          {reservation.party_size === 1 ? "guest" : "guests"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {reservation.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {reservation.special_requests || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(reservation.id)}
                          disabled={deletingId === reservation.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                        >
                          {deletingId === reservation.id ? (
                            <Spinner size="sm" />
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
