
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  }

  return (
    <div className="container py-5">
      <div className="bg-primary text-white p-5 rounded-4 mb-4">
        <h1>Smart Travel Planner ✈️</h1>
        <p className="lead">Plan your next adventure!</p>

        <button
          className="btn btn-light"
          onClick={() => navigate("/create-trip")}
        >
          Create Trip
        </button>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="card-title">🗺️ Create Trip</h3>
              <p className="card-text">
                Choose your destination, dates and budget.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/create-trip")}
              >
                Plan a Trip
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="card-title">🧳 My Trips</h3>
              <p className="card-text">
                View and manage your trips.
              </p>
              <button
                className="btn btn-success"
                onClick={() => navigate("/my-trips")}
              >
                View Trips
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-end mt-4">
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;