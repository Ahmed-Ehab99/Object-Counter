import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";

const CameraPage = React.lazy(() => import("./pages/CameraPage"));
const HistoryPage = React.lazy(() => import("./pages/HistoryPage"));

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper */}
        <Route element={<AppLayout />}>
          {/* default route → redirect to /camera */}
          <Route index element={<Navigate to="/camera" replace />} />

          {/* main routes */}
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
