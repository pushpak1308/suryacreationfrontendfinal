import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/searchBar.css";

const SearchBar = () => {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
  };

  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <input
        ref={inputRef}
        value={query}
        placeholder="Search gifts, prints, frames…"
        onChange={(e) => setQuery(e.target.value)}
      />

      {query && (
        <button
          type="button"
          className="clear-btn"
          onClick={() => setQuery("")}
        >
          ×
        </button>
      )}

      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
