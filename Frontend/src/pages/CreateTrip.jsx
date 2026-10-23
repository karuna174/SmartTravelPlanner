
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateTrip() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");

  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleCreateTrip = async () => {
    if (!destination || !startDate || !endDate || !budget) {
      alert("Please fill in all fields.");
      return;
    }

    if (endDate < startDate) {
      alert("End date cannot be before start date.");
      return;
    }

    if (Number(budget) <= 0) {
      alert("Budget must be greater than zero.");
      return;
    }

    try {
      const token = localStorage.getItem("access");

      const response = await axios.post(
        "http://127.0.0.1:8000/",
        {
          destination,
          start_date: startDate,
          end_date: endDate,
          budget,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      alert("Trip created successfully!");
      navigate("/my-trips");
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      alert("Failed to create trip. Please try again.");
    }
  };

  const handleGenerate = async () => {
    if (!destination || !startDate || !endDate || !budget) {
      setError("Please fill in all fields first.");
      return;
    }

    if (endDate < startDate || Number(budget) <= 0) {
      setError("Please check your dates and budget.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setItinerary([]);

      const response = await axios.post(
        "http://127.0.0.1:8000/generate-itinerary/",
        {
          destination,
          start_date: startDate,
          end_date: endDate,
          budget,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      setItinerary(response.data.itinerary);
    } catch (error) {
      setError(
        error.response?.data?.error || "Failed to generate itinerary."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="fw-bold text-primary">Plan Your Trip ✈️</h1>
        <p className="text-secondary">
          Enter your destination, dates and budget.
        </p>
      </div>

      <div className="card shadow border-0 p-4 mx-auto" style={{ maxWidth: "650px" }}>
        <h3 className="mb-4">Create Trip</h3>

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
            placeholder="e.g. 15000"
            min="1"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100 mb-2"
          onClick={handleCreateTrip}
        >
          Create Trip
        </button>

        <button
          className="btn btn-outline-primary w-100"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>

        {error && (
          <div className="alert alert-danger mt-3 mb-0">
            {error}
          </div>
        )}
      </div>

      {itinerary.length > 0 && (
        <div className="mt-5">
          <h2 className="text-center mb-4">Your Itinerary 🗺️</h2>

          <div className="row g-4">
            {itinerary.map((day) => (
              <div className="col-md-6 col-lg-4" key={day.day}>
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-1">Day {day.day}</h5>
                    <small>{day.date}</small>
                  </div>

                  <div className="card-body">
                    <p>
                      <strong>🌅 Morning:</strong> {day.morning}
                    </p>
                    <p>
                      <strong>☀️ Afternoon:</strong> {day.afternoon}
                    </p>
                    <p className="mb-0">
                      <strong>🌙 Evening:</strong> {day.evening}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateTrip;