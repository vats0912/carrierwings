'use client'
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Link } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/dashboard'); // If user exists, go to dashboard
    } else {
      router.push('/sign-in'); // If not, go to login
    }
  }, [user]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        Staring your journey with CarrierWings
    </div>
  );
}
