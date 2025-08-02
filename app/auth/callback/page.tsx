"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/superbase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const checkResponse = await fetch(
            `/api/users/check/${session.user.id}`
          );
          const { exists } = await checkResponse.json();

          if (!exists) {
            const response = await fetch("/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: session.user.id,
                email: session.user.email,
                username: null, 
                name:
                  session.user.user_metadata?.full_name ||
                  session.user.email?.split("@")[0],
                address: session.user.user_metadata?.location || "",
              }),
            });

            if (!response.ok) {
              console.error("Failed to create user in database");
            }
          }
          router.push("/profile");
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
        router.push("/login-signup?error=Unable to complete sign in");
      }
    };

    handleCallback();
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Completing sign in...</h2>
        <p className="text-gray-600">
          Please wait while we set up your account.
        </p>
      </div>
    </div>
  );
}
