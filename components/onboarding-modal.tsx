"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Confetti from "react-confetti"

const questions = [
    {
        step: 1,
        title: "What are you interested in?",
        options: [
            "Reading Buddies",
            "Book Recommendations",
            "Reading Habit",
            "Reading Challenges",
            "Book Discussions",
            "Writing Contests",
            "Offline Events",
            "Others",
        ],
    },
    {
        step: 2,
        title: "Genres you're interested in",
        options: [
            "Self-Help",
            "Finance/ Entrepreneurship",
            "Mystery/Thriller",
            "Romance/Young Adult",
            "Sci-Fi",
            "Fantasy",
            "Classics",
            "Philosophy",
            "Biographies/ Autobio",
            "Mythology",
            "Spirituality",
            "Others",
        ],
    },
    {
        step: 3,
        title: "How many books would you like to read this year?",
        subfields: [
            { name: "fiction", label: "Fiction Books", placeholder: "e.g. 12" },
            { name: "nonFiction", label: "Non-Fiction Books", placeholder: "e.g. 8" },
        ],
    },
    {
        step: 4,
        title: "How much time can you dedicate to reading daily?",
        options: ["15 mins", "30 mins", "45 mins", "60 mins", "90+ mins"],
    },
    {
        step: 5,
        title: "What's your preferred reading time?",
        options: ["Morning", "Afternoon", "Evening", "Night", "Flexible"],
    },
]

interface OnboardingModalProps {
    isOpen: boolean
    onClose: () => void
    onComplete: (answers: any) => void
}

export function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [showConfetti, setShowConfetti] = useState(false)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        if (typeof window !== "undefined") {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }
    }, [])

    const handleNext = () => {
        if (currentStep < questions.length) {
            setCurrentStep((prev) => prev + 1)
        } else {
            setShowConfetti(true)
        }
    }

    const handleOptionClick = (option: string) => {
        if (currentStep === 1 || currentStep === 2) {
            setAnswers((prev) => {
                const currentSelections = (prev[`step${currentStep}`] || []) as string[]
                const newSelections = currentSelections.includes(option)
                    ? currentSelections.filter((item) => item !== option)
                    : [...currentSelections, option]
                return {
                    ...prev,
                    [`step${currentStep}`]: newSelections,
                }
            })
        } else {
            setAnswers((prev) => ({
                ...prev,
                [`step${currentStep}`]: option,
            }))
            handleNext()
        }
    }

    const handleInputBlur = (fieldName: string, value: string) => {
        setAnswers((prev) => ({
            ...prev,
            [`step${currentStep}_${fieldName}`]: value,
        }))
    }

    if (!isOpen) return null

    const currentQuestion = questions.find((q) => q.step === currentStep)

    const isNextButtonDisabled = (currentStep === 1 || currentStep === 2) && (!answers[`step${currentStep}`] || answers[`step${currentStep}`].length === 0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            {showConfetti && (
                <Confetti
                    width={dimensions.width}
                    height={dimensions.height}
                    recycle={false}
                    numberOfPieces={200}
                />
            )}

            <div className="bg-[#AC6F59] text-white rounded-xl max-w-2xl w-full mx-4 p-6 relative">
                {showConfetti ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-8"
                    >
                        <h2 className="text-3xl font-caveat text-[#FDE8BE] mb-4">
                            All Set! 🎉
                        </h2>
                        <p className="text-white text-lg mb-4">
                            Thank you for personalizing your reading journey with us!
                        </p>
                        <p className="text-white/80 text-sm mb-6">
                            Get ready for an amazing reading adventure!
                        </p>
                        <button
                            onClick={() => {
                                setShowConfetti(false)
                                onComplete(answers)
                            }}
                            className="bg-white text-[#AC6F59] px-6 py-2 rounded-full text-sm font-semibold hover:bg-white/90 transition"
                        >
                            Start Exploring
                        </button>
                    </motion.div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
    <button
        onClick={onClose}
        className="text-sm text-white/80 hover:text-white px-4 py-1 rounded-full border border-white/20 transition"
    >
        Skip
    </button>
    <h2 className="text-2xl font-bold text-center flex-1">
        Personalize your Reading Goals
    </h2>
    {currentStep > 1 && !showConfetti ? (
        <button
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="text-sm px-4 py-1 rounded-full bg-[#462C90] text-white hover:bg-[#3b2479] transition"
        >
            Back
        </button>
    ) : (
        // Empty div for spacing when Back is hidden
        <div className="w-[64px]"></div>
    )}
</div>


                        <div className="mb-4">
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div
                                    className="bg-white h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(currentStep / questions.length) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-200 mt-2">
                                Step {currentStep} of {questions.length}
                            </p>
                        </div>

                        <h3 className="text-xl mb-4 font-caveat text-[#FDE8BE]">
                            {currentQuestion?.title}
                        </h3>

                        {currentQuestion?.options ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {currentQuestion.options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleOptionClick(option)}
                                        className={`rounded-lg p-3 text-center transition-colors
                                            // Apply Merriweather italic bold and a larger font size for steps 1 and 2
                                            ${(currentStep === 1 || currentStep === 2) ? "font-merriweather italic font-bold text-base" : "text-sm"}
                                            // Apply the new selected background color
                                            ${(currentStep === 1 || currentStep === 2) && (answers[`step${currentStep}`] || []).includes(option)
                                                ? "bg-[#462C90] text-white border-2 border-white"
                                                : "bg-white/10 hover:bg-white/20 text-white border-2 border-transparent"
                                            }
                                        `}
                                    >
                                        {option}
                                    </button>
                                ))}
                                {(currentStep === 1 || currentStep === 2) && (
                                    <button
                                        onClick={handleNext}
                                        disabled={isNextButtonDisabled}
                                        className={`col-span-2 md:col-span-4 w-full rounded-lg py-2 mt-4 transition-colors ${
                                            isNextButtonDisabled ? "bg-white/30 text-gray-400 cursor-not-allowed" : "bg-white text-[#AC6F59] hover:bg-white/90"
                                        }`}
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        ) : currentQuestion?.subfields ? (
                            <div className="space-y-4 mb-6">
                                {currentQuestion.subfields.map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium mb-2 text-white">
                                            {field.label}
                                        </label>
                                        <input
                                            type="number"
                                            placeholder={field.placeholder}
                                            className="w-full p-2 border rounded bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                                            onBlur={(e) => handleInputBlur(field.name, e.target.value)}
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={handleNext}
                                    className="w-full bg-white text-[#AC6F59] rounded-lg py-2 mt-4 hover:bg-white/90 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        ) : null}
                    </>
                )}
            </div>
        </motion.div>
    )
}