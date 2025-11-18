"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import { useState, useEffect } from "react";
import { getProfile } from "@/lib/auth";
import Image from "next/image";
import MenuData from "@/content/menuItemData";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState("");
  const [formattedDate, setCurrentday] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const date = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = days[date.getDay()];
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setCurrentDate(dayName);
    setCurrentday(formattedDate);
  }, []);

  useEffect(() => {
    if (auth?.token) {
      getProfile()
        .then((data) => {
          setProfile(data);
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
        });
    }
  }, [auth?.token]);

  const handleLogout = () => {
    if (auth) {
      auth.logout();
      router.push("/login");
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };
  console.log(profile);
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#E2ECF8] flex flex-col">
        <div className="flex flex-1 relative">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

         
          <aside
            className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0D224A] text-white flex flex-col transform transition-transform duration-300 ease-in-out ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }`}
          >
         
            <div className="p-4  ">
              <div className="flex items-center justify-between mb-4 md:mb-0 md:flex-col">
                <div className="flex items-center gap-3 md:flex-col mt-15">
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-gray-400 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {profile?.profile_image ? (
                      <img
                        src={profile.profile_image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl md:text-3xl"></span>
                    )}
                  </div>
                  <div className="text-left md:text-center">
                    <p className="font-semibold text-sm md:text-lg">
                      {profile?.first_name?.split(" ")[0] || "User"}
                    </p>
                    <p className="text-xs md:text-sm text-blue-200 mt-1 hidden md:block">
                      {auth?.user?.email || ""}
                    </p>
                  </div>
                </div>
              
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden text-white hover:text-gray-300 p-2"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

    
            <nav className="flex-1 overflow-y-auto mt-10">
              <ul className="space-y-2 ">
                {MenuData.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => {
                        router.push(item.path);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-8 py-4 transition-colors text-sm md:text-base ${
                        isActive(item.path)
                          ? "bg-linear-to-r from-[#1D3575] to-transparent "
                          : "text-blue-200"
                      }`}
                    >
                      <Image
                        src={item.icon}
                        alt="logo"
                        height={20}
                        width={20}
                      />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

         
            <div className="p-3 ">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-blue-200  text-sm md:text-base"
              >
                <Image
                  src="/images/dashboard/logout.png"
                  alt="logo"
                  height={20}
                  width={20}
                />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </aside>

     
          <main className="flex-1 overflow-y-auto">
            <div className="w-full">
            
              <header className="bg-white py-6 mb-6">
                <div className="flex items-center justify-between px-20">
                
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden absolute left-3 md:left-6 text-gray-600 hover:text-gray-800 p-2"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>

             

                  <div className="">
                    <Image
                      src="/images/dashboard/logo.png"
                      alt="logo"
                      height={105}
                      width={100}
                    />
                  </div>
                  <div className="flex items-center gap-4 ">
                    <Image
                      src="/images/dashboard/notifications.png"
                      alt="logo"
                      height={35}
                      width={35}
                    />
                    <button className="hidden md:block text-gray-600 hover:text-gray-800">
                      <Image
                        src="/images/dashboard/Cal.png"
                        alt="logo"
                        height={35}
                        width={35}
                      />
                    </button>

                    <div className="flex flex-col gap-0">
                      <span className="text-[#0D224A] font-medium text-[14px]">
                        {currentDate}
                      </span>
                      <span className="text-[#0D224A] font-medium text-[14px]">
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                </div>
              </header>

              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
