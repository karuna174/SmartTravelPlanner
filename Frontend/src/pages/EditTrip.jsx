
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getTrip = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to load trip.");
        }

        setDestination(data.destination);
        setStartDate(data.start_date);
        setEndDate(data.end_date);
        setBudget(data.budget);
      } catch (error) {
        setError(error.message || "Failed to load trip.");
      } finally {
        setLoading(false);
      }
    };

    getTrip();
  }, [id, token]);

  const handleEditTrip = async () => {
    if (!destination || !startDate || !endDate || !budget) {
      setError("Please fill in all fields.");
      return;
    }

    if (endDate < startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    if (Number(budget) <= 0) {
      setError("Budget must be greater than zero.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `http://127.0.0.1:8000/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            destination,
            start_date: startDate,
            end_date: endDate,
            budget,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to update trip."
        );
      }

      alert("Trip updated successfully!");
      navigate("/my-trips");
    } catch (error) {
      setError(error.message || "Failed to update trip.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-secondary">Loading trip details...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="fw-bold text-primary">Edit Your Trip ✏️</h1>
        <p className="text-secondary">
          Update your destination, dates, and budget.
        </p>
      </div>

      <div
        className="card shadow border-0 p-4 mx-auto"
        style={{ maxWidth: "650px" }}
      >
        <h3 className="mb-4">Trip Details</h3>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Destination</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Manali"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              min={startDate || undefined}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Budget (₹)</label>
          <input
            type="number"
            className="form-control"
            min="1"
            placeholder="e.g. 15000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100 mb-2"
          onClick={handleEditTrip}
          disabled={saving}
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>

        <Link to="/my-trips" className="btn btn-outline-secondary w-100">
          Cancel
        </Link>
      </div>
    </div>
  );
}

export default EditTrip;