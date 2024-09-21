// components/LoadingSpinner.tsx
import Image from "next/image";
import React from "react";

export default function LoadingSpinner() {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <div className="animate-pulse">
              <Image
                src="/images/restadmin.png"
                width={100}
                height={100}
                alt="RestAdmin Logo"
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

