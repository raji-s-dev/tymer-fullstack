import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import { useUserStore } from "./store/useUserStore";
import { useEffect } from "react";
import FullScreenOneTimeTask from "./components/FullScreenTask/FullScreenOneTimeTask";


function App() {

   const loadProfile = useUserStore((s) => s.loadProfile);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/task/:id" element={<FullScreenOneTimeTask />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
