// CardCarrossel.jsx
import React from 'react';
import './css/CardCarrossel.css'; // CSS específico

export default function CardCarrossel({ title, fixedContent, carouselContent }) {
  return (
    <div className="card-carrossel">
      <h2>{title}</h2>

      <div className="fixed-content">
        {fixedContent}
      </div>

      <div className="carousel-content">
        {carouselContent}
      </div>
    </div>
  );
}

