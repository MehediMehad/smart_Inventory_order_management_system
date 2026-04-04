"use client";

import { useState, useEffect } from "react";
import { User, LogOut, X } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import { logout, getMyProfile } from "@/services/Auth";
// import defaultUser from "@/assets/default-user.png";

const DashboardNavbar = () => {
  const [user, setUser] = useState<{
    name?: string;
    profileImage?: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getMyProfile();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
      <SidebarTrigger />

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="font-medium text-gray-800">
              Welcome {user.name}
            </span>

            {/* <Image
              src={user.profileImage || defaultUser}
              alt={user.name || "User"}
              width={32}
              height={32}
              className="rounded-full border border-gray-300"
            /> */}

            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg p-2 text-gray-500 hover:text-white hover:bg-red-600 transition-colors duration-500"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </>
        ) : (
          <User className="h-8 w-8 text-gray-400" />
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowModal(false)} // ✅ backdrop click closes modal
        >
          <div
            className="bg-white rounded-2xl p-6 w-96 shadow-xl transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()} // ✅ content click stops closing
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Confirm Logout
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <p className="text-gray-600 mb-2">
              Are you sure you want to log out?
            </p>
            <p className="text-gray-600 mb-6">
              You will need to login again to access your account.
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardNavbar;
