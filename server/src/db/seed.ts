import { exit } from "node:process";
import { PrismaClient, Mood } from "../../generated/prisma";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const prisma = new PrismaClient();

const prettyPrint = (object: any) =>
  console.log(JSON.stringify(object, undefined, 2));

// Sample journal entries with different moods and lengths
const journalEntries = [
  {
    mood: Mood.HAPPY,
    title: "Perfect Morning Coffee",
    text: "Today started with the most amazing cup of coffee. I woke up early, the sun was streaming through my bedroom window, and everything felt perfect. I decided to try that new coffee shop downtown, and wow! The barista made me a latte with the most beautiful art on top. I sat outside, watched people walk by, and felt genuinely grateful for these simple pleasures. Sometimes it's the small things that make the biggest difference in our day.",
    summary:
      "Started the day with amazing coffee and felt grateful for simple pleasures",
    reason:
      "The text expresses joy and contentment about simple daily pleasures, with positive language like 'amazing', 'perfect', and 'grateful'.",
  },
  {
    mood: Mood.SAD,
    title: "Missing Home",
    text: "I called my mom today and heard the sadness in her voice. She's been struggling since dad passed away last month. I wish I could be there with her, but I'm stuck here with work commitments. The distance feels unbearable sometimes. I keep thinking about all the Sunday dinners we used to have as a family. The house must feel so empty now. I promised to visit next weekend, but it doesn't feel like enough.",
    summary:
      "Feeling heartbroken about mom's loneliness after dad's passing and being far away",
    reason:
      "The entry conveys deep sadness about loss, family separation, and feelings of helplessness, with words like 'sadness', 'struggling', and 'unbearable'.",
  },
  {
    mood: Mood.ANXIOUS,
    title: "Job Interview Nerves",
    text: "Tomorrow is the big interview and I can't stop my mind from racing. What if I say something stupid? What if they ask me about that gap in my resume? I've practiced the answers a hundred times, but I still feel unprepared. My heart starts beating faster every time I think about walking into that conference room. I know I'm qualified for this position, but the impostor syndrome is hitting hard tonight. I need this job so badly.",
    summary:
      "Overwhelmed with anxiety about tomorrow's important job interview",
    reason:
      "The text shows classic anxiety symptoms like racing thoughts, worry about future scenarios, and physical symptoms like increased heart rate.",
  },
  {
    mood: Mood.EXCITED,
    title: "Concert Tickets!",
    text: "I GOT THE TICKETS!!! After waiting in that online queue for 3 hours, I finally managed to snag front row seats for my favorite band's concert! I literally screamed when the confirmation email came through. My roommate thought something was wrong. I've been listening to their music since high school, and I never thought I'd actually get to see them live, let alone from the front row! This is going to be the best night ever! I can't wait to tell everyone!",
    summary:
      "Thrilled about securing front row tickets to favorite band's concert after long wait",
    reason:
      "The text is filled with excitement markers like capital letters, exclamation marks, and enthusiastic language expressing joy about achieving something special.",
  },
  {
    mood: Mood.ANGRY,
    title: "Traffic Nightmare",
    text: "I'm absolutely furious right now. Spent 2 hours stuck in traffic because of some construction they decided to start during rush hour. No warning signs, no alternate routes posted. Just pure incompetence from the city planning department. Made me 40 minutes late to my client meeting, which was completely embarrassing. These are the same people who complain about road conditions but can't manage basic traffic flow. And then my boss had the nerve to question my time management. This whole day has been a disaster.",
    summary:
      "Extremely frustrated with poor city planning causing traffic delays and work embarrassment",
    reason:
      "The text expresses clear anger through words like 'furious', 'incompetence', and 'disaster', showing frustration with external circumstances.",
  },
  {
    mood: Mood.PEACEFUL,
    title: "Evening Meditation",
    text: "Tonight I spent an hour in the garden, just sitting quietly and watching the sunset. The flowers are blooming beautifully this spring, and there's something so calming about being surrounded by nature. I practiced some deep breathing exercises and felt all the tension from the week slowly melting away. The birds were singing their evening songs, and a gentle breeze was rustling through the leaves. These moments of stillness are becoming more precious to me as life gets busier.",
    summary:
      "Found deep peace through evening meditation and time spent in the garden",
    reason:
      "The entry describes a serene experience with nature, using calming language and focusing on relaxation and inner peace.",
  },
  {
    mood: Mood.GRATEFUL,
    title: "Unexpected Kindness",
    text: "A stranger helped me today when I was struggling with my groceries and my car keys. I was juggling too many bags and dropped everything in the parking lot. This elderly gentleman immediately came over, helped me pick everything up, and even carried the bags to my car. He refused when I offered to buy him coffee as a thank you. His simple act of kindness completely restored my faith in people. It reminds me that there's still so much good in the world, and I want to pay it forward.",
    summary:
      "Deeply moved by stranger's selfless help with groceries, restored faith in humanity",
    reason:
      "The text expresses genuine gratitude for unexpected kindness and reflects on the positive impact of human generosity.",
  },
  {
    mood: Mood.FRUSTRATED,
    title: "Technology Problems",
    text: "My laptop crashed right in the middle of finishing my presentation, and I lost 3 hours of work. The auto-save feature that's supposed to save every 5 minutes apparently decided to take a vacation. Called tech support and spent 45 minutes on hold just to be told to 'turn it off and on again'. The presentation is due first thing Monday morning, and now I have to start from scratch over the weekend. Why does technology always fail when you need it most?",
    summary:
      "Lost hours of important work due to laptop crash and unhelpful tech support",
    reason:
      "The text shows frustration with technology failures and poor customer service, using rhetorical questions and expressing annoyance at the timing.",
  },
  {
    mood: Mood.WORRIED,
    title: "Health Concerns",
    text: "I've been having these headaches for the past week, and I can't shake the feeling that something might be seriously wrong. Dr. Google isn't helping my anxiety - every search leads to worst-case scenarios. I made an appointment with my doctor, but it's not until next Thursday. The waiting is the hardest part. I keep telling myself it's probably just stress from work, but my mind keeps wandering to darker possibilities. I hate feeling this helpless.",
    summary:
      "Anxious about persistent headaches and worried about potential health issues",
    reason:
      "The entry reflects worry and health anxiety, with concerns about symptoms and fear of potential serious medical conditions.",
  },
  {
    mood: Mood.CONTENT,
    title: "Quiet Sunday",
    text: "Today was one of those perfectly ordinary Sundays. I slept in until 9, made pancakes for breakfast, and spent the afternoon reading on the couch. No big adventures, no dramatic events, just peaceful contentment. I finished that novel I've been working on for weeks, and it had the most satisfying ending. There's something beautiful about these quiet days where you don't need to be anywhere or do anything extraordinary. Sometimes the best days are the ones where nothing special happens.",
    summary:
      "Enjoyed a perfectly peaceful Sunday with simple pleasures like sleeping in and reading",
    reason:
      "The text expresses satisfaction with a quiet, uneventful day, showing contentment with simple pleasures and ordinary moments.",
  },
  {
    mood: Mood.NEUTRAL,
    title: "Regular Workday",
    text: "Went to work, attended three meetings, responded to emails, and finished the quarterly report. Had lunch at the usual place with colleagues. The weather was okay - not sunny, not rainy. Traffic was normal for a Tuesday. Picked up groceries on the way home and made dinner. Watched an episode of that series everyone's talking about. It was fine. Tomorrow will probably be similar. Some days are just regular days, and that's okay too.",
    summary:
      "Had an ordinary workday with routine activities and normal interactions",
    reason:
      "The text describes routine activities without strong emotional language, indicating a neutral, matter-of-fact emotional state.",
  },
  {
    mood: Mood.TIRED,
    title: "Exhaustion Setting In",
    text: "I can barely keep my eyes open as I write this. This week has been absolutely draining - late nights at the office, early morning meetings, and that project deadline that seems impossible to meet. I've been running on coffee and determination, but my body is starting to protest. Even simple tasks feel overwhelming right now. I look forward to the weekend when I can finally catch up on sleep and recharge. I need to learn to pace myself better.",
    summary:
      "Completely exhausted from overwork and looking forward to weekend rest",
    reason:
      "The text describes physical and mental fatigue, with references to being drained, barely keeping eyes open, and needing rest.",
  },
  // Adding more diverse entries for better data variety
  {
    mood: Mood.HAPPY,
    title: "Surprise Birthday Party",
    text: "My friends threw me the most incredible surprise party! I thought we were just going out for a quiet dinner, but when I walked into the restaurant, 20 people jumped out yelling 'Surprise!' I was completely shocked and so touched that they planned this whole thing. They even got my favorite cake from that bakery across town. Spent the whole evening laughing, sharing stories, and feeling so loved. These are the moments that make life special.",
    summary:
      "Completely surprised and touched by friends organizing an amazing birthday celebration",
    reason:
      "Expresses joy and gratitude for friendship and celebration, with positive emotions about being valued and loved.",
  },
  {
    mood: Mood.EXCITED,
    title: "New Apartment Keys",
    text: "Finally got the keys to my new apartment! After months of searching and saving, I'm officially a homeowner! Well, apartment owner, but still! I spent the whole day just walking around the empty rooms, planning where everything will go. The kitchen has this huge window that gets morning light, and the bedroom is the perfect size for my bed and desk. I can't wait to start decorating and making it truly mine. This is such a huge milestone!",
    summary:
      "Thrilled about finally getting keys to new apartment after months of searching",
    reason:
      "Shows excitement about achieving a major life goal, with enthusiastic planning and anticipation for the future.",
  },
  {
    mood: Mood.ANXIOUS,
    title: "Medical Test Results",
    text: "Waiting for the test results is killing me. The doctor said it would take 3-5 business days, and it's been four. Every time my phone rings, my heart jumps thinking it might be them. I've been trying to stay busy, but my mind keeps going to worst-case scenarios. I know the chances are good that everything is fine, but that small possibility of bad news is consuming my thoughts. I hate this feeling of uncertainty.",
    summary:
      "Extremely anxious while waiting for important medical test results",
    reason:
      "Describes the anxiety of waiting for potentially life-changing news, with physical symptoms and intrusive worried thoughts.",
  },
  {
    mood: Mood.SAD,
    title: "End of Friendship",
    text: "Had the conversation I've been dreading with Sarah today. Our friendship has been strained for months, and we finally admitted that we've grown apart. It wasn't a fight or anything dramatic - just the slow realization that we're different people now than we were in college. She's moving to another state for work, and I think we both know this is probably goodbye. It's strange how relationships can just fade away even when there's still love there.",
    summary:
      "Feeling melancholy about the natural end of a long friendship due to growing apart",
    reason:
      "Expresses sadness about the loss of a meaningful relationship, with acceptance but still grief over the change.",
  },
  {
    mood: Mood.GRATEFUL,
    title: "Community Support",
    text: "The response to my mom's medical bills fundraiser has been absolutely overwhelming. People from my high school, old coworkers, even neighbors I barely know have donated. Someone I haven't spoken to in years sent a message saying how much my mom meant to them when she was their teacher. It's incredible how a crisis can reveal how connected we all are. I'm crying writing this - not from sadness, but from pure gratitude for human kindness.",
    summary:
      "Overwhelmed with gratitude for community support during family medical crisis",
    reason:
      "Shows deep appreciation for unexpected support from community, expressing moved emotions about human connection and kindness.",
  },
  {
    mood: Mood.PEACEFUL,
    title: "Morning Beach Walk",
    text: "Woke up early and drove to the beach to watch the sunrise. There's something magical about having the entire shore to yourself in those early morning hours. The waves were gentle, the air was crisp, and seagulls were the only other early risers. I collected a few shells and just sat on a piece of driftwood, watching the world wake up. No phone, no distractions - just me and the ocean. These moments reset my soul.",
    summary: "Found deep tranquility during a solitary sunrise beach walk",
    reason:
      "Describes a serene, meditative experience in nature that brought inner peace and spiritual renewal.",
  },
  {
    mood: Mood.FRUSTRATED,
    title: "Bureaucratic Nightmare",
    text: "Spent the entire day trying to get my passport renewed, and it's like they designed the system to be as difficult as possible. First office sent me to the second office, who sent me back to the first office because I was missing Form X, which no one mentioned I needed. Then discovered the notary closes at 3 PM on Wednesdays. Had to take another day off work just to complete this simple task. Why does everything government-related have to be so unnecessarily complicated?",
    summary:
      "Extremely frustrated with inefficient government bureaucracy while trying to renew passport",
    reason:
      "Expresses anger and frustration with systemic inefficiencies and wasted time navigating bureaucratic obstacles.",
  },
  {
    mood: Mood.WORRIED,
    title: "Teenage Daughter",
    text: "Emma came home two hours past curfew last night and won't tell me where she was. She's been so secretive lately, and I'm worried she's getting involved with the wrong crowd. I remember being her age and thinking my parents didn't understand, but as a parent now, I see how scary it is to watch your child pull away. How do I balance giving her independence with keeping her safe? I feel like I'm failing at this whole parenting thing.",
    summary:
      "Concerned about teenage daughter's secretive behavior and breaking curfew",
    reason:
      "Shows parental worry about child's safety and behavior changes, expressing self-doubt about parenting decisions.",
  },
  {
    mood: Mood.CONTENT,
    title: "Garden Harvest",
    text: "Picked the first tomatoes from my garden today! They're still warm from the sun and smell incredible. There's something deeply satisfying about eating food you grew yourself. I started this garden as a pandemic project, and now it's become one of my favorite parts of the day - watering, weeding, watching things grow. Made a simple salad with the tomatoes, basil, and lettuce from the garden. It tasted like summer itself.",
    summary:
      "Feeling satisfied and connected to nature through first garden harvest",
    reason:
      "Expresses contentment with simple pleasures and the satisfaction of self-sufficiency through gardening.",
  },
  {
    mood: Mood.ANGRY,
    title: "Parking Ticket Injustice",
    text: "Got a $75 parking ticket even though I was parked legally! The meter was broken - it wouldn't take coins, cards, or even the app payment. I left a note on my windshield explaining the situation, but apparently that means nothing to the parking enforcement. Spent an hour on the phone with the city trying to contest it, only to be told I need to appear in court during business hours. This is highway robbery disguised as municipal service!",
    summary:
      "Furious about receiving unjust parking ticket due to broken meter",
    reason:
      "Shows anger about perceived injustice and frustration with inflexible bureaucratic systems that penalize citizens unfairly.",
  },
];

// Function to generate random dates within the last 3 months
function getRandomDate() {
  const now = new Date();
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const randomTime =
    threeMonthsAgo.getTime() +
    Math.random() * (now.getTime() - threeMonthsAgo.getTime());
  return new Date(randomTime);
}

// Sample user data
const sampleUsers = [
  {
    id: "user_test_001",
    email: "alice.smith@example.com",
    name: "Alice Smith",
    imageUrl: "https://api.dicebear.com/6.x/personas/svg?seed=alice",
  },
  {
    id: "user_test_002",
    email: "bob.johnson@example.com",
    name: "Bob Johnson",
    imageUrl: "https://api.dicebear.com/6.x/personas/svg?seed=bob",
  },
  {
    id: "user_test_003",
    email: "carol.davis@example.com",
    name: "Carol Davis",
    imageUrl: "https://api.dicebear.com/6.x/personas/svg?seed=carol",
  },
];

async function seed() {
  console.log("🌱 Starting seed process...");

  // Clear existing data
  await prisma.journal.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleared existing data");

  // Create users
  const createdUsers = [];
  for (const userData of sampleUsers) {
    const user = await prisma.user.create({
      data: userData,
    });
    createdUsers.push(user);
    console.log(`👤 Created user: ${user.name}`);
  }

  // Create journal entries for each user
  let totalEntries = 0;
  for (const user of createdUsers) {
    // Each user gets 15-25 random journal entries
    const entryCount = Math.floor(Math.random() * 11) + 15; // 15-25 entries
    const userJournalIds = [];

    for (let i = 0; i < entryCount; i++) {
      // Pick a random journal entry template
      const template =
        journalEntries[Math.floor(Math.random() * journalEntries.length)];

      // Create content object with metadata
      const content = {
        text: template.text,
        analysis: {
          mood: template.mood.toLowerCase(),
          summary: template.summary,
          reason: template.reason,
        },
        metadata: {
          wordCount: template.text.trim().split(/\s+/).length,
          characterCount: template.text.length,
          createdAt: new Date().toISOString(),
        },
      };

      const journal = await prisma.journal.create({
        data: {
          userId: user.id,
          title: template.title,
          content: content,
          mood: template.mood,
          summary: template.summary,
          createdAt: getRandomDate(),
          updatedAt: new Date(),
        },
      });

      userJournalIds.push(journal.id);
      totalEntries++;
    }

    // Update user with journal IDs
    await prisma.user.update({
      where: { id: user.id },
      data: {
        journalIds: userJournalIds,
        updatedAt: new Date(),
      },
    });

    console.log(`📓 Created ${entryCount} journal entries for ${user.name}`);
  }

  console.log("========= 🌱 Seed Results =========");
  console.log(`👥 Users created: ${createdUsers.length}`);
  console.log(`📚 Total journal entries: ${totalEntries}`);
  console.log("✅ Seed completed successfully!");

  prettyPrint({
    users: createdUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
    })),
    totalJournals: totalEntries,
    moodsIncluded: [...new Set(journalEntries.map((j) => j.mood))],
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Seed failed:", error);
    await prisma.$disconnect();
    exit(1);
  });
