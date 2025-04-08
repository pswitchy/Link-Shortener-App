import React from 'react';
// Make sure react-router-dom v6 components are imported
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // Assuming this is a JS file or configured to resolve
import DashboardPage from './pages/DashboardPage'; // Assuming this is a JS file or configured to resolve
import ProtectedRoute from './components/Layout/ProtectedRoute'; // Assuming this is a JS file or configured to resolve
import Navbar from './components/Layout/Navbar'; // Assuming this is a JS file or configured to resolve

function App() {
  // The JSX above translates directly to React.createElement calls like this:
  return React.createElement(
    Router, // Component type
    null,   // Props (none here)
    // Children:
    React.createElement(Navbar, null), // First child: Navbar component
    React.createElement(
      Routes, // Second child: Routes component
      null,   // Props (none here)
      // Children of Routes:
      React.createElement(Route, { // First Route
        path: "/login",
        element: React.createElement(LoginPage, null) // Element prop using LoginPage
      }),
      React.createElement(Route, { // Second Route (Wrapper for protected routes)
        element: React.createElement(ProtectedRoute, null), // Element prop using ProtectedRoute
        children: React.createElement(Route, { // The nested protected Route
            path: "/",
            element: React.createElement(DashboardPage, null) // Element prop using DashboardPage
         })
         // Add other protected routes here as further children of the wrapper Route if needed
      })
      // Optional: Add a 404 Not Found page Route here as another child of Routes
      // React.createElement(Route, { path: "*", element: React.createElement(NotFoundPage, null) })
    )
  );
}

export default App;