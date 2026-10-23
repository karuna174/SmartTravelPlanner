import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import CreateTrip from "./pages/CreateTrip";
import MyTrips from "./pages/MyTrips";
import EditTrip from "./pages/EditTrip";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" 
      element={
      <ProtectedRoute>
      <Dashboard />
      </ProtectedRoute>
      } 
      />
      <Route path="/create-trip"
      element={
      <ProtectedRoute>
        <CreateTrip />
      </ProtectedRoute>
  }
/>
      <Route
      path="/my-trips"
      element={
        <ProtectedRoute>
          <MyTrips />
        </ProtectedRoute>
      }
  />
      <Route
        path="/edit-trip/:id"
        element={
          <ProtectedRoute>
            <EditTrip />
          </ProtectedRoute>
  }
/>
    </Routes>
    
  );
}

export default App;