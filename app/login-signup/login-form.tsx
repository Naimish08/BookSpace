"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { createClient } from "@/utils/superbase/client";
import { PrismaClient } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";

export default function Component() {
  const [activeTab, setActiveTab] = useState("signup");
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (activeTab === "signup") {
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      if (!form.terms) {
        setError("You must agree to the terms and conditions");
        setLoading(false);
        return;
      }
      // console.log("Hello 1");
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            username: form.username,
            name: form.name,
            city: form.city,
          },
        },
      });
      // console.log("Hello 2");

      if (error) {
        setError(error.message);
      } else if (data.user) {
        try {
          const response = await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: data.user.id,
              username: form.username,
              name: form.name,
              address: form.city,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to create user in database");
          }

          setSuccess(
            "Signup successful! Please check your email to verify your account."
          );
        } catch (dbError) {
          console.error("Database error:", dbError);
          setError(
            "Account created but failed to save profile. Please contact support."
          );
        }
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Login successful!");
        setTimeout(() => {
          router.push("/profile");
        }, 1000);
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,  
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#fde8be" }}
    >
      <div
        className="w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: activeTab === "signin" ? "#704CAA" : "#462C90",
        }}
      >
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left side - Illustration */}
          <div className="lg:w-1/2 p-8 flex items-center justify-center">
            <div className="relative">
              <div className="text-center">
                <Image
                  src="loginphoto.png"
                  alt="Reading Illustration"
                  width={557} // or any other dimension
                  height={314}
                />
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="lg:w-1/2 p-8 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <h1 className="text-2xl font-semibold text-white text-center mb-8">
                LOGIN TO CONTINUE
              </h1>

              {/* Google Sign In Button */}
              <Button
                variant="outline"
                className="w-full mb-6 bg-white text-gray-700 border-0  py-3 rounded-full"
                onClick={handleGoogle}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue With Google
              </Button>

              {/* OR Divider */}
              <div className="flex items-center mb-6">
                <div className="flex-1 h-px bg-white opacity-30"></div>
                <span className="px-4 text-white text-sm">OR</span>
                <div className="flex-1 h-px bg-white opacity-30"></div>
              </div>

              {/* Tab Buttons */}
              <div className="flex mb-6 rounded-full overflow-hidden">
                <button
                  onClick={() => {
                    setActiveTab("signup");
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 py-3 px-6 text-sm font-medium transition-colors ${
                    activeTab === "signup" ? "text-white" : "text-gray-300"
                  }`}
                  style={{
                    backgroundColor:
                      activeTab === "signup" ? "#220440" : "transparent",
                  }}
                >
                  Sign up
                </button>
                <button
                  onClick={() => {
                    setActiveTab("signin");
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 py-3 px-6 text-sm font-medium transition-colors ${
                    activeTab === "signin" ? "text-white" : "text-gray-300"
                  }`}
                  style={{
                    backgroundColor:
                      activeTab === "signin" ? "#220440" : "transparent",
                  }}
                >
                  Sign in
                </button>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 text-red-200 text-center">{error}</div>
              )}
              {success && (
                <div className="mb-4 text-green-200 text-center">{success}</div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  <Input
                    placeholder="Email *"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="bg-white bg-opacity-20 border-0 text-white placeholder:text-gray-300 rounded-full py-3 px-4"
                  />
                  {activeTab === "signup" && (
                    <>
                      <Input
                        placeholder="Name *"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="bg-white bg-opacity-20 border-0 text-white placeholder:text-gray-300 rounded-full py-3 px-4"
                      />
                      <Input
                        placeholder="E-Mail *"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="bg-white bg-opacity-20 border-0 text-white placeholder:text-gray-300 rounded-full py-3 px-4"
                      />
                      <Input
                        placeholder="Password *"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="bg-white bg-opacity-20 border-0 text-white placeholder:text-gray-300 rounded-full py-3 px-4"
                      />
                      <Input
                        placeholder="Confirm Password *"
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="bg-white bg-opacity-20 border-0 text-white placeholder:text-gray-300 rounded-full py-3 px-4"
                      />
                      <Input
                        placeholder="City"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="bg-white bg-opacity-20 border-0 text-white placeholder:text-gray-300 rounded-full py-3 px-4"
                      />
                    </>
                  )}
                  {activeTab === "signin" && (
                    <Input
                      placeholder="Password *"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="bg-white bg-opacity-20 border-0 text-white placeholder:text-gray-300 rounded-full py-3 px-4"
                    />
                  )}
                </div>

                {/* Terms Checkbox */}
                {activeTab === "signup" && (
                  <div className="flex items-center space-x-2 mb-6">
                    <Checkbox
                      id="terms"
                      name="terms"
                      checked={form.terms}
                      onCheckedChange={(checked) =>
                        setForm((prev) => ({ ...prev, terms: !!checked }))
                      }
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-purple-900"
                    />
                    <label htmlFor="terms" className="text-sm text-white">
                      I agree with the terms and conditions
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  className="w-full py-3 rounded-full text-white font-medium"
                  style={{ backgroundColor: "#220440" }}
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Please wait..."
                    : activeTab === "signup"
                    ? "Sign up"
                    : "Sign in"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
