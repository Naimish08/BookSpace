export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-[#462C90] border-t-[#E1B5EE] rounded-full animate-spin"></div>
        <h2 className="text-2xl font-bold text-[#462C90] font-playfair animate-pulse">BookSpace</h2>
        <p className="text-[#BA7FCB] font-poppins">Loading your books...</p>
      </div>
    </div>
  )
}
