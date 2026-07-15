import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';

export default function About() {
  const [companyProfile, setCompanyProfile] = useState(null);
  const [visionMission, setVisionMission] = useState(null);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    axiosInstance.get('/content/company_profile').then((res) => setCompanyProfile(res.data)).catch(() => {});
    axiosInstance.get('/content/vision_mission').then((res) => setVisionMission(res.data)).catch(() => {});
    axiosInstance.get('/team').then((res) => setTeam(res.data)).catch(() => setTeam([]));
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>About Us</h1>
      </div>

      <section id="company-profile" style={{ marginBottom: '50px' }}>
        <h2>{companyProfile?.title || 'Company Profile'}</h2>
        <p>{companyProfile?.body || 'Loading...'}</p>
      </section>

      <section id="vision-mission" style={{ marginBottom: '50px' }}>
        <h2>{visionMission?.title || 'Vision & Mission'}</h2>
        <p>{visionMission?.body || 'Loading...'}</p>
      </section>

      <section id="our-team">
        <h2 style={{ marginBottom: '20px' }}>Our Team</h2>
        <div className="card-grid">
          {team.map((member) => (
            <div key={member._id} className="content-card">
              <div
                className="content-card-image"
                style={member.photo ? { backgroundImage: `url(${member.photo})` } : undefined}
              />
              <div className="content-card-body">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <p>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
