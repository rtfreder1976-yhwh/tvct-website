/**
 * Centralized Testimonials Data
 * Real Google Reviews - Each review appears on ONE location only
 * Last updated: July 2026 (homepage set refreshed from live GBP)
 */

export interface Testimonial {
  name: string;
  initial: string;
  location?: string;
  text: string;
  service?: string;
  date: string;
  source: string;
}

// HUNTSVILLE AREA (Main Market)
export const huntsvilleTestimonials: Testimonial[] = [
  {
    name: "Mike M.",
    initial: "M",
    location: "Madison, AL",
    text: "We hired the Valley Clean Team to do a deep clean of our home in Madison, AL. They went above and beyond to work our home into their schedule quickly. When the new person arrived she was very friendly and personable. She worked extremely hard and did a fantastic job cleaning the house top to bottom. She was extremely detailed. When she was done the house was immaculate.",
    service: "Deep Cleaning",
    date: "July 2024",
    source: "via Google"
  },
  {
    name: "Morgan C.",
    initial: "M",
    location: "Huntsville Area",
    text: "Staff and cleaning team was very professional and personable, our house was so nice and clean and smelt amazing! They truly care and take the time to make sure its done right. Will definitely be using The Valley Clean Team again. 5 stars would recommend!",
    service: "House Cleaning",
    date: "December 2024",
    source: "via Google"
  },
  {
    name: "Heather H.",
    initial: "H",
    location: "Huntsville Area",
    text: "The Valley Cleaning Team is unmatched in their attention to detail and professionalism. Highly recommend their services, you will not be disappointed!",
    service: "Deep Cleaning",
    date: "December 2024",
    source: "via Google"
  }
];

// MADISON AREA
export const madisonTestimonials: Testimonial[] = [
  {
    name: "Tina W.",
    initial: "T",
    location: "Madison Area",
    text: "The cleaning team did a great job with deep cleaning my house. They were very respectful of my house/furnishings and cleaned everything. They used their own tools and left every room spotless!",
    service: "Deep Cleaning",
    date: "February 2025",
    source: "via Google"
  },
  {
    name: "Leslie H.",
    initial: "L",
    location: "Madison Area",
    text: "Stephanie and Cindy did an amazing job doing a one time deep clean. My light fixtures and baseboards have never looked so good! Life has been crazy stressful since the holidays, and coming home to a clean house was an excellent way to kick off my self care weekend.",
    service: "Deep Cleaning",
    date: "February 2025",
    source: "via Google"
  },
  {
    name: "Joshua C.",
    initial: "J",
    location: "Madison Area",
    text: "Professional team, did a fantastic job and the crew was really polite!",
    service: "House Cleaning",
    date: "February 2025",
    source: "via Google"
  }
];

// NASHVILLE AREA
export const nashvilleTestimonials: Testimonial[] = [
  {
    name: "Kristie L.",
    initial: "K",
    location: "Nashville Area",
    text: "Todd is absolutely wonderful to talk to. The team he sent did a very good job and though I noticed some things, after they had left, once I discussed with Todd, it was quickly addressed and that makes The Valley Clean Team EXCELLENT in my books. The cleaners were friendly and worked hard.",
    service: "Deep Cleaning",
    date: "March 2025",
    source: "via Google"
  },
  {
    name: "Tom S.",
    initial: "T",
    location: "Nashville Area",
    text: "The Valley Clean Team was thorough and extremely professional. It was a pleasure to work with them!",
    service: "House Cleaning",
    date: "March 2025",
    source: "via Google"
  },
  {
    name: "Alexandria N.",
    initial: "A",
    location: "Nashville Area",
    text: "Very professional, thorough, and kind. Can't recommend them enough! They also offer bi-weekly or monthly cleanings. It's very convenient.",
    service: "Recurring Cleaning",
    date: "January 2025",
    source: "via Google"
  }
];

// WEST NASHVILLE AREA
export const westNashvilleTestimonials: Testimonial[] = [
  {
    name: "Miranda H.",
    initial: "M",
    location: "Nashville Area",
    text: "The Valley Clean Team has been great! No issues, good communication and great cleaning!",
    service: "Recurring Cleaning",
    date: "February 2025",
    source: "via Google"
  },
  {
    name: "Jarrod W.",
    initial: "J",
    location: "Nashville Area",
    text: "Great job and did exactly what is listed on the clean sheet. Polite and courteous service.",
    service: "House Cleaning",
    date: "January 2025",
    source: "via Google"
  },
  {
    name: "Nikkita J.",
    initial: "N",
    location: "Nashville Area",
    text: "Wonderful crew! Attentive to calls. Flexible to fit our schedule. Great work.",
    service: "House Cleaning",
    date: "January 2025",
    source: "via Google"
  }
];

// MOUNTAIN BROOK AREA
export const mountainBrookTestimonials: Testimonial[] = [
  {
    name: "Mary Ellen R.",
    initial: "M",
    location: "Mountain Brook Area",
    text: "Excellent job by my cleaning crew. Very professional, dependable, thorough (every nook & cranny!) and easy-going. I'll definitely use from here forward. House is spotless and smells so fresh and clean. Worth every penny!",
    service: "Deep Cleaning",
    date: "February 2024",
    source: "via Google"
  },
  {
    name: "Chivone M.",
    initial: "C",
    location: "Mountain Brook Area",
    text: "I had the pleasure of booking Valley Clean Team for an initial deep cleaning, and I couldn't be more satisfied. Charity, our cleaner, was not only prompt but also did an outstanding job, leaving our house spotless. I highly recommend their services for their professionalism and attention to detail.",
    service: "Deep Cleaning",
    date: "January 2024",
    source: "via Google"
  },
  {
    name: "Elizabeth D.",
    initial: "E",
    location: "Mountain Brook Area",
    text: "Wonderful service and attention to detail. Always feel like I'm in a fresh clean space when they leave.",
    service: "Recurring Cleaning",
    date: "January 2024",
    source: "via Google"
  }
];

// FLORENCE / SHOALS AREA
export const florenceTestimonials: Testimonial[] = [
  {
    name: "Susan A.",
    initial: "S",
    location: "Shoals Area",
    text: "So happy I found Valley Clean Team! Scheduling is super easy and prices are reasonable. The cleaners do a great job. They are efficient without cutting corners. I love having my weekends free to do something other than clean my house!",
    service: "Recurring Cleaning",
    date: "October 2024",
    source: "via Google"
  },
  {
    name: "Deborah B.",
    initial: "D",
    location: "Shoals Area",
    text: "The Valley Clean Team is very professional. I have had others clean my home but I am particular and they did not please like The Valley Clean Team did. I will definitely use them again.",
    service: "Deep Cleaning",
    date: "August 2024",
    source: "via Google"
  },
  {
    name: "Lynnette W.",
    initial: "L",
    location: "Shoals Area",
    text: "Marika J did a great job cleaning my home. She was on time and very professional. If you are looking for a cleaning service The Valley Clean Team is just who you need!",
    service: "House Cleaning",
    date: "August 2024",
    source: "via Google"
  }
];

// ATHENS AREA
export const athensTestimonials: Testimonial[] = [
  {
    name: "Savannah F.",
    initial: "S",
    location: "Athens Area",
    text: "Let me just start with the fact that my husband and I are not compatible when it comes to cleaning so these guys are life (and marriage) savers! We both agree the house looked amazing and spotless, so much better than we could've done. Super sweet people, great pricing as well!",
    service: "Deep Cleaning",
    date: "June 2024",
    source: "via Google"
  },
  {
    name: "Curtis H.",
    initial: "C",
    location: "Athens Area",
    text: "Great work. Very pleasant to deal with. The ladies were conscientious, respectful, and courteous. Highly recommend!",
    service: "House Cleaning",
    date: "June 2024",
    source: "via Google"
  },
  {
    name: "Brenda B.",
    initial: "B",
    location: "Athens Area",
    text: "We are so pleased with the cleanup of our barn by the Tiffany team! They did a fantastic job, and it was not an easy task! Thank you so much!",
    service: "Special Cleaning",
    date: "June 2024",
    source: "via Google"
  }
];

// DECATUR AREA
export const decaturTestimonials: Testimonial[] = [
  {
    name: "Ana-Denise T.",
    initial: "A",
    location: "Decatur Area",
    text: "Awesome experience! We received a deep cleaning of our home and I highly recommend. We will definitely see them again. Feels good to get a break and not worry because they did everything they said they would do and the results were amazing!",
    service: "Deep Cleaning",
    date: "October 2024",
    source: "via Google"
  },
  {
    name: "Steven B.",
    initial: "S",
    location: "Decatur Area",
    text: "Experienced a 'Deep Clean' package and couldn't have been happier with the results! The team took their time and paid attention to detail in every corner of my home. Very Satisfied!",
    service: "Deep Cleaning",
    date: "September 2024",
    source: "via Google"
  },
  {
    name: "Vickie C.",
    initial: "V",
    location: "Decatur Area",
    text: "We had Marika do a move out cleaning and she was very thorough. The place looked and smelled really clean. I TOTALLY recommend them.",
    service: "Move Out Cleaning",
    date: "October 2024",
    source: "via Google"
  }
];

// MOVE IN/OUT SPECIFIC
export const moveCleaningTestimonials: Testimonial[] = [
  {
    name: "Cindy S.",
    initial: "C",
    text: "Moving is such a chore. Handing the moving out cleaning to Valley Cleaning was a very smart choice. They communicate well and our housekeeper was very nice and on time. She did an amazing job and we got our full deposit back thanks to Valley Cleaning.",
    service: "Move Out Cleaning",
    date: "May 2024",
    source: "via Google"
  },
  {
    name: "Mary S.",
    initial: "M",
    text: "The Valley Clean Team did a great job on our move-out clean. Tiffany and her team were on time and professional and very efficient. They cleaned the carpet in addition to cleaning our townhouse and did a great job on everything. Highly recommend!",
    service: "Move Out Cleaning",
    date: "April 2023",
    source: "via Google"
  },
  {
    name: "Niki O.",
    initial: "N",
    text: "I was moving out and had the Valley Clean Team come out to do a move out service and a carpet cleaning. They were very sweet, very professional, showed up on time, and performed some good quality cleaning!! I would highly recommend them to anyone!",
    service: "Move Out Cleaning",
    date: "February 2023",
    source: "via Google"
  }
];

// COMMERCIAL / BUSINESS SPECIFIC
export const commercialTestimonials: Testimonial[] = [
  {
    name: "T and A Automotive",
    initial: "T",
    text: "We had the best experience with The Valley Clean Team! Our automotive shop was in desperate need of some TLC, these ladies came in and provided some much needed help! From oil shoe prints on the floor to dust on the walls, not a surface was left untouched. We can't wait for The Valley Clean Team to come again.",
    service: "Commercial Cleaning",
    date: "February 2024",
    source: "via Google"
  },
  {
    name: "John W.",
    initial: "J",
    text: "The Valley Clean Team has done an amazing job cleaning for my small business. They are detailed and efficient, along with going out of their way to help their clients. They had my bathrooms looking spotless. Todd and Christen as the owners make you feel valued.",
    service: "Commercial Cleaning",
    date: "October 2023",
    source: "via Google"
  },
  {
    name: "Dani M.",
    initial: "D",
    text: "They have great communication skills, and always strive to exceed expectations! I would recommend them to anyone whether you require cleaners for property management or personal needs!",
    service: "Property Management",
    date: "January 2024",
    source: "via Google"
  }
];

// POST-CONSTRUCTION / SPECIAL CLEANING
export const specialCleaningTestimonials: Testimonial[] = [
  {
    name: "Will M.",
    initial: "W",
    text: "The Valley Clean Team were hired to clean 2 (New Construction Properties) to get them ready to be listed. They did a great job cleaning the homes.",
    service: "Post-Construction",
    date: "September 2024",
    source: "via Google"
  },
  {
    name: "Matthew D.",
    initial: "M",
    text: "Great service. They thoroughly deep cleaned our house which played an instrumental part to successful showing and sale.",
    service: "Real Estate Prep",
    date: "June 2024",
    source: "via Google"
  },
  {
    name: "Suzanne K.",
    initial: "S",
    text: "So we needed our parents home cleaned and picture ready to put it on the market and they did a great job!! Well worth it would definitely recommend.",
    service: "Real Estate Prep",
    date: "January 2024",
    source: "via Google"
  }
];

// RECURRING / REGULAR CLEANING
export const recurringTestimonials: Testimonial[] = [
  {
    name: "Heather C.",
    initial: "H",
    text: "We have had several sessions so far and each time is consistent and great! The ladies do a wonderful job and are quick and considerate. We appreciate the hard work.",
    service: "Recurring Cleaning",
    date: "December 2023",
    source: "via Google"
  },
  {
    name: "Michelle M.",
    initial: "M",
    text: "I am so glad I have a cleaning company that are effective and efficient!",
    service: "Recurring Cleaning",
    date: "April 2023",
    source: "via Google"
  },
  {
    name: "Thomas C.",
    initial: "T",
    text: "Thorough, efficient, and friendly. Tiffany's team was everything we expected. They are so friendly and we look forward to them coming back.",
    service: "Recurring Cleaning",
    date: "June 2023",
    source: "via Google"
  }
];

// DEEP CLEANING SPECIFIC
export const deepCleaningTestimonials: Testimonial[] = [
  {
    name: "David H.",
    initial: "D",
    text: "Had The Valley Clean Team come and do a deep clean the day before Thanksgiving. They did a great job and we will hire them again in the future!",
    service: "Deep Cleaning",
    date: "December 2024",
    source: "via Google"
  },
  {
    name: "Erika B.",
    initial: "E",
    text: "Today team Tiffany came to do a deep cleaning at my house and did a great job. They did everything I asked for and more. Very happy to have everything clean for Easter and already scheduled the next follow up.",
    service: "Deep Cleaning",
    date: "March 2024",
    source: "via Google"
  },
  {
    name: "Shannon I.",
    initial: "S",
    text: "What lovely people! Their cleaning is top notch! Be sure to tell them exactly what you want and what you don't want and they will make it happen. I needed their help after we had several surgeries between us and needed help getting back on track. I'm super picky about things being clean enough and they did everything up to my standards and above.",
    service: "Deep Cleaning",
    date: "March 2024",
    source: "via Google"
  }
];

// GENERAL / HOMEPAGE TESTIMONIALS (most recent Google reviews)
//
// Refreshed 2026-07-25 from the live Google Business Profile. The previous set
// led with reviews from 2023-2024 on a site whose footer reads (c) 2026, which
// read as a business that had stopped collecting them.
//
// Only complete, verbatim review text is used here — reviews that Google
// truncated behind "View full review" are deliberately excluded rather than
// paraphrased. Dates are derived from Google's relative timestamps ("2 weeks
// ago"), so they are accurate to the month but worth spot-checking against the
// dashboard if exact dates ever matter.
export const homepageTestimonials: Testimonial[] = [
  {
    name: "Erica H.",
    initial: "E",
    text: "Brittany did an awesome job! Very friendly too.",
    service: "House Cleaning",
    date: "July 2026",
    source: "via Google"
  },
  {
    name: "Brandi C.",
    initial: "B",
    text: "Cassandra was very friendly and well oriented. Everything was clean and fresh smelling when she was done.",
    service: "House Cleaning",
    date: "June 2026",
    source: "via Google"
  },
  {
    name: "Carol S.",
    initial: "C",
    text: "Great job for the move out clean from Kassandra! My sellers are super happy!! It is nice to be able to pack up and go without the hassles of a final clean. Thank you!!",
    service: "Move-Out Cleaning",
    date: "June 2026",
    source: "via Google"
  },
  {
    name: "Tina B.",
    initial: "T",
    text: "Kassandra was amazing, she worked long and hard. Great attitude and obviously enjoyed her work. Todd has great customer service and really cares about his clients wants and needs. I would absolutely refer them.",
    service: "House Cleaning",
    date: "May 2026",
    source: "via Google"
  },
  {
    name: "Megan D.",
    initial: "M",
    text: "Great experience with valley clean team. They communicated well and were able to get us in quickly.",
    service: "House Cleaning",
    date: "May 2026",
    source: "via Google"
  },
  {
    name: "Letitia Y.",
    initial: "L",
    text: "Good service very nice people to work with and helpful. Kassandra did a good job doing what we needed done and even did some helpful extra things that weren't expected.",
    service: "House Cleaning",
    date: "April 2026",
    source: "via Google"
  },
  {
    name: "Skyler P.",
    initial: "S",
    text: "They were a pleasure to work with and did a really good job with the move-out cleaning of our rental home.",
    service: "Move-Out Cleaning",
    date: "April 2026",
    source: "via Google"
  },
  {
    name: "Cody G.",
    initial: "C",
    text: "Great company. Customer service top notch. Katie was absolutely amazing. 10 out of 10. She went above and beyond to make sure we were happy in our clean new home. Process was very transparent and fair. 100% recommend",
    service: "House Cleaning",
    date: "February 2026",
    source: "via Google"
  }
];

// Helper function to get testimonials by location key
export function getTestimonialsByLocation(locationKey: string): Testimonial[] {
  const locationMap: Record<string, Testimonial[]> = {
    'huntsville': huntsvilleTestimonials,
    'madison': madisonTestimonials,
    'nashville': nashvilleTestimonials,
    'west-nashville': westNashvilleTestimonials,
    'mountain-brook': mountainBrookTestimonials,
    'florence': florenceTestimonials,
    'muscle-shoals': florenceTestimonials,
    'tuscumbia': florenceTestimonials,
    'sheffield': florenceTestimonials,
    'athens': athensTestimonials,
    'decatur': decaturTestimonials,
  };
  
  return locationMap[locationKey] || homepageTestimonials;
}

// Helper function to get service-specific testimonials
export function getTestimonialsByService(serviceKey: string): Testimonial[] {
  const serviceMap: Record<string, Testimonial[]> = {
    'deep-cleaning': deepCleaningTestimonials,
    'move-out-cleaning': moveCleaningTestimonials,
    'move-in-cleaning': moveCleaningTestimonials,
    'commercial-cleaning': commercialTestimonials,
    'office-cleaning': commercialTestimonials,
    'recurring-maid-service': recurringTestimonials,
    'post-construction-cleaning': specialCleaningTestimonials,
  };
  
  return serviceMap[serviceKey] || homepageTestimonials;
}
