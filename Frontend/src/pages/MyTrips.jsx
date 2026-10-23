
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access");

      const response = await fetch(
        `http://127.0.0.1:8000/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Failed to delete trip.");
        return;
      }

      setMessage(data.message || "Trip deleted successfully!");

      setTrips((currentTrips) =>
        currentTrips.filter((trip) => trip.id !== id)
      );
    } catch (error) {
      setMessage("Unable to delete trip. Please try again.");
    }
  };

  useEffect(() => {
    const getTrips = async () => {
      try {
        const token = localStorage.getItem("access");

        const response = await axios.get(
          "http://127.0.0.1:8000/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTrips(response.data);
      } catch (error) {
        setMessage("Failed to load trips. Please log in again if needed.");
      } finally {
        setLoading(false);
      }
    };

    getTrips();
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="fw-bold text-primary">My Trips 🧳</h1>
          <p className="text-secondary mb-0">
            View and manage all your planned trips.
          </p>
        </div>

        <Link to="/create-trip" className="btn btn-primary">
          + Create New Trip
        </Link>
      </div>

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-secondary">Loading your trips...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="card border-0 shadow-sm text-center p-5">
          <h3>No trips yet ✈️</h3>
          <p className="text-secondary">
            Start planning your next adventure!
          </p>
          <div>
            <Link to="/create-trip" className="btn btn-primary">
              Plan Your First Trip
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {trips.map((trip) => (
            <div className="col-md-6 col-lg-4" key={trip.id}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-primary text-white py-3">
                  <h4 className="mb-0">📍 {trip.destination}</h4>
                </div>

                <div className="card-body">
                  <p className="mb-2">
                    <strong>Start Date:</strong> {trip.start_date}
                  </p>

                  <p className="mb-2">
                    <strong>End Date:</strong> {trip.end_date}
                  </p>

                  <p className="mb-4">
                    <strong>Budget:</strong>{" "}
                    <span className="text-success fw-bold">
                      ₹{Number(trip.budget).toLocaleString("en-IN")}
                    </span>
                  </p>

                  <div className="d-flex gap-2">
                    <Link
                      to={`/edit-trip/${trip.id}`}
                      className="btn btn-outline-primary flex-fill"
                    >
                      Edit
                    </Link>

                    <button
                      className="btn btn-outline-danger flex-fill"
                      onClick={() => handleDelete(trip.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTrips;