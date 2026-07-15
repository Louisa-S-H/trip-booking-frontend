import React from 'react';
import logo from '../assets/ssc-logo.png';

export default function DashboardBrand({ title }) {
  return (
    <div className="dashboard-brand">
      <img src={logo} alt="Student Services Consultancy" />
      <h1>{title}</h1>
    </div>
  );
}
