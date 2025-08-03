"use client";

import React, { useState } from "react";

const CONTACT_EMAIL = "bookspace@gmail.com";

interface FormData {
  name: string;
  residence_city_suburb: string;
  occupation: string;
  age: string;
  email: string;
  message_for_us: string;
}

interface FormField {
  label: string;
  name: keyof FormData;
}

interface TeamSectionProps {
  title: string;
  members: string[];
  teamName: string;
}

const TeamSection: React.FC<TeamSectionProps> = ({ title, members, teamName }) => {
  const getNameFromFilename = (filename: string) => {
    const name = filename.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/\d+/g, match => ` ${parseInt(match)}`);
  };

  return (
    <div className="mt-4 sm:mt-6 md:mt-8 text-center">
      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-['Literata'] text-[#311E17] mb-2 sm:mb-3 md:mb-4 inline-block">
        {title}
      </h3>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6">
        {members.map((filename) => (
          <div key={filename} className="flex flex-col items-center w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 lg:w-28 lg:h-32">
            <div className="w-full h-16 sm:h-20 md:h-24 lg:h-28 rounded-full overflow-hidden shadow-md border-2 border-[#9D4D38]">
              <img
                src={`/images/${filename}`}
                alt={`Profile picture of ${getNameFromFilename(filename)} from the ${teamName} team`}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#311E17] font-['Merriweather'] mt-1 sm:mt-2 md:mt-2 lg:mt-3 text-center">
              {getNameFromFilename(filename)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function JoinUs() {
  const [showBookInfo, setShowBookInfo] = useState(false);
  const [showSubmitMessage, setShowSubmitMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    residence_city_suburb: "",
    occupation: "",
    age: "",
    email: "",
    message_for_us: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const handleSignUp = () => {
    window.location.href = "/sign-up";
  };

  const handleEmailCV = () => {
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=CV Submission`;
  };

  const handleInstagram = () => {
    window.open("https://www.instagram.com/bookspace__/", "_blank");
  };

  const handleEmail = () => {
    window.location.href = `mailto:${CONTACT_EMAIL}`;
  };

  const toggleBookInfo = () => {
    setShowBookInfo((prev) => !prev);
  };

  const validateForm = () => {
    const errors: Partial<FormData> = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    const [city, suburb] = formData.residence_city_suburb.split(",").map((s) => s.trim());
    if (!city || !suburb) errors.residence_city_suburb = "Please enter Residence as City, Suburb (e.g., Mumbai, Bandra).";
    if (!formData.occupation.trim()) errors.occupation = "Occupation is required.";
    if (!/^\d+$/.test(formData.age) || parseInt(formData.age) <= 0) errors.age = "Please enter a valid age.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Please enter a valid email address.";
    if (!formData.message_for_us.trim()) errors.message_for_us = "Message is required.";
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        const res = await fetch("/api/submit-form", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Submission failed");

        setShowSubmitMessage(true);
        setTimeout(() => setShowSubmitMessage(false), 4000);
        setFormData({
          name: "",
          residence_city_suburb: "",
          occupation: "",
          age: "",
          email: "",
          message_for_us: "",
        });
        setFormErrors({});
        setErrorMessage("");
      } catch (err) {
        console.error("Form submission error:", err);
        setErrorMessage("Something went wrong while submitting. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as keyof FormData]: value }));
    setFormErrors((prev) => ({ ...prev, [name as keyof FormData]: "" }));
  };

  const formFields: FormField[] = [
    { label: "Name", name: "name" },
    { label: "Residence City, Suburb", name: "residence_city_suburb" },
    { label: "Occupation", name: "occupation" },
    { label: "Age", name: "age" },
    { label: "Email", name: "email" },
    { label: "Message for us:", name: "message_for_us" },
  ];

  const teams = [
    { title: "Developers team:", teamName: "Developers", members: ["developer1.png", "developer2.png", "developer3.jpeg", "developer4.png"] },
    { title: "Designers team:", teamName: "Designers", members: ["des1.jpeg", "des2.jpeg", "des3.jpeg", "des4.jpeg"] },
    { title: "Events team:", teamName: "Events", members: ["eve1.jpeg", "eve2.jpeg", "eve3.jpeg", "eve4.jpeg"] },
    { title: "Marketing team:", teamName: "Marketing", members: ["mark1.jpeg", "mark2.jpeg", "mark3.jpeg", "mark4.jpeg"] },
  ];

  return (
    <div className="bg-[#FDE8BE] min-h-screen w-full text-[#311E17] font-['Merriweather'] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Header */}
      <div className="w-full bg-[#AC6F59] h-24 sm:h-28 md:h-32 lg:h-36 flex items-center justify-center">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-['Caveat']">
          JOIN US
        </h1>
      </div>

      {/* Section Title */}
      <div className="text-center mt-4 sm:mt-6 md:mt-8 lg:mt-10 text-base sm:text-lg md:text-xl lg:text-2xl font-bold max-w-3xl mx-auto">
        We’re looking for passionate people like you to join our community
      </div>

      {/* Membership CTA */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-4 sm:mt-6 md:mt-8 lg:mt-10">
        <div className="text-sm sm:text-base md:text-lg lg:text-xl text-[#361313] font-['Literata']">
          To be a Member:
        </div>
        <button
          onClick={handleSignUp}
          className="bg-[#AC6F59] text-white rounded-full px-4 sm:px-6 md:px-8 lg:px-10 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-sm sm:text-base md:text-lg lg:text-xl font-bold"
          aria-label="Sign up to become a member"
        >
          Sign Up
        </button>
      </div>

      {/* Join Team CTA */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-3 sm:mt-4 md:mt-6 lg:mt-8">
        <div className="text-sm sm:text-base md:text-lg lg:text-xl text-[#361313] font-['Literata']">
          To join our team:
        </div>
        <button
          onClick={handleEmailCV}
          className="bg-[#AC6F59] text-white rounded-full px-4 sm:px-6 md:px-8 lg:px-10 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-sm sm:text-base md:text-lg lg:text-xl font-bold"
          aria-label="Email your CV to join the team"
        >
          Email CV
        </button>
      </div>

      {/* Cards for Roles */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-6 md:mt-8 lg:mt-10">
        <div className="bg-[#D9D9D9]/[.75] rounded-[50px] shadow-md w-full sm:w-56 md:w-60 lg:w-64 h-32 sm:h-36 md:h-40 lg:h-44 flex items-center justify-center">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-center font-bold px-2">
            Videographer Needed
          </p>
        </div>
        <div className="bg-[#D9D9D9]/[.75] rounded-[50px] shadow-md w-full sm:w-56 md:w-60 lg:w-64 h-32 sm:h-36 md:h-40 lg:h-44 flex items-center justify-center">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-center font-bold px-2">
            Marketing Interns Needed
          </p>
        </div>
      </div>

      {/* Collaborate */}
      <div className="text-sm sm:text-base md:text-lg lg:text-xl text-[#361313] font-['Literata'] text-center mt-4 sm:mt-6 md:mt-8 lg:mt-10">
        To collaborate:
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-3 sm:mt-4">
        <button
          onClick={handleInstagram}
          className="bg-[#AC6F59] text-white rounded-full px-4 sm:px-6 md:px-7 lg:px-8 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-sm sm:text-base md:text-lg lg:text-xl font-bold w-full sm:w-auto"
          aria-label="Visit our Instagram page"
        >
          Insta ID
        </button>
        <button
          onClick={handleEmail}
          className="bg-[#AC6F59] text-white rounded-full px-4 sm:px-6 md:px-7 lg:px-8 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-sm sm:text-base md:text-lg lg:text-xl font-bold w-full sm:w-auto"
          aria-label="Email us for collaboration"
        >
          Email ID
        </button>
      </div>

      {/* Free Book Exchange Info */}
      <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 text-center">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#311E17] font-['Literata'] mb-3 sm:mb-4 md:mb-5">
          To Join Free Book Exchange in MUMBAI:
        </h2>
        <div
          onClick={toggleBookInfo}
          className="cursor-pointer bg-[#D9D9D9]/[.75] mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-28 sm:h-32 md:h-36 lg:h-40 rounded-2xl flex items-center justify-center shadow-md"
          role="button"
          aria-expanded={showBookInfo}
          aria-label="Toggle free book exchange information"
        >
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center font-bold px-2">
            What is Free Book Exchange? <span className="text-blue-600 underline ml-2">Click to know more</span>
          </p>
        </div>
        {showBookInfo && (
          <div className="mt-3 sm:mt-4 md:mt-5 text-[#311E17] text-sm sm:text-base md:text-lg lg:text-xl font-['Literata'] max-w-3xl mx-auto">
            A free book exchange is a community initiative where people can donate and borrow books at no cost.
          </div>
        )}
      </div>

      {/* Form Section */}
      <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-[#D9D9D9]/[.75] rounded-2xl shadow-md p-4 sm:p-5 md:p-6 lg:p-8">
        {formFields.map(({ label, name }) => (
          <div key={name} className="mb-3 sm:mb-4 md:mb-5">
            <label htmlFor={name} className="block text-[#311E17] text-sm sm:text-base md:text-lg lg:text-xl font-['Literata'] mb-1 sm:mb-2">
              {label}
            </label>
            {name === "message_for_us" ? (
              <textarea
                id={name}
                className="w-full h-20 sm:h-24 md:h-28 lg:h-32 px-3 py-2 rounded-2xl bg-white shadow-md text-sm sm:text-base md:text-lg resize-none"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                aria-describedby={formErrors[name] ? `${name}-error` : undefined}
              />
            ) : (
              <input
                id={name}
                className="w-full h-9 sm:h-10 md:h-11 lg:h-12 px-3 rounded-2xl bg-white shadow-md text-sm sm:text-base md:text-lg"
                type={name === "age" ? "number" : "text"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                min={name === "age" ? "1" : undefined}
                aria-describedby={formErrors[name] ? `${name}-error` : undefined}
              />
            )}
            {formErrors[name] && (
              <p id={`${name}-error`} className="text-red-600 text-xs sm:text-sm mt-1">{formErrors[name]}</p>
            )}
          </div>
        ))}
        <div className="text-right">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`bg-[#17A1FA]/[.75] px-4 sm:px-5 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-2.5 lg:py-3 rounded-2xl text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl shadow-md ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Submit the form"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
        {showSubmitMessage && (
          <p className="text-green-700 mt-3 sm:mt-4 text-center font-bold text-sm sm:text-base md:text-lg">
            Your response has been successfully stored
          </p>
        )}
        {errorMessage && (
          <p className="text-red-600 mt-3 sm:mt-4 text-center font-bold text-sm sm:text-base md:text-lg">
            {errorMessage}
          </p>
        )}
      </div>

      {/* Our Team */}
      <div className="text-center mt-4 sm:mt-6 md:mt-8 lg:mt-12">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">OUR TEAM</h2>
      </div>

      {teams.map(({ title, teamName, members }) => (
        <TeamSection key={title} title={title} teamName={teamName} members={members} />
      ))}
      <div className="pb-8 sm:pb-10 md:pb-12 lg:pb-16"></div>
    </div>
  );
}