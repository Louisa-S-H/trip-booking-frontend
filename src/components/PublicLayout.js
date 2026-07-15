import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import Footer from './Footer';
import '../styles/Public.css';

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <PublicNavbar />
      <main className="public-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
