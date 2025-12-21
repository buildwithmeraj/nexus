import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { FaSearch, FaFilter, FaExclamationTriangle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import ClubCard from "../../shared/ClubCard";
import Loading from "../../utilities/Loading";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { MdCategory } from "react-icons/md";
import { FaFilterCircleDollar } from "react-icons/fa6";
import { TiThSmall } from "react-icons/ti";

const fetchClubs = async ({ queryKey, axiosInstance }) => {
  const [, limit, searchQuery, selectedCategory, minFee, maxFee, status] =
    queryKey;

  const params = new URLSearchParams();

  if (limit > 0) params.append("limit", limit);
  if (limit > 0) params.append("status", "approved");
  if (searchQuery) params.append("search", searchQuery);
  if (selectedCategory) params.append("category", selectedCategory);
  if (minFee) params.append("minFee", minFee);
  if (maxFee) params.append("maxFee", maxFee);
  if (status) params.append("status", status);

  const res = await axiosInstance.get(`/clubs?${params.toString()}`);
  return res.data;
};

export default function AllClubs({ limit = 0 }) {
  const axiosInstance = useAxiosSecureInstance();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [status, setStatus] = useState("");

  // Categories
  const { data: categoriesData = { data: [] } } = useQuery({
    queryKey: ["club-categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/clubs/categories");
      return res.data;
    },
    enabled: !limit, // don't fetch when used as limited section
  });

  const categories = categoriesData.data || [];

  // Clubs
  const {
    data: clubsResponse = { data: [] },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "clubs",
      limit,
      searchQuery,
      selectedCategory,
      minFee,
      maxFee,
      status,
    ],
    queryFn: ({ queryKey }) =>
      fetchClubs({
        queryKey,
        axiosInstance,
      }),
  });

  const clubs = Array.isArray(clubsResponse)
    ? clubsResponse
    : clubsResponse.data || [];

  const hasActiveFilters = searchQuery || selectedCategory || minFee || maxFee;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinFee("");
    setMaxFee("");
    setStatus("");
  };

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-error font-semibold">Failed to load clubs</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="my-6">
      {!limit && (
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Discover Clubs</h2>
          <p className="text-sm text-base-content/70">
            Find clubs that match your interests
          </p>
        </div>
      )}

      {!limit && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 items-center mb-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 z-10" />
              <input
                type="text"
                placeholder="Search clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>

            <div className="relative">
              <MdCategory className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 z-10" />
              <select
                className="select select-bordered pl-10 w-full"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 z-10 mt-0.5" />{" "}
              <select
                className="select select-bordered w-full pl-10"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="relative">
              <FaFilterCircleDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 z-10 mt-0.5" />
              <input
                type="number"
                placeholder="Min Fee"
                className="input input-bordered pl-10 w-full"
                value={minFee}
                onChange={(e) => setMinFee(e.target.value)}
              />
            </div>
            <div className="relative">
              <FaFilterCircleDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 z-10 mt-0.5" />
              <input
                type="number"
                placeholder="Max Fee"
                className="input input-bordered pl-10 w-full"
                value={maxFee}
                onChange={(e) => setMaxFee(e.target.value)}
              />
            </div>

            <button
              onClick={resetFilters}
              className="btn btn-outline gap-2"
              disabled={!hasActiveFilters}
            >
              <IoMdClose />
              Clear
            </button>
          </div>
        </>
      )}

      {clubs.length === 0 && (
        <div className="bg-base-100 rounded-lg text-center border-2 border-dashed border-base-300 flex items-center justify-center flex-col py-30 text-base-content/50">
          <FaExclamationTriangle className="text-4xl text-warning mx-auto mb-4" />
          <p className="font-semibold mb-2">No Clubs Found</p>
          <p className="text-sm text-base-content/70">
            Try adjusting your filters
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="btn btn-outline btn-sm mt-4"
            >
              <IoMdClose size={16} />
              Clear Filters
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {clubs.map((club) => (
          <ClubCard key={club._id} club={club} />
        ))}
      </div>

      {limit > 0 && (
        <div className="flex justify-center mt-6">
          <Link to="/clubs" className="btn btn-primary">
            <TiThSmall />
            All Clubs
          </Link>
        </div>
      )}
    </div>
  );
}
