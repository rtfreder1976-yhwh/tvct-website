/**
 * Centralized Testimonials Data
 * Real Google Reviews - Each review appears on ONE location only
 * Last updated: December 2024
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

// BIRMINGHAM / MOUNTAIN BROOK AREA
export const birminghamTestimonials: Testimonial[] = [
  {
    name: "Mary Ellen R.",
    initial: "M",
    location: "Birmingham Area",
    text: "Excellent job by my cleaning crew. Very professional, dependable, thorough (every nook & cranny!) and easy-going. I'll definitely use from here forward. House is spotless and smells so fresh and clean. Worth every penny!",
    service: "Deep Cleaning",
    date: "February 2024",
    source: "via Google"
  },
  {
    name: "Chivone M.",
    initial: "C",
    location: "Birmingham Area",
    text: "I had the pleasure of booking Valley Clean Team for an initial deep cleaning, and I couldn't be more satisfied. Charity, our cleaner, was not only prompt but also did an outstanding job, leaving our house spotless. I highly recommend their services for their professionalism and attention to detail.",
    service: "Deep Cleaning",
    date: "January 2024",
    source: "via Google"
  },
  {
    name: "Elizabeth D.",
    initial: "E",
    location: "Birmingham Area",
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

// GENERAL / HOMEPAGE TESTIMONIALS (Best overall)
export const homepageTestimonials: Testimonial[] = [
  {
    name: "Mckala H.",
    initial: "M",
    text: "The Valley Clean Team cleaned my home expertly. They always kept me up to date on arrival time and finish time. The people cleaning the house were very nice. The house smelled clean and fresh when they finished. I recommend this business wholeheartedly.",
    service: "House Cleaning",
    date: "October 2024",
    source: "via Google"
  },
  {
    name: "Brandi S.",
    initial: "B",
    text: "I highly recommend The Valley Clean Team. The service was excellent, from our initial conversations, to the cleaning, to the follow-up. I knew exactly what to expect the entire process.",
    service: "Deep Cleaning",
    date: "May 2024",
    source: "via Google"
  },
  {
    name: "Ginny B.",
    initial: "G",
    text: "The Valley Clean Team has been a great company to hire for a professional detailed house cleaning. Todd, the owner, goes out of his way to accommodate and arrange cleaning times. I have been very pleased with the cleaning crews I've had. They're professional and knowledgeable about cleaning homes.",
    service: "House Cleaning",
    date: "March 2024",
    source: "via Google"
  },
  {
    name: "Tina R.",
    initial: "T",
    text: "I had a hard time relinquishing my house cleaning to someone else but I'm a mom, wife and full time employee and lord knows I'm tired. I realize I cannot do it all. They were quick to get me scheduled, they showed up on time and quickly got to work. They did a great job!",
    service: "Deep Cleaning",
    date: "April 2023",
    source: "via Google"
  },
  {
    name: "Chris P.",
    initial: "C",
    text: "Incredibly done. Very clean once they were complete! Bathrooms, floors, kitchen, everything was knocked out. Oh yeah, and they were awesome to my dog!!",
    service: "Deep Cleaning",
    date: "January 2023",
    source: "via Google"
  },
  {
    name: "Rhonda B.",
    initial: "R",
    text: "This was one of the best and most pleasant experiences. The automatic response was greatly appreciated. Then the modern app that helps make everything smooth along with the notifications of arrival and leaving are fantastic! Getting the photos helped a lot. Def recommend!",
    service: "House Cleaning",
    date: "January 2025",
    source: "via Google"
  },
  {
    name: "Christina T.",
    initial: "C",
    text: "Todd, Sissy, and Tiffany were AMAZING!!!! I can be VERY PICKY about everything and these people were professional, kind, and thorough!",
    service: "Deep Cleaning",
    date: "March 2024",
    source: "via Google"
  },
  {
    name: "Abigail R.",
    initial: "A",
    text: "Thorough and friendly. I would absolutely recommend The Valley Clean Team to anyone I know.",
    service: "House Cleaning",
    date: "May 2024",
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
    'birmingham': birminghamTestimonials,
    'mountain-brook': birminghamTestimonials,
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
