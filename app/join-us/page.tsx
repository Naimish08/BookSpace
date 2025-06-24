"use client";

import React, { useState } from "react";

export default function JoinUs() {
  const [showBookInfo, setShowBookInfo] = useState(false);
  const [showSubmitMessage, setShowSubmitMessage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    residence_city_suburb: "",
    occupation: "",
    age: "",
    email: "",
    message_for_us: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleSignUp = () => {
    window.location.href = "/sign-up";
  };

  const handleEmailCV = () => {
    window.location.href = "mailto:bookspace@gmail.com?subject=CV Submission";
  };

  const handleInstagram = () => {
    window.open("https://www.instagram.com/bookspace__/", "_blank");
  };

  const handleEmail = () => {
    window.location.href = "mailto:bookspace@gmail.com";
  };

  const toggleBookInfo = () => {
    setShowBookInfo((prev) => !prev);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.residence_city_suburb.includes(",")) errors.residence_city_suburb = "Please enter Residence as City, Suburb.";
    if (!formData.occupation.trim()) errors.occupation = "Occupation is required.";
    if (!/^\d+$/.test(formData.age) || parseInt(formData.age) <= 0) errors.age = "Please enter a valid age.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Please enter a valid email address.";
    if (!formData.message_for_us.trim()) errors.message_for_us = "Message is required.";
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
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
      } catch (err) {
        console.error("Form submission error:", err);
        alert("Something went wrong while submitting. Please try again later.");
      }
    } else {
      setFormErrors(errors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const formFields = [
    { label: "Name", name: "name" },
    { label: "Residence City, Suburb", name: "residence_city_suburb" },
    { label: "Occupation", name: "occupation" },
    { label: "Age", name: "age" },
    { label: "Email", name: "email" },
    { label: "Message for us:", name: "message_for_us" },
  ];

  return (
    <div className="bg-[#FDE8BE] min-h-screen w-full text-[#311E17] font-['Merriweather'] px-4 sm:px-8 lg:px-16">
      {/* Header */}
      <div className="w-full bg-[#AC6F59] h-[120px] flex items-center justify-center">
        <h1 className="text-white text-4xl sm:text-5xl font-bold font-['Caveat']">JOIN US</h1>
      </div>

      {/* Section Title */}
      <div className="text-center mt-6 sm:mt-10 text-lg sm:text-2xl font-bold">
        We’re looking for passionate people like you to join our community
      </div>

      {/* Membership CTA */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-6 sm:mt-10">
        <div className="text-base sm:text-xl text-[#361313] font-['Literata']">To be a Member:</div>
        <button onClick={handleSignUp} className="bg-[#AC6F59] text-white rounded-full px-6 sm:px-12 py-2 sm:py-3 text-base sm:text-xl font-bold">
          Sign Up
        </button>
      </div>

      {/* Join Team CTA */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-4 sm:mt-6">
        <div className="text-base sm:text-xl text-[#361313] font-['Literata']">To join our team:</div>
        <button onClick={handleEmailCV} className="bg-[#AC6F59] text-white rounded-full px-6 sm:px-12 py-2 sm:py-3 text-base sm:text-xl font-bold">
          email cv
        </button>
      </div>

      {/* Cards for Roles */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 mt-6 sm:mt-10">
        <div className="bg-[#D9D9D9]/[.75] rounded-[50px] shadow-md w-full sm:w-64 h-40 flex items-center justify-center">
          <p className="text-lg sm:text-xl text-center font-bold">videographer needed</p>
        </div>
        <div className="bg-[#D9D9D9]/[.75] rounded-[50px] shadow-md w-full sm:w-64 h-40 flex items-center justify-center">
          <p className="text-lg sm:text-xl text-center font-bold">marketing interns needed</p>
        </div>
      </div>

      {/* Collaborate */}
      <div className="text-base sm:text-xl text-[#361313] font-['Literata'] text-center mt-6 sm:mt-10">
        To collaborate:
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-4">
        <button onClick={handleInstagram} className="bg-[#AC6F59] text-white rounded-full px-4 sm:px-8 py-2 sm:py-3 text-base sm:text-xl font-bold w-full sm:w-auto">
          insta id
        </button>
        <button onClick={handleEmail} className="bg-[#AC6F59] text-white rounded-full px-4 sm:px-8 py-2 sm:py-3 text-base sm:text-xl font-bold w-full sm:w-auto">
          email id
        </button>
      </div>

      {/* Free Book Exchange Info */}
      <div className="mt-6 sm:mt-10 text-center">
        <h2 className="text-lg sm:text-2xl text-[#361313] font-['Literata'] mb-4">
          To Join Free Book Exchange in MUMBAI:
        </h2>
        <div
          onClick={toggleBookInfo}
          className="cursor-pointer bg-[#D9D9D9]/[.75] mx-auto w-full sm:w-3/4 lg:w-1/2 h-32 sm:h-40 rounded-2xl flex items-center justify-center shadow-md"
        >
          <p className="text-lg sm:text-xl text-center font-bold">
            what is free book exchange? <span className="text-blue-600 underline ml-2">Click to know more</span>
          </p>
        </div>
        {showBookInfo && (
          <div className="mt-4 text-[#361313] text-base sm:text-lg font-['Literata'] max-w-2xl mx-auto">
            A free book exchange is a community initiative where people can donate and borrow books at no cost.
          </div>
        )}
      </div>

      {/* Form Section */}
      <div className="mt-6 sm:mt-10 w-full max-w-2xl mx-auto bg-[#D9D9D9]/[.75] rounded-2xl shadow-md p-4 sm:p-6">
        {formFields.map(({ label, name }) => (
          <div key={name} className="mb-3 sm:mb-4">
            <label className="block text-[#311E17] text-base sm:text-lg font-['Literata'] mb-1">{label}</label>
            {name === "message_for_us" ? (
              <textarea
                className="w-full h-20 sm:h-24 px-3 py-2 rounded-full bg-white shadow-md text-sm sm:text-base resize-none"
                name={name}
                value={formData[name]}
                onChange={handleChange}
              />
            ) : (
              <input
                className="w-full h-8 sm:h-10 px-3 rounded-full bg-white shadow-md text-sm sm:text-base"
                type={name === "age" ? "number" : "text"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                min={name === "age" ? "1" : undefined}
              />
            )}
            {formErrors[name] && (
              <p className="text-red-600 text-xs mt-1">{formErrors[name]}</p>
            )}
          </div>
        ))}
        <div className="text-right">
          <button onClick={handleSubmit} className="bg-[#17A1FA]/[.75] px-4 sm:px-6 py-1 sm:py-2 rounded-full text-white font-bold text-sm sm:text-base shadow-md">
            Submit
          </button>
        </div>
        {showSubmitMessage && (
          <p className="text-green-700 mt-3 sm:mt-4 text-center font-bold text-sm sm:text-base">Your response has been successfully stored</p>
        )}
      </div>

      {/* Our Team */}
      <div className="text-center mt-6 sm:mt-12">
        <h2 className="text-xl sm:text-3xl font-bold">OUR TEAM</h2>
      </div>

      {["Developers team:", "Designers team:", "Events team:", "Marketing team:"].map((team, i) => (
        <div key={i} className="mt-4 sm:mt-6 text-center">
          <h3 className="text-base sm:text-lg font-['Literata'] text-[#311E17] mb-2 inline-block">{team}</h3>
          <div className="flex justify-center gap-2 sm:gap-4 w-full">
            {team === "Developers team:" &&
              ["developer1.png", "developer2.png", "developer3.jpeg", "developer4.png"].map((filename, j) => (
                <div
                  key={j}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md border-2 border-[#9D4D38]"
                >
                  <img
                    src={`/${filename}`}
                    alt={`Developer ${j + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

            {team === "Designers team:" &&
              ["des1.jpeg", "des2.jpeg", "des3.jpeg", "des4.jpeg"].map((filename, j) => (
                <div
                  key={j}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md border-2 border-[#9D4D38]"
                >
                  <img
                    src={`/${filename}`}
                    alt={`Designer ${j + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

            {team === "Events team:" &&
              ["eve1.jpeg", "eve2.jpeg", "eve3.jpeg", "eve4.jpeg"].map((filename, j) => (
                <div
                  key={j}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md border-2 border-[#9D4D38]"
                >
                  <img
                    src={`/${filename}`}
                    alt={`Events Team Member ${j + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

            {team === "Marketing team:" &&
              ["mark1.jpeg", "mark2.jpeg", "mark3.jpeg", "mark4.jpeg"].map((filename, j) => (
                <div
                  key={j}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md border-2 border-[#9D4D38]"
                >
                  <img
                    src={`/${filename}`}
                    alt={`Marketing Team Member ${j + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
      <div className="pb-10 sm:pb-20"></div>
    </div>
  );
}