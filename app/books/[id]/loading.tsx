export default function Loading() {
	return (
		<div className="min-h-screen bg-[#FDE8BE] pb-12 animate-pulse">
			<div className="bg-[#E1B5EE] pt-24 pb-32 px-4 relative">
				<div className="container mx-auto max-w-4xl flex flex-col md:flex-row gap-8 items-center md:items-end">
					<div className="w-48 h-72 md:w-64 md:h-96 flex-shrink-0 rounded-lg bg-[#BA7FCB]"></div>
					<div className="flex-1 w-full space-y-4">
						<div className="h-10 bg-[#BA7FCB] rounded w-3/4 mx-auto md:mx-0"></div>
						<div className="h-6 bg-[#BA7FCB] rounded w-1/2 mx-auto md:mx-0"></div>
						<div className="flex gap-4 justify-center md:justify-start">
							<div className="h-8 bg-[#BA7FCB] rounded-full w-24"></div>
							<div className="h-8 bg-[#BA7FCB] rounded w-32"></div>
						</div>
					</div>
				</div>
			</div>
			<div className="container mx-auto max-w-4xl px-4 -mt-16 relative z-20">
				<div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 h-32">
					<div className="flex flex-wrap gap-4 h-full">
						<div className="flex-1 bg-gray-200 rounded h-10"></div>
						<div className="flex-1 bg-gray-200 rounded h-10"></div>
						<div className="flex-1 bg-gray-200 rounded h-10"></div>
					</div>
				</div>
			</div>
		</div>
	)
}
