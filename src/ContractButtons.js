import React from 'react';
import './App.css';

const ContractButtons = ({ onButtonClick }) => {
  const handleButtonClick = (index) => {
    onButtonClick(index);
  };

  return (
    <div className="ContractButtons">
      {Array.from({ length: 8 }, (_, index) => (
        <button key={index} className="contract-btn" onClick={() => handleButtonClick(index)}>
          Team {index + 1}
        </button>
      ))}
    </div>
  );
};

export default ContractButtons;

