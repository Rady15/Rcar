import { db } from "../src/lib/db";

const CARS = [
  { id: "c1", brand: "Tesla", model: "Model S Plaid", year: 2024, pricePerDay: 189, category: "electric", transmission: "automatic", fuelType: "electric", seats: 5, doors: 4, features: '["Autopilot","Premium Sound","Glass Roof","Heated Seats","Sentry Mode"]', rating: 4.9, reviewCount: 312, color: "Pearl White", description: "The Tesla Model S Plaid is the quickest accelerating production car ever made. With tri-motor all-wheel drive, a 0-60 mph time of 1.99 seconds, and over 390 miles of range, it redefines what a sedan can be.", imageUrl: "https://images.unsplash.com/photo-1617704548623-340376564e68?auto=format&fit=crop&w=900&q=80", isFeatured: true, horsePower: 1020, topSpeed: 200, zeroToHundred: 1.99 },
  { id: "c2", brand: "BMW", model: "M4 Competition", year: 2024, pricePerDay: 215, category: "sports", transmission: "automatic", fuelType: "petrol", seats: 4, doors: 2, features: '["M Sport Brakes","Carbon Roof","Harman Kardon","Adaptive M Suspension","Heads-Up Display"]', rating: 4.8, reviewCount: 198, color: "Sao Paulo Yellow", description: "The BMW M4 Competition Coupe delivers an uncompromising blend of track-grade performance and daily usability. A 3.0L twin-turbo inline-six produces 503 hp, sprinting to 60 mph in 3.4 seconds.", imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80", isFeatured: true, horsePower: 503, topSpeed: 180, zeroToHundred: 3.4 },
  { id: "c3", brand: "Mercedes-Benz", model: "G63 AMG", year: 2024, pricePerDay: 295, category: "luxury", transmission: "automatic", fuelType: "petrol", seats: 5, doors: 5, features: '["Burmester Sound","Massage Seats","Night Vision","AMG Ride Control","Nappa Leather"]', rating: 4.9, reviewCount: 156, color: "Obsidian Black", description: "The Mercedes-AMG G63 fuses military-grade off-road capability with the opulence of an S-Class cabin. Its 4.0L V8 biturbo produces 577 hp, launching to 60 mph in 4.4 seconds.", imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80", isFeatured: true, horsePower: 577, topSpeed: 149, zeroToHundred: 4.4 },
  { id: "c4", brand: "Porsche", model: "911 Carrera S", year: 2024, pricePerDay: 320, category: "sports", transmission: "automatic", fuelType: "petrol", seats: 4, doors: 2, features: '["Sport Chrono","PASM","BOSE Sound","Sport Exhaust","Lane Keep Assist"]', rating: 5.0, reviewCount: 274, color: "Guards Red", description: "The Porsche 911 Carrera S is the benchmark every sports car is measured against. A 3.0L twin-turbo flat-six produces 443 hp through the legendary 8-speed PDK, hitting 60 mph in 3.5 seconds.", imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80", isFeatured: true, horsePower: 443, topSpeed: 191, zeroToHundred: 3.5 },
  { id: "c5", brand: "Audi", model: "Q7 Prestige", year: 2024, pricePerDay: 145, category: "suv", transmission: "automatic", fuelType: "hybrid", seats: 7, doors: 5, features: '["Bang & Olufsen","Quattro AWD","Air Suspension","Virtual Cockpit","Panoramic Roof"]', rating: 4.7, reviewCount: 189, color: "Daytona Gray", description: "The Audi Q7 Prestige is the ultimate seven-seat luxury SUV. A mild-hybrid 3.0L V6 delivers 335 hp, while quattro AWD and adaptive air suspension make every journey serene.", imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80", horsePower: 335, topSpeed: 155, zeroToHundred: 5.7 },
  { id: "c6", brand: "Range Rover", model: "Sport Autobiography", year: 2024, pricePerDay: 240, category: "suv", transmission: "automatic", fuelType: "petrol", seats: 5, doors: 5, features: '["Meridian Sound","Air Suspension","Terrain Response 2","Massage Seats","Pano Roof"]', rating: 4.8, reviewCount: 142, color: "Santorini Black", description: "The Range Rover Sport Autobiography combines British luxury with genuine off-road capability. A 4.4L twin-turbo V8 produces 523 hp, launching to 60 mph in 4.3 seconds.", imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80", horsePower: 523, topSpeed: 180, zeroToHundred: 4.3 },
  { id: "c7", brand: "Toyota", model: "Camry XSE", year: 2024, pricePerDay: 65, category: "sedan", transmission: "automatic", fuelType: "hybrid", seats: 5, doors: 4, features: '["JBL Audio","Wireless CarPlay","Heated Seats","Safety Sense 2.5","Sunroof"]', rating: 4.6, reviewCount: 421, color: "Wind Chill Pearl", description: "The Toyota Camry XSE Hybrid offers refined efficiency and reliability at unbeatable value. The 2.5L hybrid powertrain delivers 207 hp with class-leading 51 mpg.", imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3991e90e?auto=format&fit=crop&w=900&q=80", horsePower: 207, topSpeed: 130, zeroToHundred: 7.4 },
  { id: "c8", brand: "Honda", model: "Civic Sport", year: 2024, pricePerDay: 48, category: "sedan", transmission: "manual", fuelType: "petrol", seats: 5, doors: 4, features: '["Apple CarPlay","Honda Sensing","Sunroof","Sport Pedals","Premium Audio"]', rating: 4.5, reviewCount: 538, color: "Sonic Gray", description: "The Honda Civic Sport is the perfect affordable companion for daily commutes and weekend getaways. Its 2.0L engine produces 158 hp with razor-sharp handling and 36 mpg highway.", imageUrl: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=900&q=80", horsePower: 158, topSpeed: 122, zeroToHundred: 8.5 },
  { id: "c9", brand: "Ford", model: "Mustang GT", year: 2024, pricePerDay: 125, category: "sports", transmission: "manual", fuelType: "petrol", seats: 4, doors: 2, features: '["Active Exhaust","Magneride","B&O Audio","Recaro Seats","Track Apps"]', rating: 4.7, reviewCount: 267, color: "Race Red", description: "The Ford Mustang GT is the original American muscle car, now sharper than ever. A 5.0L Coyote V8 roars with 480 hp, paired with a 6-speed manual for purists.", imageUrl: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=900&q=80", horsePower: 480, topSpeed: 163, zeroToHundred: 4.2 },
  { id: "c10", brand: "Lamborghini", model: "Huracán EVO", year: 2024, pricePerDay: 890, category: "luxury", transmission: "automatic", fuelType: "petrol", seats: 2, doors: 2, features: '["LDVI System","Magneto-Rheological","Sensonic Sound","Carbon Ceramic Brakes","Telemetry"]', rating: 5.0, reviewCount: 87, color: "Arancio Borealis", description: "The Lamborghini Huracán EVO is the embodiment of automotive theater. A naturally aspirated 5.2L V10 screams to 8,500 rpm and produces 631 hp, launching to 60 mph in 2.9 seconds.", imageUrl: "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=900&q=80", isFeatured: true, horsePower: 631, topSpeed: 202, zeroToHundred: 2.9 },
  { id: "c11", brand: "Tesla", model: "Model 3 Long Range", year: 2024, pricePerDay: 95, category: "electric", transmission: "automatic", fuelType: "electric", seats: 5, doors: 4, features: '["Autopilot","Premium Audio","Glass Roof","Supercharging","Sentry Mode"]', rating: 4.8, reviewCount: 612, color: "Midnight Silver", description: "The Tesla Model 3 Long Range is the electric sedan that changed the industry. With 358 miles of range, dual-motor AWD, and a 0-60 time of 4.2 seconds.", imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80", horsePower: 358, topSpeed: 145, zeroToHundred: 4.2 },
  { id: "c12", brand: "Mazda", model: "MX-5 Miata RF", year: 2024, pricePerDay: 75, category: "convertible", transmission: "manual", fuelType: "petrol", seats: 2, doors: 2, features: '["Retractable Hardtop","Bose Audio","Sport Mode","BBS Wheels","Recaro Seats"]', rating: 4.9, reviewCount: 342, color: "Soul Red Crystal", description: "The Mazda MX-5 Miata RF proves that driving joy isn't about horsepower — it's about connection. A 2.0L engine produces 181 hp with a perfect 50:50 weight balance.", imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80", horsePower: 181, topSpeed: 136, zeroToHundred: 6.5 },
  { id: "c13", brand: "Hyundai", model: "Ioniq 5", year: 2024, pricePerDay: 89, category: "electric", transmission: "automatic", fuelType: "electric", seats: 5, doors: 5, features: '["V2L Power","Highway Assist","Bose Audio","Solar Roof","Augmented Reality HUD"]', rating: 4.7, reviewCount: 234, color: "Cyber Gray", description: "The Hyundai Ioniq 5 is a retro-futuristic electric crossover. Its 800-volt architecture charges from 10% to 80% in just 18 minutes.", imageUrl: "https://images.unsplash.com/photo-1664478546384-d57e49a55cd1?auto=format&fit=crop&w=900&q=80", horsePower: 320, topSpeed: 160, zeroToHundred: 4.4 },
  { id: "c14", brand: "Mercedes-Benz", model: "S500 4MATIC", year: 2024, pricePerDay: 280, category: "luxury", transmission: "automatic", fuelType: "hybrid", seats: 5, doors: 4, features: '["MBUX","Burmester 4D","Rear Axle Steer","E-Active Body","Massage Seats"]', rating: 4.9, reviewCount: 118, color: "Diamond White", description: "The Mercedes-Benz S500 4MATIC is the benchmark of the luxury sedan. A 3.0L inline-six with EQ Boost produces 429 hp, while E-Active Body Control scans the road ahead.", imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40656699?auto=format&fit=crop&w=900&q=80", horsePower: 429, topSpeed: 155, zeroToHundred: 4.8 },
  { id: "c15", brand: "Audi", model: "R8 V10 Performance", year: 2024, pricePerDay: 750, category: "sports", transmission: "automatic", fuelType: "petrol", seats: 2, doors: 2, features: '["Quattro AWD","Carbon Ceramic","Bang & Olufsen","Magnetic Ride","Sport Exhaust"]', rating: 5.0, reviewCount: 64, color: "Kemora Gray", description: "The Audi R8 V10 Performance is the last of the naturally aspirated supercars. A 5.2L V10 produces 602 hp and screams to 8,700 rpm, launching to 60 mph in 3.2 seconds.", imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80", horsePower: 602, topSpeed: 205, zeroToHundred: 3.2 },
  { id: "c16", brand: "Toyota", model: "Sienna Platinum", year: 2024, pricePerDay: 110, category: "van", transmission: "automatic", fuelType: "hybrid", seats: 8, doors: 5, features: '["Super Long Slide","JBL Audio","Hands-Free Power Doors","Bird\'s Eye View","Vacuum"]', rating: 4.6, reviewCount: 198, color: "Pearl White", description: "The Toyota Sienna Platinum is the only hybrid minivan on the market, delivering 36 mpg with room for eight. Captain's chairs offer limousine legroom.", imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80", horsePower: 245, topSpeed: 120, zeroToHundred: 7.7 },
  { id: "c17", brand: "Volkswagen", model: "Golf GTI", year: 2024, pricePerDay: 70, category: "sedan", transmission: "manual", fuelType: "petrol", seats: 5, doors: 5, features: '["Harman Kardon","Digital Cockpit","DCC Suspension","Sport Seats","Wireless CarPlay"]', rating: 4.7, reviewCount: 289, color: "Tornado Red", description: "The Volkswagen Golf GTI invented the hot hatch segment. A 2.0L turbocharged engine produces 241 hp through a 6-speed manual.", imageUrl: "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?auto=format&fit=crop&w=900&q=80", horsePower: 241, topSpeed: 155, zeroToHundred: 5.9 },
  { id: "c18", brand: "Chevrolet", model: "Tahoe Premier", year: 2024, pricePerDay: 135, category: "suv", transmission: "automatic", fuelType: "petrol", seats: 8, doors: 5, features: '["Bose 10-Speaker","Magnetic Ride","Air Suspension","Super Cruise","Power Steps"]', rating: 4.6, reviewCount: 178, color: "Summit White", description: "The Chevrolet Tahoe Premier is a full-size SUV that seats up to eight in first-class comfort. A 6.2L V8 produces 420 hp with a 10-speed automatic and 4WD.", imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80", horsePower: 420, topSpeed: 130, zeroToHundred: 5.9 },
];

const DEALS = [
  { id: "d1", title: "Weekend Flash Sale", description: "Get 25% off all weekend rentals of the Tesla Model 3 Long Range. Free Supercharging included.", discountLabel: "25% OFF", discountPercent: 25, carId: "c11", promoCode: "WEEKEND25", endDate: new Date(Date.now() + 38 * 3600 * 1000) },
  { id: "d2", title: "Luxury Upgrade", description: "Upgrade to the Mercedes-Benz S500 4MATIC for the price of an E-Class. Free chauffeur for 2 hours.", discountLabel: "40% OFF", discountPercent: 40, carId: "c14", promoCode: "LUXURY40", endDate: new Date(Date.now() + 3 * 24 * 3600 * 1000 + 12 * 3600 * 1000) },
  { id: "d3", title: "Electric Adventure", description: "Try the Hyundai Ioniq 5 for 7 days and pay for only 5. Free V2L charging cable included.", discountLabel: "28% OFF", discountPercent: 28, carId: "c13", promoCode: "ELECTRIC7", endDate: new Date(Date.now() + 5 * 24 * 3600 * 1000) },
  { id: "d4", title: "Sports Car Thrill", description: "Rent the Ford Mustang GT for 3 days and get unlimited miles plus a complimentary track day.", discountLabel: "20% OFF", discountPercent: 20, carId: "c9", promoCode: "MUSCLE20", endDate: new Date(Date.now() + 2 * 24 * 3600 * 1000 + 6 * 3600 * 1000) },
];

const REVIEWS = [
  { userId: "u2", carId: "c1", rating: 5, comment: "Absolutely mind-blowing acceleration. Plaid mode pins you to the seat like nothing else. Autopilot worked flawlessly on my LA to SF trip.", tripType: "Road trip", helpfulCount: 42 },
  { userId: "u3", carId: "c1", rating: 5, comment: "Rented for a weekend getaway. Glass roof makes the cabin feel huge, sound system is the best I've heard.", tripType: "Weekend", helpfulCount: 28 },
  { userId: "u4", carId: "c2", rating: 5, comment: "The M4 is a masterpiece. The exhaust note alone is worth the rental. Manual gearbox is buttery smooth.", tripType: "Weekend", helpfulCount: 51 },
  { userId: "u5", carId: "c4", rating: 5, comment: "A 911 is a 911 for a reason. The precision, the feedback, the sound — everything is calibrated to perfection.", tripType: "Weekend", helpfulCount: 73 },
  { userId: "u3", carId: "c10", rating: 5, comment: "The Huracán EVO is a theatrical experience. The V10 sound at 8,500 RPM is something you never forget.", tripType: "Weekend", helpfulCount: 92 },
  { userId: "u6", carId: "c11", rating: 5, comment: "The Model 3 is the best daily rental. Quick, quiet, frugal, and the Supercharger network means no range anxiety.", tripType: "Business", helpfulCount: 67 },
  { userId: "u2", carId: "c7", rating: 5, comment: "Reliable, efficient, comfortable. The Camry Hybrid is the smart rental. 50+ mpg on a road trip meant one fill-up for the whole week.", tripType: "Road trip", helpfulCount: 58 },
  { userId: "u4", carId: "c9", rating: 5, comment: "The Coyote V8 is pure American theater. Active exhaust in Track mode is glorious. Did a burnout that impressed my whole neighborhood.", tripType: "Weekend", helpfulCount: 81 },
];

const BOOKINGS = [
  { id: "b1", userId: "u2", carId: "c1", pickupDate: new Date(Date.now() + 7 * 86400000), returnDate: new Date(Date.now() + 10 * 86400000), pickupLocation: "New York Downtown", returnLocation: "New York Downtown", daysCount: 3, pricePerDay: 189, subtotal: 567, insuranceFee: 36, serviceFee: 48.24, total: 651.24, status: "UPCOMING", bookingCode: "RD100001", extras: '["gps","unlimited_miles"]', paymentMethod: "card", paymentStatus: "PAID" },
  { id: "b2", userId: "u3", carId: "c4", pickupDate: new Date(Date.now() + 14 * 86400000), returnDate: new Date(Date.now() + 17 * 86400000), pickupLocation: "JFK International Airport", returnLocation: "JFK International Airport", daysCount: 3, pricePerDay: 320, subtotal: 960, insuranceFee: 36, serviceFee: 79.68, total: 1075.68, status: "UPCOMING", bookingCode: "RD100002", extras: '["insurance"]', paymentMethod: "card", paymentStatus: "PAID" },
  { id: "b3", userId: "u4", carId: "c9", pickupDate: new Date(Date.now() - 14 * 86400000), returnDate: new Date(Date.now() - 11 * 86400000), pickupLocation: "Times Square Hub", returnLocation: "Times Square Hub", daysCount: 3, pricePerDay: 125, subtotal: 375, insuranceFee: 36, serviceFee: 32.88, total: 443.88, status: "COMPLETED", bookingCode: "RD100003", extras: '["unlimited_miles"]', paymentMethod: "paypal", paymentStatus: "PAID" },
  { id: "b4", userId: "u5", carId: "c7", pickupDate: new Date(Date.now() - 30 * 86400000), returnDate: new Date(Date.now() - 23 * 86400000), pickupLocation: "Brooklyn Heights", returnLocation: "LaGuardia Airport", daysCount: 7, pricePerDay: 65, subtotal: 455, insuranceFee: 84, serviceFee: 43.12, total: 582.12, status: "COMPLETED", bookingCode: "RD100004", extras: '["child_seat","gps"]', paymentMethod: "card", paymentStatus: "PAID" },
  { id: "b5", userId: "u6", carId: "c11", pickupDate: new Date(Date.now() - 5 * 86400000), returnDate: new Date(Date.now() - 2 * 86400000), pickupLocation: "Newark Liberty Airport", returnLocation: "Newark Liberty Airport", daysCount: 3, pricePerDay: 95, subtotal: 285, insuranceFee: 36, serviceFee: 25.68, total: 346.68, status: "COMPLETED", bookingCode: "RD100005", extras: '["insurance"]', paymentMethod: "apple", paymentStatus: "PAID" },
  { id: "b6", userId: "u2", carId: "c5", pickupDate: new Date(Date.now() - 60 * 86400000), returnDate: new Date(Date.now() - 53 * 86400000), pickupLocation: "New York Downtown", returnLocation: "New York Downtown", daysCount: 7, pricePerDay: 145, subtotal: 1015, insuranceFee: 84, serviceFee: 87.92, total: 1186.92, status: "COMPLETED", bookingCode: "RD100006", extras: '["child_seat","additional_driver"]', paymentMethod: "card", paymentStatus: "PAID" },
];

const HERO = { badge: "18+ cars available right now", title: "Drive your", highlightedWord: "dream car,", italicWord: "today.", subtitle: "From fuel-sipping hybrids to roaring supercars. Book in under 60 seconds with free cancellation up to 24h before pickup.", primaryBtn: "Browse cars", secondaryBtn: "View deals", imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80", scrollHint: "Scroll to explore", showBadges: true, signInLabel: "Already a member?", adminLabel: "Admin panel" };
const STATS = [
  { icon: "car", value: "18+", label: "Premium cars" },
  { icon: "calendar", value: "6,400+", label: "Trips completed" },
  { icon: "star", value: "4.9★", label: "Average rating" },
  { icon: "shield", value: "24/7", label: "Roadside help" },
];
const HOW = [
  { step: "01", title: "Pick your car", desc: "Browse 18+ hand-picked cars — from hybrids to supercars. Filter by category, price, and features in seconds.", icon: "search" },
  { step: "02", title: "Choose dates & extras", desc: "Select pickup and return dates, choose insurance, add child seats, GPS, or unlimited miles. Pricing updates live.", icon: "calendar" },
  { step: "03", title: "Pay securely", desc: "Lock in your booking with card, Apple Pay, or PayPal. Free cancellation up to 24h before pickup. No surprises.", icon: "shield" },
  { step: "04", title: "Hit the road", desc: "Show your license at pickup, grab the keys, and drive. Return the car at any of our 6 NYC locations.", icon: "zap" },
];
const TESTIMONIALS = [
  { name: "Michael Chen", role: "Verified Renter", rating: 5, text: "Picked up a Tesla Model S Plaid for a weekend trip. The booking took 45 seconds and the car was immaculate. This is how car rental should work.", initials: "MC" },
  { name: "Sarah Kowalski", role: "Weekend Explorer", rating: 5, text: "Rented the BMW M4 for a canyon run. The team delivered the car to my hotel — zero paperwork, just a key handoff. Mind-blowing service.", initials: "SK" },
  { name: "James Whitfield", role: "Business Traveler", rating: 5, text: "I rent cars weekly for client meetings. RentDrive's fleet is newer, prices are lower, and the app actually works. Switched from the big chains.", initials: "JW" },
];
const FINAL_CTA = { title: "Ready to hit the road?", subtitle: "Join thousands of happy renters. Sign up in 30 seconds and book your first car today.", primaryBtn: "Get started", secondaryBtn: "Browse cars", adminLabel: "Admin?" };
const FOOTER = { tagline: "Premium car rentals, on demand. From economy hybrids to supercars, find your perfect ride.", phone: "+1 (555) 010-2024", email: "support@rentdrive.app", address: "350 5th Ave, New York", copyright: "© 2024 RentDrive Inc. All rights reserved." };
const BRANDING = { siteName: "RentDrive", logoEmoji: "🚗", logoUrl: "", accentColor: "#d97706" };
const SEO = { title: "RentDrive — Premium Car Rental Platform", description: "Rent luxury, sports, electric and family cars by the day. Full customer booking platform + admin panel.", keywords: "car rental, luxury cars, sports cars, electric cars, NYC car rental, rent a car", ogImageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80", twitterHandle: "@rentdrive" };

async function main() {
  console.log("Seeding database...");

  // Users
  await db.user.upsert({ where: { email: "admin@rentdrive.app" }, update: {}, create: { id: "u1", email: "admin@rentdrive.app", name: "Admin User", phone: "+1 555 0001", password: "admin123", role: "ADMIN" } });
  for (const c of [
    { id: "u2", email: "michael@example.com", name: "Michael Chen", phone: "+1 555 0101", password: "demo123" },
    { id: "u3", email: "sarah@example.com", name: "Sarah Kowalski", phone: "+1 555 0102", password: "demo123" },
    { id: "u4", email: "james@example.com", name: "James Whitfield", phone: "+1 555 0103", password: "demo123" },
    { id: "u5", email: "nora@example.com", name: "Nora Sundqvist", phone: "+1 555 0104", password: "demo123" },
    { id: "u6", email: "daniel@example.com", name: "Daniel Wu", phone: "+1 555 0105", password: "demo123" },
  ]) {
    await db.user.upsert({ where: { email: c.email }, update: {}, create: { ...c, role: "CUSTOMER" } });
  }
  console.log("Seeded users");

  for (const car of CARS) await db.car.upsert({ where: { id: car.id }, update: {}, create: car });
  console.log(`Seeded ${CARS.length} cars`);

  for (const d of DEALS) await db.deal.upsert({ where: { id: d.id }, update: {}, create: d });
  console.log(`Seeded ${DEALS.length} deals`);

  for (const r of REVIEWS) {
    const existing = await db.review.findFirst({ where: { userId: r.userId, carId: r.carId } });
    if (!existing) await db.review.create({ data: r });
  }
  console.log(`Seeded ${REVIEWS.length} reviews`);

  for (const b of BOOKINGS) await db.booking.upsert({ where: { id: b.id }, update: {}, create: b });
  console.log(`Seeded ${BOOKINGS.length} bookings`);

  // Site content
  await db.siteContent.upsert({
    where: { id: "singleton" },
    update: {
      hero: JSON.stringify(HERO),
      stats: JSON.stringify(STATS),
      howItWorks: JSON.stringify(HOW),
      testimonials: JSON.stringify(TESTIMONIALS),
      finalCta: JSON.stringify(FINAL_CTA),
      footer: JSON.stringify(FOOTER),
      branding: JSON.stringify(BRANDING),
      seo: JSON.stringify(SEO),
    },
    create: {
      id: "singleton",
      hero: JSON.stringify(HERO),
      stats: JSON.stringify(STATS),
      howItWorks: JSON.stringify(HOW),
      testimonials: JSON.stringify(TESTIMONIALS),
      finalCta: JSON.stringify(FINAL_CTA),
      footer: JSON.stringify(FOOTER),
      branding: JSON.stringify(BRANDING),
      seo: JSON.stringify(SEO),
    },
  });
  console.log("Seeded site content");

  console.log("\n✅ Database seeded!");
  console.log("Login credentials:");
  console.log("  Admin:    admin@rentdrive.app / admin123");
  console.log("  Customer: michael@example.com / demo123");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await db.$disconnect(); });
