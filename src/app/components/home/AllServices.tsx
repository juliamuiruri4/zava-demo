
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import WrenchScrewdriverIcon from '@heroicons/react/24/solid/WrenchScrewdriverIcon';
import ArrowsRightLeftIcon from '@heroicons/react/24/solid/ArrowsRightLeftIcon';
import MapPinIcon from '@heroicons/react/24/solid/MapPinIcon';

const services = [
	{
		title: 'Room Visualization',
		description: 'Visualize your room with new flooring, paint, and decor before you buy.',
		icon: EyeIcon,
		link: '/services/room-visualization',
		cta: 'Try Now',
		accent: 'from-teal-400 to-cyan-500',
	},
	{
		title: 'Book a Service',
		description: 'Schedule installation, painting, or home improvement services with our experts.',
		icon: WrenchScrewdriverIcon,
		link: '/services/book',
		cta: 'Book Service',
		accent: 'from-yellow-400 to-orange-400',
	},
	{
		title: 'Open Days (Trade-ins)',
		description: 'Bring in your used tools and materials for trade-in value during our special open days.',
		icon: ArrowsRightLeftIcon,
		link: '/events/open-days',
		cta: 'See Dates',
		accent: 'from-pink-400 to-fuchsia-500',
	},
	{
		title: 'Service Center Map',
		description: 'Locate service centers for repairs, returns, and support.',
		icon: MapPinIcon,
		link: '/services/map',
		cta: 'View Map',
		accent: 'from-green-400 to-emerald-500',
	},
];

export default function AllServices() {
	return (
		<section className="py-20 bg-gradient-to-b from-gray-50 to-white" id="all-services">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4 drop-shadow-sm">All Services</h2>
					<p className="text-lg text-gray-500 max-w-2xl mx-auto">
						Discover all the ways Zava Retail Store can help you transform your home. Book services, visualize your space, trade-in, and find support—all in one place.
					</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{services.map((service, idx) => {
						const Icon = service.icon;
						return (
							<div
								key={service.title}
								className="flex flex-col items-center bg-white/80 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-7 group border-t-4 border-transparent hover:border-teal-400 relative h-full"
								style={{ zIndex: 1 + idx }}
							>
								<div className={`bg-gradient-to-br ${service.accent} p-1 rounded-full mb-6 shadow-lg w-24 h-24 flex items-center justify-center relative`}>
									<div className="bg-white rounded-full w-20 h-20 flex items-center justify-center overflow-hidden">
										<Icon className="w-12 h-12 text-teal-600 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
									</div>
								</div>
								<h3 className="text-lg font-bold text-gray-900 mb-2 text-center drop-shadow-sm">{service.title}</h3>
								<p className="text-gray-600 mb-5 text-center flex-grow">{service.description}</p>
								<a
									href={service.link}
									className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:from-teal-600 hover:to-cyan-600 transition-colors duration-200 text-center"
								>
									{service.cta}
								</a>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
