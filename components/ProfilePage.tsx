"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { getProfile, updateProfile } from "@/lib/auth";
import Image from "next/image";

export default function ProfilePage() {
  const hiddenDateRef = useRef<HTMLInputElement>(null);
  const auth = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    contact_number: "",
    birthday: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (auth?.token) {
      getProfile()
        .then((data) => {
          setProfile(data);
          setFormData({
            first_name:
              data.first_name || auth?.user?.name?.split(" ")[0] || "",
            last_name: data.last_name || auth?.user?.name?.split(" ")[1] || "",
            email: data.email || auth?.user?.email || "",
            address: data.address || "",
            contact_number: data.contact_number || "",
            birthday: data.birthday
              ? new Date(data.birthday).toISOString().split("T")[0]
              : "",
          });
          if (data.profile_image) {
            setImagePreview(data.profile_image);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [auth?.token, auth?.user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!auth?.token) {
      alert("You are not authenticated. Please login again.");
      router.push("/login");
      return;
    }

    setSaving(true);
    try {
      const updateData: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        address: formData.address,
        contact_number: formData.contact_number,
        birthday: formData.birthday || undefined,
      };

      if (profileImage) {
        updateData.profile_image = profileImage;
      }

      const updatedProfile = await updateProfile(updateData);
      setProfile(updatedProfile);
      alert("Profile updated successfully!");

      // Refresh the profile data
      const freshProfile = await getProfile();
      setProfile(freshProfile);
      if (freshProfile.profile_image) {
        setImagePreview(freshProfile.profile_image);
      }
      setProfileImage(null);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        auth.logout();
        router.push("/login");
      } else {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to update profile. Please try again.";
        alert(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg ">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#274AFF] mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white mx-10 pt-2 p-8 rounded-md">
      <h1 className=" font-medium text-[24px] ">Account Information</h1>
      <div className="border-b-2 border-[#5272FF] w-[150px] mb-6"></div>

     
      <div className="mb-6 flex items-center gap-6 border-2 w-[418px] px-6 py-4 rounded-xl">
        <div className="relative">
          <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {imagePreview ? (
              <Image
                width={100}
                height={100}
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className=""></span>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-[#5272FF] rounded-full flex items-center justify-center cursor-pointer "
          >
            <div>
              <Image
                width={35}
                height={35}
                src="/images/dashboard/button.png"
                alt="Profile"
                className=""
              />
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 bg-[#5272FF] text-white font-semibold rounded-lg  flex items-center gap-2 shadow-md"
        >
          <Image
            width={15}
            height={15}
            src="/images/dashboard/upsvg.png"
            alt="Profile"
            className=""
          />
          Upload New Photo
        </button>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-6 mb-6 border-2  px-6 py-4 rounded-xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-blue-100 text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg  focus:ring-blue-100 text-gray-800"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg  focus:ring-blue-100 text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-blue-100 text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number
          </label>
          <input
            type="number"
            value={formData.contact_number}
            onChange={(e) =>
              setFormData({ ...formData, contact_number: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-blue-100 text-gray-800"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birthday
          </label>

          <div className="relative">
      
            <input
              type="text"
              value={formData.birthday}
              readOnly
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-blue-100 text-gray-800 pr-10"
            />

       
            <input
              type="date"
              ref={hiddenDateRef}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              onChange={(e) =>
                setFormData({ ...formData, birthday: e.target.value })
              }
            />

            <Image
              width={22}
              height={22}
              src="/images/dashboard/datecal.png"
              alt="calendar"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer z-20"
              onClick={() => hiddenDateRef.current?.showPicker()}
            />
          </div>
        </div>
      </div>

      
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-12 py-3 bg-[#5272FF] text-white font-semibold rounded-md flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-18 py-3 bg-[#8CA3CD] text-white font-semibold rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
