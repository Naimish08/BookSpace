export default function ClubLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-12 w-64 bg-gray-200 animate-pulse rounded mb-8"></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4 space-y-6">
          <div className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>
          <div className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>
          <div className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>
        </div>
        <div className="w-full lg:w-1/4 space-y-6">
          <div className="h-96 bg-gray-200 animate-pulse rounded-xl"></div>
        </div>
      </div>
    </div>
  )
}
