import type { Metadata } from 'next';
import FadeIn from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Explore Open Engineering products — BhumiCare, Acc2Not, Smart Home Automation, Smart AI Health Monitoring Band, and Next Gen Smart Vehicle Engines.',
};

const products = [
  {
    id: 'bhumicare',
    title: 'BhumiCare',
    category: 'Agri-Tech Innovation & Soil AI',
    desc: 'BhumiCare is an agri-tech innovation focused on improving soil health assessment and crop decision-making for farmers across India. It eliminates long delays and accessibility issues associated with traditional soil testing labs by providing a real-time, affordable, and easy-to-use soil health monitoring solution using sensor-based data collection with AI/ML-driven analysis delivered in regional languages.',
    status: 'live' as const,
    link: 'https://bhumicare.vercel.app',
    linkText: 'bhumicare.vercel.app ↗',
    image: '/images/products/bhumicare.png',
    features: [
      'Sensor-based Data Collection',
      'AI/ML-Driven Soil Analysis',
      'Regional Mobile App Interface',
      'Real-time Crop Decision Insights',
    ],
  },
  {
    id: 'acc2not',
    title: 'Acc2Not',
    category: 'IoT & Vehicle Safety Platform',
    desc: 'Acc2Not provides an IoT-based accident detection and emergency alert system installed inside vehicles. The device continuously monitors vehicle motion, speed, impact, and orientation using onboard sensors. When a potential accident is detected, it automatically retrieves the vehicle’s GPS location and instantly sends alerts to nearby hospitals, police stations, and emergency responders through a secure network.',
    status: 'ongoing' as const,
    link: 'https://acc2not.vercel.app',
    linkText: 'acc2not.vercel.app ↗',
    image: '/images/products/acc2not.png',
    features: [
      'IoT Motion & Impact Sensors',
      'Automatic GPS Location Dispatch',
      'Hospital & Emergency Alert Network',
      'Scalable Road Safety Platform',
    ],
  },
  {
    id: 'home-automation',
    title: 'Smart Home Automation',
    category: 'IoT Hardware & Smart Buildings',
    desc: 'Building next-generation intelligent hardware modules and IoT devices for complete home automation, remote appliance control, smart lighting, and energy optimization.',
    status: 'ongoing' as const,
    link: null,
    linkText: null,
    image: '/images/products/home-automation.png',
    features: [
      'Smart IoT Hardware Modules',
      'Remote Appliance Control',
      'Intelligent Energy Optimization',
    ],
  },
  {
    id: 'smart-engine',
    title: 'Next Gen Smart Vehicle Engine',
    category: 'Clean Tech & Powertrain Engineering',
    desc: 'Researching and engineering eco-friendly, high-efficiency vehicle powertrains — Electric engines, 100% Ethanol-fueled engines, and advanced Hydrogen combustion technology.',
    status: 'ongoing' as const,
    link: null,
    linkText: null,
    image: '/images/products/smart-engine.png',
    features: [
      'Electric Powertrain Architecture',
      '100% Ethanol Engine Technology',
      'Hydrogen Energy Combustion',
    ],
  },
  {
    id: 'health-band',
    title: 'Smart AI Health Monitoring Band',
    category: 'AI Wearable & Health-Tech',
    desc: 'A next-generation AI-powered health monitoring wristband designed for everyone. Pair it with your smartphone to continuously track vital health metrics — heart rate, SpO2, sleep patterns, stress levels, and activity data. The band uses on-device machine learning to learn your unique health baseline, detect anomalies early, and provide personalized wellness recommendations. Train your health data right from your phone and let the AI coach you toward better habits, every day.',
    status: 'ongoing' as const,
    link: null,
    linkText: null,
    image: '/images/products/health-band.jpg',
    features: [
      'AI-Powered Health Baseline Learning',
      'Real-Time Heart Rate & SpO2 Monitoring',
      'Phone-Synced Personal Health Training',
      'Smart Anomaly Detection & Wellness Coaching',
    ],
  },
];

export default function ProductsPage() {
  return (
    <>
      <section className="section pt-36 pb-16">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <span className="badge badge-primary mb-4">Our Products</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Innovative Engineering <span className="gradient-text">Products</span>
            </h1>
            <p className="text-text-muted text-lg leading-relaxed font-normal">
              From agri-tech soil monitoring to IoT vehicle safety systems, clean tech engines, and home automation — 
              we build hardware and software products that solve real-world problems.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-sm pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {products.map((product, index) => (
              <FadeIn key={product.id} delay={index * 0.12}>
                <div className="neu-card p-6 sm:p-8 h-full flex flex-col justify-between relative overflow-hidden group">
                  <div>
                    {/* 3D Neumorphic Product Showcase Image Frame */}
                    <div className="neu-pressed overflow-hidden rounded-2xl h-60 sm:h-72 mb-6 relative border border-purple-300/40 shadow-[inset_4px_4px_10px_rgba(147,51,234,0.12),inset_-4px_-4px_10px_#ffffff]">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 z-10">
                        {product.status === 'live' ? (
                          <span className="badge badge-success shadow-md">● Live Website</span>
                        ) : (
                          <span className="badge badge-warning shadow-md">⚡ Ongoing Project</span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                      {product.category}
                    </p>
                    <h2 className="text-2xl font-extrabold mb-3 text-text">{product.title}</h2>
                    <p className="text-text-muted text-sm leading-relaxed mb-6 font-normal">
                      {product.desc}
                    </p>

                    <div className="space-y-2 mb-8">
                      {product.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2.5 text-xs font-semibold text-text-muted">
                          <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {product.link && (
                    <div className="pt-4 border-t border-purple-200/40">
                      <a
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white inline-flex items-center justify-center gap-2 text-xs font-bold w-full sm:w-auto shadow-md transition-all"
                      >
                        <span>Visit {product.linkText}</span>
                      </a>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
