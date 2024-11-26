import React, { useState, useEffect } from "react";
import "./CarSearchFilter.css";

const RentalCarFilter = ({
  label,
  optionList,
  selectedOption,
  displayKey,
  onOptionClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    onOptionClick(option[displayKey]);
    setIsOpen(false);
  };

  return (
    <div className="rental-car-filter">
      <div className="filter-header" onClick={toggleDropdown}>
        <p className="selected-branch">
          {selectedOption || `${label} 선택`}
        </p>
        <span className="dropdown-icon">{isOpen ? "▲" : "▼"}</span>
      </div>

      <div
        className={`branch-dropdown ${isOpen ? "open" : ""}`}
        style={{ height: isOpen ? `${3 * 48}px` : "0" }}
      >
        {optionList.map((option, index) => (
          <div
            key={index}
            className="branch-item"
            onClick={() => handleOptionSelect(option)}
          >
            {option[displayKey]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentalCarFilter;
