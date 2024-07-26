import React, { useState, useEffect } from "react";
import RetreatCard from "./RetreatCard";
import Filters from "./Filters";
import Pagination from "./Pagination";

const RetreatList = () => {
    const [retreats, setRetreats] = useState([]);
  const [filters, setFilters] = useState({ type: "", date: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [loading, setLoading] = useState(true);
  const [uniqueTypes, setUniqueTypes] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  useEffect(() => {
    const fetchRetreats = async () => {
      let url = `https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?page=${page}&limit=3`;

      if (debouncedSearch) {
        url += `&search=${encodeURIComponent(debouncedSearch)}`;
      }

      if (filters.type) {
        url += `&type=${encodeURIComponent(filters.type)}`;
      }

      if (filters.date) {
        const unixTimestamp = new Date(filters.date).getTime() / 1000;
        url += `&date=${unixTimestamp}`;
      }

      try {
        const totalCountResponse = await fetchTotalCount();
        const calculatedTotalPages = Math.ceil(totalCountResponse / 3);
        setTotalPages(calculatedTotalPages);

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
          setRetreats(data);
          setError(null);
        } else {
          setError("No retreats found for the selected filters!");
          setRetreats([]);
        }
      } catch (error) {
        console.error("Error fetching retreats:", error);
        setError("An error occurred while fetching retreats.");
        setRetreats([]);
      }
      setLoading(false);
    };

    const fetchTotalCount = async () => {
      try {
        const response = await fetch(
          `https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?limit=1`
        );
        const data = await response.json();
        return data.length;
      } catch (error) {
        console.error("Error fetching total count:", error);
        return 0;
      }
    };

    const fetchUniqueTypes = async () => {
      try {
        const response = await fetch(
          `https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats`
        );
        const data = await response.json();
        const types = [...new Set(data.map(retreat => retreat.type))];
        setUniqueTypes(types);
      } catch (error) {
        console.error("Error fetching unique types:", error);
      }
    };

    fetchRetreats();
    fetchUniqueTypes();
  }, [filters, debouncedSearch, page]);

  const handlePageChange = (newPage) => {
    setLoading(true);
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };


  if (loading) {
    return (
      <div className="w-fit m-auto p-20">
       <svg class="ip" viewBox="0 0 256 128" width="256px" height="128px" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0%" stop-color="#5ebd3e" />
				<stop offset="33%" stop-color="#ffb900" />
				<stop offset="67%" stop-color="#f78200" />
				<stop offset="100%" stop-color="#e23838" />
			</linearGradient>
			<linearGradient id="grad2" x1="1" y1="0" x2="0" y2="0">
				<stop offset="0%" stop-color="#e23838" />
				<stop offset="33%" stop-color="#973999" />
				<stop offset="67%" stop-color="#009cdf" />
				<stop offset="100%" stop-color="#5ebd3e" />
			</linearGradient>
		</defs>
		<g fill="none" stroke-linecap="round" stroke-width="16">
			<g class="ip__track" stroke="#ddd">
				<path d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56"/>
				<path d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64"/>
			</g>
			<g stroke-dasharray="180 656">
				<path class="ip__worm1" stroke="url(#grad1)" stroke-dashoffset="0" d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56"/>
				<path class="ip__worm2" stroke="url(#grad2)" stroke-dashoffset="358" d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64"/>
			</g>
		</g>
	</svg>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Filters
        onFilterChange={(filter) => setFilters(filter)}
        onSearchChange={(search) => setSearch(search)}
        uniqueTypes={uniqueTypes}
      />
      {error ? (
        <div className="flex flex-col items-center justify-center p-2 text-center mt-4">
          <p className="text-[1.4rem] font-semibold">{error}</p>
          <img
            src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExb21ieDgxaXFiNWg0NGJncmFpM2tmMmd4cnZ4dDdsdTFzOHBvOXUzNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l4EoZ1rJtDfypcna8/giphy.gif"
            className="lg:w-[25rem] rounded-full mt-4"
            alt="Error"
          />
        </div>
      ) : retreats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {retreats.map((retreat) => (
            <RetreatCard key={retreat.id} retreat={retreat} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-2 text-center mt-4">
          <p>No more retreats found.</p>
        </div>
      )}
      {retreats.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default RetreatList;
