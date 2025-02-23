const stemFacts: string[] = [
	// Biology & Anatomy
	"Octopuses have three hearts: two pump blood to the gills, and one pumps it to the rest of the body.",
	"Strawberries aren't berries, but bananas are botanically classified as berries.",
	"The human nose can detect approximately 1 trillion different scents.",
	"Blue whale hearts can weigh over 1,300 pounds and are roughly the size of a small car.",
	"Some species of sharks are older than trees, existing for about 400 million years.",
	"The Turritopsis dohrnii jellyfish can revert to its juvenile form, essentially making it biologically immortal.",
	"Your gut microbiome contains more bacteria than there are stars in the Milky Way galaxy.",
	"A single strand of DNA from one human cell would be approximately 2 meters long if stretched out.",

	// Chemistry
	"Honey never spoils due to its low moisture content and acidic pH, creating an inhospitable environment for bacteria.",
	"Water expands by about 9% when it freezes, which is why ice floats.",
	"The smell of rain (petrichor) comes from geosmin, a chemical compound produced by soil-dwelling bacteria.",
	"Diamonds and graphite are both made of pure carbon, arranged in different crystal structures.",
	"Helium becomes a superfluid at temperatures near absolute zero, allowing it to flow without friction.",
	"The hottest natural temperature ever recorded on Earth was 3.6 billion°F in a quark-gluon plasma created at CERN.",

	// Physics & Astronomy
	"Neutron stars can spin up to 600 times per second immediately after their formation.",
	"A teaspoon of neutron star material would weigh about 10 million tons.",
	"Venus has a day longer than its year: 243 Earth days to rotate vs. 225 days to orbit the Sun.",
	"If two pieces of the same metal touch in space, they'll permanently bond together through cold welding.",
	"Light takes approximately 8 minutes and 20 seconds to travel from the Sun to Earth.",
	"Quantum entanglement allows particles to instantly influence each other's states regardless of distance.",

	// Earth Science
	"Antarctica's Dry Valleys haven't seen rain in nearly 2 million years.",
	"The Earth's inner core spins faster than the rest of the planet, gaining about 0.3-0.5 degrees per year.",
	"There's enough gold in Earth's core to coat the entire surface in 1.5 feet of the precious metal.",
	"Lightning strikes produce antimatter through terrestrial gamma-ray flashes.",
	"The largest single crystal ever found was a beryl from Madagascar, measuring 18 m long and 3.5 m wide.",

	// Technology
	"The first computer virus ('Creeper') was created in 1971 and simply displayed 'I'M THE CREEPER: CATCH ME IF YOU CAN'.",
	"QR codes can store up to 7,089 numeric characters or 4,296 alphanumeric characters.",
	"5G networks use millimeter waves that are shorter than radio waves used in previous cellular networks.",
	"The Apollo Guidance Computer had just 64KB of memory and operated at 0.043 MHz.",
	"Bitcoin's blockchain is estimated to consume more energy annually than some small countries.",

	// Engineering
	"The Burj Khalifa's foundation uses 192 piles extending more than 50 meters into the ground.",
	"3D-printed houses can be constructed in under 24 hours using specialized concrete printers.",
	"The Large Hadron Collider uses superconducting magnets cooled to -271.3°C, colder than outer space.",
	"China's high-speed rail network is longer than the rest of the world's combined.",
	"The Golden Gate Bridge contains enough steel wire in its cables to circle the Earth three times.",

	// Mathematics
	"The number 0.999... (repeating) is exactly equal to 1 in mathematics.",
	"There are 80,000,000,000,000,000,000,000,000 possible ways to play the first four moves in chess.",
	"A sphere's surface area is exactly 4 times the area of its shadow (a circle of the same radius).",
	"The Fibonacci sequence appears in sunflower seed arrangements and nautilus shell spirals.",
	"If you shuffle a deck of cards properly, you've likely created an order that's never existed before in history.",

	// Space Exploration
	"Voyager 1 carries a gold-plated copper disk containing sounds and images of Earth.",
	"Space suits have 14 layers of material to protect astronauts from extreme temperatures.",
	"The International Space Station travels at 17,500 mph, orbiting Earth every 90 minutes.",
	"Mars has blue sunsets due to fine dust particles in its atmosphere scattering shorter wavelengths.",
	"Jupiter's magnetic field is 20,000 times stronger than Earth's.",

	// Computer Science
	"The first webcam monitored a coffee pot at Cambridge University computer labs.",
	"CAPTCHA stands for 'Completely Automated Public Turing test to tell Computers and Humans Apart'.",
	"The world's first 1TB microSD card can store approximately 500 hours of HD video.",
	"Nintendo was founded in 1889 as a playing card company before entering video games.",
	"Google processes over 8.5 billion searches per day - more than the number of people on Earth.",

	// Materials Science
	"Graphene is 200 times stronger than steel but flexible and transparent.",
	"Metamaterials can bend light around objects, creating practical invisibility cloaks.",
	"Bulk metallic glass is twice as strong as titanium while maintaining plastic-like moldability.",
	"Aerogel, the lightest solid material, is 99.8% air and can support 4,000 times its own weight.",
	"Shape-memory alloys can 'remember' their original form and return to it when heated.",

	// Neuroscience
	"The human brain generates about 20 watts of electrical power - enough to dimly light a bulb.",
	"Your brain's storage capacity is estimated at 2.5 petabytes (2.5 million gigabytes).",
	"Déjà vu may be caused by a momentary mismatch in brain memory processing pathways.",
	"The cerebellum contains nearly 80% of all neurons in the human body.",
	"Brain-computer interfaces can now translate neural activity into text with 90% accuracy.",

	// Environmental Science
	"Coral reefs support 25% of marine life while covering less than 1% of the ocean floor.",
	"A single mature oak tree can transpire over 40,000 gallons of water per year.",
	"Permafrost contains nearly twice as much carbon as Earth's atmosphere.",
	"The Great Barrier Reef is visible from space and larger than 70 million football fields.",
	"Desert locust swarms can cover 460 square miles and consume 423 million pounds of plants daily.",

	// Robotics & AI
	"Boston Dynamics' Atlas robot can perform backflips and complex parkour maneuvers.",
	"Neural networks now exceed human performance in specific image recognition tasks.",
	"Self-healing robots use liquid metal circuits that can repair broken connections.",
	"AI can predict earthquakes by analyzing subtle ground motion patterns from satellite data.",
	"Swarm robotics uses collective behavior algorithms inspired by insects and birds.",

	// Quantum Physics
	"Quantum superposition allows particles to exist in multiple states simultaneously.",
	"Quantum tunneling enables particles to pass through seemingly impenetrable barriers.",
	"The universe's quantum foam predicts virtual particles constantly blinking in and out of existence.",
	"Quantum entanglement distribution has been achieved over 1,200 kilometers via satellite.",
	"Quantum computers use qubits that can represent 0, 1, or both states simultaneously.",

	// Paleontology
	"T. rex had serrated teeth that could slice through bone with 12,800 newtons of bite force.",
	"Some dinosaurs had feathers long before birds evolved, as seen in fossilized impressions.",
	"The largest dinosaur eggs ever found are about the size of basketballs.",
	"Amber preserves ancient organisms so well that scientists can extract DNA from million-year-old samples.",
	"Trilobites developed complex compound eyes with calcite lenses over 500 million years ago.",

	// Genetics
	"Human DNA shares 50-60% similarity with banana DNA.",
	"Epigenetic changes can alter gene expression without changing the underlying DNA sequence.",
	"CRISPR gene editing uses a bacterial defense system against viruses.",
	"The human genome contains about 20,000 genes but produces over 100,000 proteins through alternative splicing.",
	"Telomeres protect chromosome ends and shorten with each cell division, relating to aging.",

	// Meteorology
	"Diamond dust is a ground-level cloud composed of tiny ice crystals that form in extreme cold.",
	"Thundersnow occurs when lightning happens during a snowstorm, requiring special atmospheric conditions.",
	"The lowest atmospheric pressure ever recorded was 870 hPa during Typhoon Tip in 1979.",
	"Catatumbo Lightning in Venezuela produces up to 280 lightning strikes per hour, 300 nights a year.",
	"Ball lightning remains unexplained, with reports of glowing spheres lasting several seconds.",

	// Nanotechnology
	"Carbon nanotubes are 100 times stronger than steel at one-sixth the weight.",
	"Nanobots smaller than red blood cells can navigate bloodstreams for targeted drug delivery.",
	"Quantum dots glow specific colors based on their size when exposed to UV light.",
	"Nanoscale 3D printing can create objects smaller than a human blood cell.",
	"Self-assembling nanomaterials organize into complex structures using molecular recognition.",

	// Marine Biology
	"Mantis shrimp strike with the speed of a .22 caliber bullet, creating cavitation bubbles.",
	"Cephalopods like octopuses can edit their RNA to rapidly adapt to environmental changes.",
	"Whale falls create entire ecosystems that can last decades on the ocean floor.",
	"Coral polyps are translucent animals related to jellyfish that build calcium carbonate skeletons.",
	"Anglerfish males permanently fuse with females, sharing bloodstreams and organs.",

	// Particle Physics
	"The Higgs boson gives elementary particles mass through interactions with the Higgs field.",
	"There are six types of quarks: up, down, charm, strange, top, and bottom.",
	"Neutrinos are so weakly interacting that trillions pass through your body every second.",
	"Antimatter particles have identical mass but opposite charge to their matter counterparts.",
	"The Standard Model predicts 17 elementary particles, all of which have been experimentally observed.",

	// Architecture
	"The Pantheon's concrete dome remains the world's largest unreinforced concrete dome after 1,900 years.",
	"Fractal geometry influences traditional Islamic architectural patterns and modern buildings.",
	"The Shanghai Tower's twisted design reduces wind loads by 24%, saving construction materials.",
	"Ancient Roman concrete contained volcanic ash, making it more durable than modern formulations.",
	"Biomimetic architecture copies nature - like the Eastgate Centre modeled on termite mounds.",

	// Cryptography
	"Quantum cryptography uses photon polarization states to create theoretically unbreakable encryption.",
	"The Enigma machine had 158 million million million possible settings during WWII.",
	"SHA-256 hash function produces a unique 256-bit signature for any input, even empty files.",
	"One-time pads provide perfect secrecy when used correctly with truly random keys.",
	"Post-quantum cryptography develops algorithms resistant to quantum computer attacks.",

	// Zoology
	"Tardigrades can survive extreme conditions including space vacuum and radiation.",
	"Cephalopod chromatophores allow instant color changes through specialized pigment cells.",
	"Elephants communicate using infrasound below human hearing range over long distances.",
	"Honeybees perform waggle dances to communicate flower locations to hive members.",
	"Platypuses detect electric fields through their bills to hunt with eyes closed.",

	// Geometry
	"The Klein bottle is a non-orientable surface with no distinct inside or outside.",
	"Möbius strips have only one side and one edge when embedded in three-dimensional space.",
	"Fractal coastlines demonstrate infinite length within finite areas via self-similar patterns.",
	"Regular heptagons (7-sided polygons) can't be constructed with just a compass and straightedge.",
	"Hyperbolic geometry describes saddle-shaped spaces with parallel lines diverging.",

	// Energy
	"Nuclear fusion powers stars by combining hydrogen atoms under extreme pressure and temperature.",
	"Dyson spheres are hypothetical megastructures that could capture a star's entire energy output.",
	"Theoretical zero-point energy suggests empty space contains limitless quantum fluctuations.",
	"Piezoelectric materials generate electricity from mechanical stress like footsteps.",
	"Algae biofuels can produce up to 60 times more oil per acre than land-based plants.",

	// Microbiology
	"Bacteria outnumber human cells in your body by about 10 to 1.",
	"Extremophiles thrive in boiling hot springs, acidic pools, and radioactive environments.",
	"Viruses aren't considered living organisms as they can't reproduce without host cells.",
	"Mycelium networks act as 'Earth's internet', connecting plants and transferring nutrients.",
	"Prions are misfolded proteins that cause diseases like CJD without containing DNA/RNA.",

	// Thermodynamics
	"Absolute zero (0K/-273.15°C) can't be reached due to quantum mechanical zero-point energy.",
	"Maxwell's Demon thought experiment challenges the second law of thermodynamics.",
	"Bose-Einstein condensates form when atoms are cooled to near absolute zero, acting as a superatom.",
	"The third law of thermodynamics states entropy approaches a constant as temperature nears absolute zero.",
	"Carnot efficiency limits heat engines based on temperature difference between reservoirs.",

	// Botany
	"The corpse flower's stench comes from chemicals mimicking rotting flesh to attract pollinators.",
	"Sunflowers perform heliotropism, tracking the sun's movement across the sky.",
	"Dendrochronology uses tree ring patterns to date events and study past climates.",
	"The world's oldest individual tree is a 5,000-year-old bristlecone pine named Methuselah.",
	"Quaking aspen colonies can cover 100+ acres through interconnected root systems.",

	// Astrophysics
	"Dark matter constitutes 27% of the universe's mass-energy, detectable only through gravity.",
	"Gamma-ray bursts release more energy in seconds than our sun will emit in its entire lifetime.",
	"White dwarfs are so dense that a teaspoon of their material would weigh 15 tons on Earth.",
	"The Milky Way and Andromeda galaxies will collide in about 4.5 billion years.",
	"Pulsars are highly magnetized neutron stars emitting beams of electromagnetic radiation.",

	// Fluid Dynamics
	"The Magnus effect explains curve balls in baseball and Flettner rotor ship propulsion.",
	"Turbulent flow is chaotic while laminar flow moves in parallel layers with no disruption.",
	"The Coandă effect makes fluids follow curved surfaces, used in aircraft wing design.",
	"Non-Newtonian fluids like oobleck harden under pressure and liquefy when relaxed.",
	"Rayleigh-Taylor instabilities occur when heavy fluids push through lighter ones.",

	// Electronics
	"Memristors 'remember' their resistance state even when powered off.",
	"Spintronics uses electron spin rather than charge for more efficient data storage.",
	"Quantum tunneling enables flash memory and Josephson junctions in superconductors.",
	"Flexible electronics use materials like graphene for bendable displays and wearables.",
	"Photonic crystals control light propagation, enabling super-efficient LEDs and lasers.",

	// Geology
	"Earth's inner core grows by about 1mm/year as the planet gradually cools.",
	"The San Andreas Fault moves at about 2 inches per year - the speed of fingernail growth.",
	"Pahoehoe lava flows resemble twisted ropes, while a'a' lava has sharp, jagged surfaces.",
	"Zircon crystals from Australia date back 4.4 billion years - almost as old as Earth.",
	"Supervolcanoes like Yellowstone erupt 1,000+ cubic kilometers of material when active.",

	// Probability
	"The Monty Hall problem demonstrates counterintuitive probability with a 2/3 chance of winning by switching doors.",
	"Benford's Law predicts digit distribution in naturally occurring datasets, useful for fraud detection.",
	"Gambler's fallacy incorrectly assumes independent events are influenced by previous outcomes.",
	"Poisson distributions model rare events like meteor strikes or system failures.",
	"The birthday paradox shows only 23 people needed for 50% chance of shared birthdays.",

	// Optics
	"Total internal reflection keeps light trapped in fiber optic cables with minimal signal loss.",
	"Chameleons change color using nanocrystals in iridophore cells that reflect specific wavelengths.",
	"Polarized light reveals stress patterns in transparent materials through photoelasticity.",
	"Holograms record light interference patterns to create 3D images with depth perception.",
	"Adaptive optics in telescopes use deformable mirrors to correct atmospheric distortion.",

	// Acoustics
	"Brown note refers to a theoretical infrasound frequency causing involuntary bowel movements.",
	"Acoustic levitation uses sound waves to suspend small objects in mid-air.",
	"The 'mosquito' tone at 17.4 kHz is inaudible to most adults over 25 due to presbycusis.",
	"Sonic booms occur when objects exceed the speed of sound, creating shock waves.",
	"Architectural acoustics in concert halls use diffusion and absorption for optimal sound.",

	// Exoplanets
	"Hot Jupiters are gas giants orbiting extremely close to their stars with years lasting days.",
	"Rogue planets wander interstellar space without orbiting any star.",
	"The habitable zone (Goldilocks zone) varies based on star type and planetary atmosphere.",
	"Transit photometry detects exoplanets by measuring starlight dips during planetary passes.",
	"Proxima Centauri b is the nearest exoplanet to Earth at 4.24 light-years away.",

	// Immunology
	"Vaccines train adaptive immunity using weakened pathogens or molecular components.",
	"Autoimmune diseases occur when the body mistakenly attacks its own tissues.",
	"Memory B cells retain pathogen information for faster future immune responses.",
	"CRISPR-Cas9 derives from bacterial immune systems that store viral DNA snippets.",
	"Immunotherapy uses checkpoint inhibitors to 'release the brakes' on cancer-fighting T cells.",

	// Calculus
	"The fundamental theorem of calculus links differentiation and integration as inverse processes.",
	"Taylor series approximate functions as infinite sums of polynomial terms.",
	"L'Hôpital's rule resolves indeterminate limits using derivatives of numerator/denominator.",
	"Stochastic calculus models systems with random variables, essential for financial math.",
	"Vector calculus describes electromagnetic fields and fluid flow with divergence/curl operators.",
];

export const funFactsTitles = [
	"Did you know?",
	"Fun Fact!",
	"Mind-Blowing Fact!",
	"Science Fact!",
	"Amazing Fact!",
	"Cool Fact!",
	"Interesting Fact!",
];

export function getRandomStemFacts(amount: number): string[] {
	const shuffled = [...stemFacts].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, Math.min(amount, stemFacts.length));
}

export function getRandomFunFactTitle(): string {
	return funFactsTitles[Math.floor(Math.random() * funFactsTitles.length)];
}
