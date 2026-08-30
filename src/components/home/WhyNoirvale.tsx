const benefits = [
  {
    title: 'Curated Masculine Profiles',
    description: 'Expertly blended notes designed specifically for the modern gentleman seeking sophistication.',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  },
  {
    title: 'WhatsApp-Assisted Ordering',
    description: 'Personalized concierge service to help you select and order your perfect signature scent.',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    title: 'Transparent Details',
    description: 'Full disclosure of fragrance notes, concentration, and performance expectations.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Thoughtful Packaging',
    description: 'Every order arrives in premium packaging, making unboxing a true luxury experience.',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
];

export function WhyNoirvale() {
  return (
    <section className="bg-noir-950 py-20 lg:py-32 border-t border-noir-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-ivory mb-4">Why NOIRVALE</h2>
          <div className="h-px w-24 bg-gold/50 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-noir-900 border border-gold/20 rounded-full text-gold">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={benefit.icon} />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-ivory mb-3">{benefit.title}</h3>
              <p className="text-ivory/60 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}