import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import uploadFile from "../helpers/uploadFile";
import Divider from "./Divider";
import axios from "axios";
import taost from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic,
  });
  const uploadPhotoRef = useRef();
  const modalRef = useRef(); // Ref for the modal container
  const dispatch = useDispatch();

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Disable scrolling on body when modal is open
    document.body.style.overflow = "hidden";
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    setData((preve) => ({
      ...preve,
      name: user.name,
      profile_pic: user?.profile_pic,
    }));
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => ({ ...preve, [name]: value }));
  };

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click();
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setData((preve) => ({ ...preve, profile_pic: uploadPhoto?.url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
      const response = await axios({
        method: "post",
        url: URL,
        data: data,
        withCredentials: true,
      });

      taost.success(response?.data?.message);
      if (response.data.success) {
        dispatch(setUser(response.data.data));
        onClose();
      }
    } catch (error) {
      console.log(error);
      taost.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-lg z-50 flex justify-center items-center p-4">
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl w-full max-w-md 
                        shadow-2xl transform transition-all duration-300
                        border border-white border-opacity-30 relative overflow-hidden animate-fadeIn"
      >
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200 rounded-full opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-200 rounded-full opacity-20"></div>

        <div className="relative z-10">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Edit Profile
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Update your personal information
          </p>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="relative group">
                <Avatar
                  width={80}
                  height={80}
                  imageUrl={data?.profile_pic}
                  name={data?.name}
                  className="rounded-full border-4 border-white shadow-lg 
                                            transform transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center 
                                            bg-black bg-opacity-40 rounded-full opacity-0 
                                            group-hover:opacity-100 transition-opacity duration-300"
                >
                  <span className="text-white text-xs font-medium">Change</span>
                </div>
              </div>
              <input
                type="file"
                id="profile_pic"
                className="hidden"
                onChange={handleUploadPhoto}
                ref={uploadPhotoRef}
              />
              <button
                onClick={handleOpenUploadPhoto}
                className="text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors"
              >
                Upload new photo
              </button>
            </div>

            {/* Name Input */}
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Display Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={data.name}
                  onChange={handleOnChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 
                                            focus:ring-2 focus:ring-blue-100 outline-none transition-all
                                            bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <Divider className="my-2" />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium
                                        hover:bg-gray-100 transition-colors shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 
                                        text-white font-medium hover:from-blue-600 hover:to-indigo-700
                                        transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetails);
