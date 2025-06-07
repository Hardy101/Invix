import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import api from "../services/api";
import { Guest } from "../services/api";

interface GuestSearchProps {
  onGuestSelect?: (guest: Guest) => void;
  className?: string;
}

const GuestSearch: React.FC<GuestSearchProps> = ({
  onGuestSelect,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchGuests = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await api.searchGuest(searchQuery);
        setSearchResults(results);
      } catch (err) {
        setError("Failed to search guests. Please try again.");
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchGuests, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search guests by name, email, or tags..."
          className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {isLoading && (
        <div className="absolute w-full mt-1 p-2 bg-white rounded-lg shadow-lg">
          <p className="text-gray-500">Searching...</p>
        </div>
      )}

      {error && (
        <div className="absolute w-full mt-1 p-2 bg-white rounded-lg shadow-lg">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {searchResults.length > 0 && !isLoading && (
        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((guest) => (
            <div
              key={guest.id}
              onClick={() => onGuestSelect?.(guest)}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
            >
              <div className="font-medium">{guest.name}</div>
              {guest.email && (
                <div className="text-sm text-gray-500">{guest.email}</div>
              )}
              {guest.tags && (
                <div className="text-sm text-gray-400">{guest.tags}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {searchQuery.length >= 2 && searchResults.length === 0 && !isLoading && (
        <div className="absolute w-full mt-1 p-2 bg-white rounded-lg shadow-lg">
          <p className="text-gray-500">No guests found</p>
        </div>
      )}
    </div>
  );
};

export default GuestSearch;
