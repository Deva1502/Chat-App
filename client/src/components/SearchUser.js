import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IoClose } from "react-icons/io5";

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchUser = async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`;
    try {
      setLoading(true);
      const response = await axios.post(URL, {
        search: search
      });
      setLoading(false);
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [search]);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-start p-4 animate-fadeSlide"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-auto mt-10 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center h-14 px-4 bg-gray-100 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search user by name, email..."
            className="w-full h-full bg-transparent outline-none text-sm px-2"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <IoSearchOutline size={22} className="text-gray-600" />
        </div>

        {/* User List */}
        <div className="p-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {searchUser.length === 0 && !loading && (
            <p className="text-center text-slate-400">No user found!</p>
          )}

          {loading && (
            <div className="text-center">
              <Loading />
            </div>
          )}

          {searchUser.length !== 0 && !loading && (
            searchUser.map((user) => (
              <UserSearchCard key={user._id} user={user} onClose={onClose} />
            ))
          )}
        </div>

        {/* Close Button */}
        <div className="absolute top-3 right-3 text-gray-500 hover:text-black transition-transform hover:scale-110">
          <button onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
