"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/superbase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login-signup");
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push("/login-signup");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
      } else {
        console.log("Successfully signed out");
        router.push("/login-signup");
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className=" rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            <Button
              onClick={handleSignOut}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              Sign Out
            </Button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                User Information
              </h2>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
