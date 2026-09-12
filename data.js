/* ============================================================
   data.js — the content layer.

   Every card, modal and filter chip on the page is generated from
   this array. Nothing about a pitch is written in index.html.
   Add an object here and a new card appears. Delete one and it
   disappears. That is the whole reason this project scales.

   -----------------------------------------------------------
   JATIN — READ THIS.

   These 12 are DRAFTS. Rewrite each one in your own words before
   you submit. You do not have to change the facts or the shape,
   just say it how you would say it. Two reasons:

     1. Judges read this text. Twelve pitches in one uniform voice
        reads as generated. Yours will not.
     2. You will be asked "which of these would you actually back?"
        You can only answer that about writing you own.

   Fastest way: read a pitch out loud, then retype it the way you
   just said it. Ten minutes each, done in two hours.
   -----------------------------------------------------------

   FIELD REFERENCE
     id         lowercase, no spaces. Used as the localStorage key.
     name       display name
     tagline    one line, shown on the card
     category   becomes a filter chip automatically
     tags       extra words the search box matches on
     founder    who is behind it
     added      ISO date, used by the "Newest first" sort
     baseVotes  starting vote count before anyone votes
     problem / solution / market / traction   shown in the modal
     seedNotes  starter comments so the board isn't empty
   ============================================================ */

const IDEAS = [
  {
    id: "messmate",
    name: "MessMate",
    tagline: "Hostel mess bills, split and settled before anyone forgets.",
    category: "FinTech",
    tags: ["upi", "hostel", "payments", "split"],
    founder: "2 students, NSUT",
    added: "2026-02-11",
    baseVotes: 34,
    problem:
      "Hostel mess and canteen bills get paid by whoever has balance that day. A month later nobody remembers who owes what, and the group chat turns into an argument. Splitwise handles the maths but never the actual money.",
    solution:
      "One UPI collect link per group. One person pays the vendor, the app fires collect requests to everyone else instantly, and settles the moment they approve. No ledger to reconcile, because the money moves the same day.",
    market:
      "Roughly 40 million students in Indian higher education, a large share of them in shared mess or PG arrangements.",
    traction:
      "Paper prototype tested with 3 NSUT hostel blocks. 62 of 78 students said they would use it over manual reminders.",
    seedNotes: [
      { by: "Aarav", text: "The same-day settlement is the whole product. Splitwise never solved that.", at: "2026-03-02T10:12:00" },
      { by: "Ishita", text: "Every hostel group chat needs this. Backing it purely from pain.", at: "2026-03-04T18:40:00" }
    ]
  },
  {
    id: "sunsweep",
    name: "SunSweep",
    tagline: "Rooftop solar loses a fifth of its output to dust. We come clean it.",
    category: "ClimateTech",
    tags: ["solar", "energy", "subscription", "tier-2"],
    founder: "Solo founder, Jaipur",
    added: "2026-02-14",
    baseVotes: 27,
    problem:
      "Residential rooftop solar in North India loses meaningful generation to dust and bird droppings, and almost nobody cleans panels on a schedule. Owners see a smaller saving than promised and blame the installer.",
    solution:
      "A cleaning subscription priced per kilowatt, routed street by street so one technician covers a whole colony in a morning. Customers get a before-and-after generation figure pulled from their own inverter app, so the value is visible rather than claimed.",
    market:
      "Fast-growing residential rooftop installations across Rajasthan, Gujarat and Haryana, concentrated in dense colonies where routing costs stay low.",
    traction:
      "34 paying households across two Jaipur colonies over three months. 80% renewed for a second quarter.",
    seedNotes: [
      { by: "Nikhil", text: "Proving the value from the customer's own inverter data is a smart move.", at: "2026-03-01T09:05:00" }
    ]
  },
  {
    id: "campuskart",
    name: "CampusKart",
    tagline: "The lab coat, drafter and textbook you need are already on campus.",
    category: "Campus",
    tags: ["resale", "marketplace", "circular", "books"],
    founder: "3 students, NSUT",
    added: "2026-02-18",
    baseVotes: 19,
    problem:
      "First years buy lab coats, drafters, workshop tools and course textbooks new, use them for two semesters, then let them rot in a cupboard. The next batch buys the same things new. The WhatsApp resale groups are completely unsearchable.",
    solution:
      "A campus-only listing board organised by branch and semester, so a second-year mechanical student sees exactly the kit their syllabus needs. Handover happens in person at a gate pickup point, so there is no logistics cost at all.",
    market:
      "Starts with one college of roughly 4,000 students, then replicates per campus. Each campus is a self-contained market that does not need the others to work.",
    traction:
      "A pilot run on a shared spreadsheet for one admission cycle: 140 items listed, 91 sold.",
    seedNotes: [
      { by: "Meera", text: "Zero logistics cost because handover is at the gate. That's why this one works.", at: "2026-03-03T14:22:00" },
      { by: "Rohit", text: "Needs a way to stop price gouging on first years, otherwise solid.", at: "2026-03-05T11:10:00" }
    ]
  },
  {
    id: "repairadda",
    name: "Repair Adda",
    tagline: "A verified repair guy for your mixer, cooler and inverter, with a bill.",
    category: "Services",
    tags: ["repair", "appliance", "local", "trust"],
    founder: "Solo founder, Delhi",
    added: "2026-02-21",
    baseVotes: 23,
    problem:
      "When a cooler or mixer dies, families call a number scrawled on a wall. The technician quotes on the spot, replaces a part nobody can verify, and leaves no bill. There is no way to tell a good repair from a bad one, so nobody trusts anyone.",
    solution:
      "A neighbourhood network of technicians on fixed visit fees, with photographed part replacements and a printed bill carrying a 30-day guarantee. Customers pay after the guarantee is explained, not before the work starts.",
    market:
      "Small-appliance repair is a large and almost entirely unorganised market across Indian cities, with reliable repeat demand every summer.",
    traction:
      "11 technicians onboarded across two Delhi neighbourhoods. Over 200 jobs completed with only 4 callbacks.",
    seedNotes: [
      { by: "Sana", text: "The photographed part replacement is the trust unlock. Everything else follows.", at: "2026-03-02T16:30:00" }
    ]
  },
  {
    id: "metropool",
    name: "MetroPool",
    tagline: "Your last two kilometres, shared with people on your own metro line.",
    category: "Mobility",
    tags: ["carpool", "metro", "commute", "delhi"],
    founder: "2 students, Dwarka",
    added: "2026-02-24",
    baseVotes: 31,
    problem:
      "The metro solves the long stretch and fails at the last two kilometres. Commuters end up haggling with autos twice a day, and the same forty people from the same station walk to the same office park separately.",
    solution:
      "Pooling matched by metro exit rather than by street address, so the pickup point is always a station gate and the driver never detours. Riders see who else from their line is going their way and the fare splits automatically.",
    market:
      "Delhi Metro alone carries several million daily riders, a large share of whom face an unsolved last-mile at both ends of the trip.",
    traction:
      "A WhatsApp-run pilot at Dwarka Sector 21 matched 40 regular commuters for six weeks with no drop-offs.",
    seedNotes: [
      { by: "Karan", text: "Matching by metro exit instead of address is the insight. Much easier to pool.", at: "2026-03-04T08:15:00" },
      { by: "Divya", text: "Would need women-only pool options to actually get adoption.", at: "2026-03-06T19:45:00" }
    ]
  },
  {
    id: "feesetu",
    name: "FeeSetu",
    tagline: "Coaching centres chase fees on WhatsApp. We just make it work properly.",
    category: "FinTech",
    tags: ["saas", "coaching", "fees", "whatsapp"],
    founder: "Solo founder, Kota",
    added: "2026-02-26",
    baseVotes: 16,
    problem:
      "Small coaching centres run fee collection out of a notebook and a WhatsApp group. The owner spends the first week of every month personally messaging parents, and still cannot say who has paid without checking the book.",
    solution:
      "Fee schedules live in one place and reminders go out automatically on WhatsApp with a payment link attached. The owner opens one screen and sees who paid, who is late, and by how much, without touching the notebook.",
    market:
      "Hundreds of thousands of small coaching institutes across India, most with under 200 students and no software at all.",
    traction:
      "Three centres in Kota using a manual version. Fee collection time dropped from about six days to two.",
    seedNotes: [
      { by: "Vikram", text: "Boring on the surface, but the recurring revenue here is very real.", at: "2026-03-05T13:00:00" }
    ]
  },
  {
    id: "entrypass",
    name: "EntryPass",
    tagline: "Society events run on registration sheets. Replace them with a QR.",
    category: "Campus",
    tags: ["qr", "events", "attendance", "societies"],
    founder: "2 students, NSUT",
    added: "2026-03-01",
    baseVotes: 22,
    problem:
      "Every society event starts with a queue at the door while two volunteers hunt for names on a printed sheet. Nobody knows real attendance afterwards, so sponsors get made-up numbers and the society cannot prove its reach.",
    solution:
      "Registration issues a QR to each attendee, a volunteer scans them in from a phone, and the organiser watches a live headcount. After the event the society gets an attendance report it can actually show a sponsor.",
    market:
      "Every college with active societies runs dozens of events a year. One campus is enough to prove it and each new campus onboards the same way.",
    traction:
      "Used at two NSUT society events with 300 combined attendees. Entry queue time dropped from about 12 minutes to under 3.",
    seedNotes: [
      { by: "Ankit", text: "The sponsor report is the part societies will actually pay for.", at: "2026-03-07T10:50:00" }
    ]
  },
  {
    id: "cratespace",
    name: "CrateSpace",
    tagline: "Cold storage booked by the crate, not by the truckload.",
    category: "AgriTech",
    tags: ["cold storage", "farmers", "logistics", "wastage"],
    founder: "Solo founder, Nashik",
    added: "2026-03-03",
    baseVotes: 12,
    problem:
      "Cold storage is sold in units far larger than a smallholder grows. A farmer with twenty crates of tomatoes either sells at whatever price the mandi offers that morning or watches the crop spoil. There is no middle option.",
    solution:
      "Existing cold storage owners list spare capacity in crate-sized units with day pricing. Farmers book what they actually have, hold stock through a price dip, and sell when the rate recovers.",
    market:
      "A large share of Indian farmers are smallholders, and post-harvest losses in perishables remain substantial across horticulture belts.",
    traction:
      "Two storage owners near Nashik agreed to list spare capacity. 14 farmers have expressed interest through a local FPO.",
    seedNotes: [
      { by: "Pooja", text: "Unbundling cold storage into crate units is genuinely new. Hard to execute though.", at: "2026-03-08T12:20:00" }
    ]
  },
  {
    id: "yojanabol",
    name: "YojanaBol",
    tagline: "Ask in Hindi which government schemes you qualify for. Get an answer.",
    category: "PublicTech",
    tags: ["voice", "hindi", "schemes", "access"],
    founder: "3 students, NSUT",
    added: "2026-03-05",
    baseVotes: 29,
    problem:
      "Scheme eligibility is buried in PDFs written in formal English on portals that assume a laptop and a login. The people the schemes are written for often cannot read the page that describes them, so benefits go unclaimed.",
    solution:
      "A voice-first flow on a basic phone. You answer a few spoken questions in Hindi about income, land and family, and it reads back the schemes you likely qualify for plus the documents you need to carry.",
    market:
      "Hundreds of central and state schemes, with large-scale under-enrolment routinely attributed to awareness and access rather than eligibility.",
    traction:
      "A Hindi prototype covering 8 schemes tested with 22 people in a Delhi urban village. 19 found at least one scheme they did not know they qualified for.",
    seedNotes: [
      { by: "Farhan", text: "19 of 22 finding something new is the strongest number on this whole board.", at: "2026-03-09T15:35:00" },
      { by: "Tanvi", text: "Voice-first on a basic phone is the right call. Don't add an app.", at: "2026-03-10T09:00:00" }
    ]
  },
  {
    id: "labshare",
    name: "LabShare",
    tagline: "The 3D printer in your college lab sits idle most of the week.",
    category: "Campus",
    tags: ["equipment", "booking", "lab", "prototyping"],
    founder: "2 students, NSUT",
    added: "2026-03-07",
    baseVotes: 18,
    problem:
      "College labs hold 3D printers, laser cutters and testing rigs that run a few hours a week during coursework. Meanwhile students on personal projects and local hardware startups have nowhere affordable to prototype.",
    solution:
      "A booking calendar per machine, approved by the lab in-charge, with slot pricing that covers consumables. Idle capacity turns into a small revenue line for the department and a prototyping resource for everyone else.",
    market:
      "Engineering colleges across India hold significant equipment with low utilisation, and every one of them sits near a hardware community that needs it.",
    traction:
      "Two NSUT labs agreed to a trial. 31 students signed a waitlist in the first week.",
    seedNotes: [
      { by: "Shreya", text: "Getting the lab in-charge to approve bookings is the hard part, not the software.", at: "2026-03-11T11:25:00" }
    ]
  },
  {
    id: "kiranakhata",
    name: "Kirana Khata",
    tagline: "The udhaar notebook, minus the part where nobody ever pays.",
    category: "FinTech",
    tags: ["kirana", "credit", "ledger", "upi"],
    founder: "Solo founder, Delhi",
    added: "2026-03-09",
    baseVotes: 25,
    problem:
      "Neighbourhood kirana stores run on credit recorded in a paper notebook. The shopkeeper is too embarrassed to chase regulars, so receivables stretch for months and working capital quietly disappears into the khata.",
    solution:
      "Entries go into a digital khata that sends the reminder instead of the shopkeeper, with a UPI link attached. The awkward conversation becomes a notification, and the shopkeeper can see exactly how much is owed at any moment.",
    market:
      "Over ten million kirana stores across India, a large share still recording credit on paper.",
    traction:
      "Six stores in one Delhi market used it for two months. Average collection time on credit dropped by roughly a third.",
    seedNotes: [
      { by: "Imran", text: "Letting the app do the chasing removes the social cost. That's the actual product.", at: "2026-03-12T17:40:00" },
      { by: "Neha", text: "Competitive space, but the neighbourhood-level focus could hold.", at: "2026-03-13T08:30:00" }
    ]
  },
  {
    id: "dhulai",
    name: "Dhulai",
    tagline: "Hostel laundry with a booked slot and nothing gone missing.",
    category: "Services",
    tags: ["laundry", "hostel", "pg", "slots"],
    founder: "2 students, Delhi",
    added: "2026-03-11",
    baseVotes: 14,
    problem:
      "Hostel and PG laundry runs on a pile, a shared dhobi and no record. Clothes come back late, come back wrong, or do not come back. Every complaint is one student's memory against another's.",
    solution:
      "Students book a collection slot and every bundle is logged by item count at pickup and again at return. A mismatch is flagged at handover rather than discovered a week later, so disputes have a record behind them.",
    market:
      "Dense student housing clusters around every major campus, with laundry as a guaranteed weekly spend.",
    traction:
      "Ran for one semester across two PGs near NSUT with 60 students. Lost-item complaints went from routine to two in four months.",
    seedNotes: [
      { by: "Gaurav", text: "Item count at both ends is such a simple fix for a problem everyone has.", at: "2026-03-14T20:05:00" }
    ]
  }
];
