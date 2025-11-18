"use client";

import Image from "next/image";

export default function EmptyState() {
  return (
    <div className="rounded-xl  p-12 text-center text-gray-500">
      <div className="mb-3 flex justify-center">
        <div className="relative">
          <Image
            src="/images/dashboard/icon-no projects.png"
            alt=""
            width={200}
            height={200}
          />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-700">No todos yet</h3>
    </div>
  );
}
