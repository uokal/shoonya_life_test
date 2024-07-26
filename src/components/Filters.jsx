import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

const Filters = ({ onFilterChange, onSearchChange, uniqueTypes = [] }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
    if (inputRef.current) inputRef.current.type = "date";
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (inputRef.current) inputRef.current.type = "text";
  };

  const handleTypeChange = (e) => {
    onFilterChange({ type: e.target.value, date: "" });
  };

  const handleDateChange = (e) => {
    onFilterChange({ type: "", date: e.target.value });
  };

  return (
    <div className="flex flex-col justify-between md:flex-row gap-4 mb-4 text-white">
      <div>
        <input
          ref={inputRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          type={isFocused ? "date" : "text"}
          onChange={handleDateChange}
          placeholder="Filter by Date"
          className="p-3 border rounded-lg lg:bg-[#1b3252] bg-white lg:text-white text-black lg:mr-6 w-full lg:w-fit"
        />
        <select
          onChange={handleTypeChange}
          className="p-3 border rounded-lg lg:bg-[#1b3252] bg-white lg:text-white text-black w-full lg:w-fit mt-4 lg:mt-0"
          defaultValue=""
        >
          <option value="">Filter by Type</option>
          {uniqueTypes.length > 0 ? (
            uniqueTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))
          ) : (
            <option value="">No Types Available</option>
          )}
        </select>
      </div>
      <input
        type="text"
        placeholder="Search retreats by title ..."
        onChange={(e) => onSearchChange(e.target.value)}
        className="p-4 border rounded-lg w-full lg:w-80 lg:placeholder:text-white placeholder:text-black lg:bg-[#1b3252] bg-white lg:text-white text-black"
      />
    </div>
  );
};

// Define prop types for the Filters component
Filters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  uniqueTypes: PropTypes.array
};

export default Filters;
