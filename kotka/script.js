// Pocket Vyley: a tiny tamagotchi starring a developer kotka, the aspect of twilight.

const SAVE_KEY = "pocket-vyley-v1";
const STATS = ["food", "energy", "tidy", "joy"];
const STAT_NAMES = { food: "snacks", energy: "energy", tidy: "tidiness", joy: "joy" };

// points lost per minute (energy is regained while sleeping)
const DECAY = { food: 0.6, energy: 0.4, tidy: 0.35, joy: 0.55 };
const SLEEP_REGEN = 3;

const LEVEL_TITLES = [
  [1, "Dusk Kitten"],
  [3, "Junior Dev"],
  [5, "Twilight Coder"],
  [8, "Senior Night Owl"],
  [12, "Staff Engineer of Stars"],
  [15, "Aspect of Twilight"],
];

const FOODS = [
  { id: "banitsa", emoji: "🥐", name: "Banitsa", desc: "flaky, cheesy, perfect", food: 26, joy: 6 },
  { id: "ayran", emoji: "🥛", name: "Ayran", desc: "наздраве!", food: 10, joy: 4, energy: 4 },
  { id: "shopska", emoji: "🥗", name: "Shopska salad", desc: "extra sirene on top", food: 18, joy: 3 },
  { id: "lyutenitsa", emoji: "🍞", name: "Lyutenitsa toast", desc: "grandma's recipe", food: 16, joy: 8 },
  { id: "kozunak", emoji: "🍰", name: "Kozunak slice", desc: "sweet and fluffy", food: 20, joy: 10 },
  { id: "kebapche", emoji: "🌭", name: "Kebapcheta with fries", desc: "with sirene on the fries, obviously", food: 30, joy: 8 },
  { id: "mekitsa", emoji: "🥯", name: "Mekitsa", desc: "with powdered sugar", food: 18, joy: 10 },
  { id: "tarator", emoji: "🥒", name: "Tarator", desc: "cold soup for a hot day", food: 12, joy: 4, energy: 4 },
  { id: "sarmi", emoji: "🥬", name: "Sarmi", desc: "little rice blankets", food: 24, joy: 6 },
  { id: "kiselo", emoji: "🥣", name: "Kiselo mlyako", desc: "real Bulgarian yogurt", food: 12, joy: 4, tidy: 4 },
  { id: "boza", emoji: "🥤", name: "Boza", desc: "thick, sweet, a bit weird", food: 10, joy: 8 },
  { id: "curry", emoji: "🍛", name: "Curry", desc: "warm and spicy", food: 28, joy: 10 },
  { id: "tuna", emoji: "🐟", name: "Tuna", desc: "it's a cat thing", food: 22, joy: 10 },
  { id: "treats", emoji: "🍬", name: "Kitty treats", desc: "*shakes bag*", food: 8, joy: 14 },
  { id: "coffee", emoji: "☕", name: "Coffee", desc: "developer fuel", food: 3, energy: 18, joy: 2 },
  { id: "redbull", emoji: "🥫", name: "Red Bull", desc: "zoomies in a can", food: 2, energy: 30, joy: 4, tidy: -6 },
  { id: "tikvenik", emoji: "🎃", name: "Tikvenik", desc: "pumpkin pastry, only around Halloween", food: 22, joy: 12, season: "halloween" },
];

// drinks can still go down when Vyley is full
const DRINKS = ["coffee", "ayran", "redbull", "boza", "tarator"];

const FOOD_REACTIONS = {
  banitsa: "баницаааа! :3",
  ayran: "наздраве! 🥛",
  shopska: "the cheese snow is the best part.",
  lyutenitsa: "tastes like grandma's kitchen.",
  kozunak: "sweet and fluffy. like me.",
  tuna: "TUNA. finally. justice.",
  treats: "*sprints in from another room*",
  coffee: "*eyes go wide* I can hear colours now.",
  kebapche: "kebapcheta?? I'd marry you. (wait, I'm already married.)",
  mekitsa: "powdered sugar on my whiskers now. no regrets.",
  tarator: "cold tarator. the cucumber knows what it did.",
  sarmi: "sarmi! like my grandma's. don't tell her I said that.",
  kiselo: "the bacteria are literally named after Bulgaria. fun fact.",
  boza: "boza! nobody outside Bulgaria understands. that's fine.",
  curry: "curry night! warm, spicy, like a hug with opinions.",
  redbull: "*vibrates* I CAN SEE THROUGH TIME",
  tikvenik: "tikvenik! pumpkin, walnuts, cinnamon. this is what October is for. 🎃",
};

const TASKS = [
  {
    id: "mug", name: "Knock a mug off the desk", secs: 10, minLevel: 1, xp: 8,
    cost: { energy: 2, tidy: 8 }, gain: { joy: 6 },
    outputs: [
      "*looks at you*\n*pushes mug slowly toward the edge*\n*keeps eye contact*\n\n💥\n\nNo regrets. It was in my way.",
      "It was a test of gravity.\nGravity still works. You're welcome.\nTicket closed: WONTFIX (the mug).",
    ],
  },
  {
    id: "pr", name: "Review a one-line PR", secs: 20, minLevel: 1, xp: 12,
    cost: { energy: 4 }, gain: {},
    outputs: [
      "Left 14 comments on a 1-line change.\nApproved it anyway. It was a good line.",
      "LGTM 🐾\n(I stepped on the approve button. But it really did look good.)",
    ],
  },
  {
    id: "commit", name: "Write a good commit message", secs: 25, minLevel: 1, xp: 12,
    cost: { energy: 4 }, gain: { joy: 2 },
    outputs: [
      "fix: stuff\n\n…okay, okay.\n\nfix(auth): stop logging users out when the cat sits on F5",
      "feat: add mrrp\n\nBREAKING CHANGE: everything now purrs.",
    ],
  },
  {
    id: "standup", name: "Sit on the keyboard during standup", secs: 30, minLevel: 1, xp: 15,
    cost: { energy: 3, tidy: 6 }, gain: { joy: 8 },
    outputs: [
      "Status update: asdfjkl;;;;;;;;;;;;;;;;;;;;;;\n\nThe team said it was the most honest update all sprint.",
      "Yesterday: nap.\nToday: nap, then maybe code.\nBlockers: someone is sitting in my sunbeam.",
    ],
  },
  {
    id: "flaky", name: "Fix a flaky test", secs: 45, minLevel: 1, xp: 25,
    cost: { energy: 10, tidy: 12 }, gain: {},
    outputs: [
      "Root cause: the test depended on the time of day.\nIt only passed at twilight. Honestly? Relatable.\nMocked the clock. Green every time now.",
      "Two tests were sharing a temp folder and fighting over it.\nGave them each their own box.\nThey're friends now. Cats understand boxes.",
    ],
  },
  {
    id: "duck", name: "Rubber-duck debug (the duck is nervous)", secs: 90, minLevel: 2, xp: 35,
    cost: { energy: 8 }, gain: { joy: 10 },
    outputs: [
      "Explained the whole bug to the rubber duck.\nFound it halfway through: an off-by-one error.\nThe duck has asked to be moved to a different team.",
    ],
  },
  {
    id: "love", name: "Write my husband a love note in code", secs: 120, minLevel: 2, xp: 40,
    cost: { energy: 6 }, gain: { joy: 18 },
    outputs: [
      "while (true) {\n  love(yoan);\n}\n\n// not a bug. it's meant to run forever. 💜",
      "const heart = new Map();\nheart.set(\"husband\", Infinity);\n\n// tested it. still works. every single day.",
    ],
  },
  {
    id: "div", name: "Center a div for my husband", secs: 120, minLevel: 2, xp: 45,
    cost: { energy: 12, tidy: 15 }, gain: { joy: 8 },
    outputs: [
      "display: grid;\nplace-items: center;\n\nThat's it. That's the whole thing.\nMy husband still says frontend is the worst. I'm working on it.",
      "Tried margin: auto, flexbox, and one table (don't ask).\nGrid won.\nThe div is centered. Peace has returned to the house.",
    ],
  },
  {
    id: "rack", name: "Nap on the server rack (it's warm)", secs: 360, minLevel: 2, xp: 20,
    cost: { food: 8 }, gain: { energy: 35, joy: 6 },
    outputs: [
      "Found the warmest server in the rack.\nSlept six minutes and purred at a frequency that somehow improved uptime.\nOps can't explain it. I can.",
    ],
  },
  {
    id: "yaml", name: "Untangle a 900-line YAML file", secs: 180, minLevel: 3, xp: 70,
    cost: { energy: 18, food: 10, tidy: 20 }, gain: {},
    outputs: [
      "Found it: line 612 had one extra space.\nThe whole deployment was sad because of one space.\nI hissed at it. It's fixed now.",
      "It was 900 lines because one block was copy-pasted 14 times.\nIt's 120 lines now, with anchors.\nThe YAML feels lighter. So do I.",
    ],
  },
  {
    id: "leak", name: "Chase a memory leak", secs: 180, minLevel: 3, xp: 70,
    cost: { energy: 20 }, gain: { joy: 10 },
    outputs: [
      "Hunted it through three services and a cache that never forgets.\nCaught it under the couch: an event listener nobody ever removed.\n*drops it at your feet* for you.",
    ],
  },
  {
    id: "bongo", name: "Pair-program with the bongo cat", secs: 120, minLevel: 3, xp: 45,
    cost: { energy: 10 }, gain: { joy: 15 },
    outputs: [
      "We wrote 400 lines, all in perfect rhythm.\nNone of them compile.\nBest pairing session of my life. 🎵",
    ],
  },
  {
    id: "bg", name: "Translate the app into Bulgarian", secs: 240, minLevel: 4, xp: 85,
    cost: { energy: 15, tidy: 15 }, gain: {},
    outputs: [
      "Done! Every string translated.\n\n\"Submit\" → \"Изпрати\"\n\"Cancel\" → \"Откажи\"\n\"Error\" → \"Мяу\"\n\nThat last one was a creative choice.",
    ],
  },
  {
    id: "friday", name: "Deploy to production on a Friday", secs: 300, minLevel: 4, xp: 100,
    cost: { energy: 25, food: 10, joy: 10 }, gain: {},
    outputs: [
      "Deployed at 16:58.\nEverything was fine.\nEverything is still fine.\n\n…I'm going to keep staring at the dashboards for a while. Just in case.",
    ],
  },
  {
    id: "readme", name: "Read the entire README", secs: 300, minLevel: 5, xp: 90,
    cost: { energy: 12, tidy: 20 }, gain: { joy: 4 },
    outputs: [
      "Every question I had this week was answered in the README.\nIt's always in the README.\nI'm going to sit on it now. It's warm from the printer.",
    ],
  },
  {
    id: "monolith", name: "Refactor a legacy monolith", secs: 600, minLevel: 5, xp: 180,
    cost: { energy: 35, food: 25, tidy: 35, joy: 5 }, gain: {},
    outputs: [
      "Split it into 6 services, 41 files and one very long PR description.\nLeft the comment that says '// don't touch this, it works' exactly where it was.\nSome things deserve respect.",
    ],
  },
  {
    id: "garden", name: "Hunt bugs in the garden at dusk", secs: 480, minLevel: 6, xp: 130,
    cost: { energy: 20, food: 10 }, gain: { joy: 20 },
    outputs: [
      "Caught: 3 moths, 1 beetle, 0 software bugs.\nThe garden went purple and gold and very quiet.\nThe real bugs can wait until morning.",
    ],
  },
  {
    id: "stars", name: "Stargaze from the rooftop", secs: 1200, minLevel: 7, xp: 160,
    cost: { energy: 10 }, gain: { joy: 35 },
    outputs: [
      "Counted stars until the numbers got silly.\nFound my favourite one. It's a little bit purple.\nI named it after you. Don't tell anyone.",
    ],
  },
  {
    id: "ship", name: "Ship v1.0 of a side project", secs: 900, minLevel: 8, xp: 260,
    cost: { energy: 40, food: 30, tidy: 30 }, gain: { joy: 25 },
    outputs: [
      "It's live! A tiny app that tells you when it's twilight wherever you are.\nThree users so far: me, Yoan and the bongo cat.\nPerfect launch.",
    ],
  },
  {
    id: "vitosha", name: "Watch the twilight from Vitosha", secs: 1800, minLevel: 10, xp: 320,
    cost: { energy: 30, food: 20, tidy: 20 }, gain: { joy: 50 },
    outputs: [
      "Climbed all the way up Vitosha.\nSofia turned gold, then pink, then violet, then a thousand little lights.\nThat in-between moment is my favourite thing in the world.\nMaybe that's why they call me the aspect of twilight. 🌙",
    ],
  },

  // ----- dev life -----
  {
    id: "varname", name: "Name a variable", secs: 15, minLevel: 1, xp: 10,
    cost: { energy: 3 }, gain: {},
    outputs: [
      "Considered: data, data2, thing, x, kotka.\nWent with `vyleysFavouriteNumber`.\nIt's a boolean. Don't ask.",
      "Spent 15 seconds on it. Felt like 15 years.\nNamed it `temp`. It will be in production forever.",
    ],
  },
  {
    id: "nodemods", name: "Delete node_modules", secs: 20, minLevel: 1, xp: 10,
    cost: { energy: 2 }, gain: { tidy: 10, joy: 4 },
    outputs: [
      "rm -rf node_modules\n\nFreed 4.2 GB.\nThe laptop sighed with relief. So did I.",
    ],
  },
  {
    id: "slack", name: "Answer a “quick question” on Slack", secs: 40, minLevel: 1, xp: 18,
    cost: { energy: 8, joy: 4 }, gain: {},
    outputs: [
      "It was not a quick question.\nIt was 47 messages, two diagrams and a call.\nWe solved it though. I'm going to lie down.",
      "\"hey, quick question\"\n…\n\"actually never mind, figured it out\"\n\nThe best kind of quick question.",
    ],
  },
  {
    id: "shop", name: "Run to the corner shop for Red Bull", secs: 30, minLevel: 1, xp: 10,
    cost: { food: 4 }, gain: { energy: 20 },
    outputs: [
      "The lady at the shop said \"пак ли?\" (again?)\nYes. Again. Two cans.\nWe're not going to talk about it.",
    ],
  },
  {
    id: "merge", name: "Resolve merge conflicts", secs: 90, minLevel: 2, xp: 35,
    cost: { energy: 12, tidy: 10 }, gain: {},
    outputs: [
      "<<<<<<< HEAD\nmy code\n=======\nyour code\n>>>>>>> main\n\nKept both. Then deleted both. Then wrote a third version. It works.",
    ],
  },
  {
    id: "tests", name: "Write unit tests", secs: 100, minLevel: 2, xp: 35,
    cost: { energy: 10 }, gain: {},
    outputs: [
      "Wrote 23 tests and found 2 real bugs.\nAlso found out the old tests were checking that true === true.\nThey passed every time. Impressive, honestly.",
    ],
  },
  {
    id: "wifi", name: "Fix my husband's Wi-Fi", secs: 60, minLevel: 2, xp: 30,
    cost: { energy: 6 }, gain: { joy: 10 },
    outputs: [
      "Turned the router off.\nTurned it back on.\nMy husband thinks I'm a genius. I won't be correcting this.",
    ],
  },
  {
    id: "stream", name: "Keep my husband company on stream", secs: 150, minLevel: 2, xp: 40,
    cost: { energy: 8 }, gain: { joy: 20 },
    outputs: [
      "Walked across the keyboard live on Twitch.\nChat spammed 🐱 for five whole minutes.\nI'm clearly the main character of that channel now.",
      "Sat on the desk right in front of the camera for an hour.\nChat kept asking for the kotka.\nMy husband is the streamer. I'm the star. We both know it.",
    ],
  },
  {
    id: "horo", name: "Dance horo at the office party", secs: 90, minLevel: 2, xp: 35,
    cost: { energy: 14, food: 6 }, gain: { joy: 18 },
    outputs: [
      "Joined paws with the whole team and danced horo.\nThe backend team kept missing the beat.\nThe DevOps people led the line like naturals. Наздраве! 💃",
    ],
  },
  {
    id: "deps", name: "Upgrade all dependencies", secs: 150, minLevel: 3, xp: 55,
    cost: { energy: 15, tidy: 15 }, gain: {},
    outputs: [
      "Upgraded 214 packages.\n3 breaking changes, 1 deprecated API, and a library that got renamed for no reason.\nEverything's green again. Nobody touch package.json for a week.",
    ],
  },
  {
    id: "dns", name: "Debug a mysterious outage", secs: 180, minLevel: 3, xp: 65,
    cost: { energy: 18, joy: 5 }, gain: {},
    outputs: [
      "It was DNS.\n\nIt's always DNS.\n\nEven when it isn't DNS, it's DNS.",
    ],
  },
  {
    id: "curry", name: "Cook curry for my husband", secs: 150, minLevel: 3, xp: 45,
    cost: { energy: 10, tidy: 15 }, gain: { food: 25, joy: 15 },
    outputs: [
      "Chopped, stirred, tasted, tasted again (quality control).\nMy husband had two bowls and said it was the best one yet.\nThe kitchen looks like a crime scene. Worth it. 🍛",
    ],
  },
  {
    id: "nod", name: "Explain the Bulgarian head nod to a foreigner", secs: 120, minLevel: 3, xp: 45,
    cost: { energy: 8 }, gain: { joy: 10 },
    outputs: [
      "Nodding means no. Shaking your head means yes.\nThey nodded to show they understood.\nSo… they didn't? We're still working it out.",
    ],
  },
  {
    id: "cert", name: "Renew an expired SSL certificate", secs: 120, minLevel: 4, xp: 55,
    cost: { energy: 12 }, gain: {},
    outputs: [
      "The cert expired at midnight. On a Saturday. Of course.\nRenewed it and set up auto-renew so this never happens again.\nThis will happen again.",
    ],
  },
  {
    id: "terraform", name: "Read a terraform plan that says “47 to destroy”", secs: 200, minLevel: 4, xp: 80,
    cost: { energy: 20, joy: 8 }, gain: {},
    outputs: [
      "Panicked for 3 seconds.\nIt was just a renamed module. Nothing real gets destroyed.\nStill aged about 4 cat years.",
    ],
  },
  {
    id: "obshtina", name: "Get one stamp from the municipality", secs: 420, minLevel: 4, xp: 70,
    cost: { energy: 25, joy: 15 }, gain: {},
    outputs: [
      "Window 3 sent me to window 7.\nWindow 7 was on a coffee break. Then lunch.\nCame back with the stamp. Every Bulgarian understands what that took.",
    ],
  },
  {
    id: "oncall", name: "Survive a 3am on-call shift", secs: 360, minLevel: 5, xp: 120,
    cost: { energy: 35, food: 10, joy: 5 }, gain: {},
    outputs: [
      "The alert said CRITICAL. It was a disk at 81%.\nCleaned up some logs, silenced the alarm, fell asleep on the keyboard.\nThe terminal now has 400 lines of 'zzzzzzzzz'.",
    ],
  },
  {
    id: "kasmeti", name: "Bake banitsa with lucky charms (късмети)", secs: 240, minLevel: 5, xp: 80,
    cost: { energy: 12, tidy: 20 }, gain: { food: 20, joy: 15 },
    outputs: [
      "Hid a little fortune in every piece.\nMy husband's said: \"A big adventure is coming.\"\nMine said: \"Health.\" I'll take both. 🥐",
      "My husband's fortune: \"Love all year.\"\nMine: \"A promotion.\"\nI've already told my manager. They seemed confused.",
    ],
  },
  {
    id: "surprise", name: "Plan a surprise for my husband", secs: 600, minLevel: 6, xp: 150,
    cost: { energy: 20, tidy: 10 }, gain: { joy: 40 },
    outputs: [
      "Planned the whole thing in secret: candles, Yoan's favourite food, a playlist.\n…wait, Yoan can read this report.\nNothing! I planned nothing! Act surprised later. 💜",
    ],
  },
  {
    id: "k8s", name: "Migrate everything to Kubernetes", secs: 720, minLevel: 6, xp: 200,
    cost: { energy: 40, food: 20, tidy: 30 }, gain: {},
    outputs: [
      "Wrote 1,200 lines of YAML to run a 40-line app.\nIt autoscales now. Beautifully. To 1 pod.\nMy husband says this is what DevOps is. Very convincing.",
    ],
  },
  {
    id: "martenitsa", name: "Tie a martenitsa on a blooming tree", secs: 300, minLevel: 6, xp: 90,
    cost: { energy: 10 }, gain: { joy: 25 },
    outputs: [
      "Saw the first stork, so the martenitsa went on a blossoming tree.\nRed and white everywhere. Health and luck for everyone.\nЧестита Баба Марта! 🔴⚪",
    ],
  },
  {
    id: "varna", name: "Weekend at the seaside in Varna", secs: 1500, minLevel: 7, xp: 220,
    cost: { energy: 15, food: 15, tidy: 25 }, gain: { joy: 45 },
    outputs: [
      "Sand in my fur. Salt on my whiskers.\nAte grilled fish by the Black Sea and watched the sky go pink over the water.\nI don't want to go back to Sofia. (I'll go back to Sofia.)",
    ],
  },
  {
    id: "monastery", name: "Visit Rila Monastery", secs: 900, minLevel: 8, xp: 180,
    cost: { energy: 20, food: 10 }, gain: { joy: 30 },
    outputs: [
      "Striped arches, painted ceilings, mountains all around.\nIt was so quiet I could hear my own purr echo.\nLit a candle for the two of us.",
    ],
  },
  {
    id: "lakes", name: "Hike to the Seven Rila Lakes", secs: 1800, minLevel: 9, xp: 300,
    cost: { energy: 40, food: 25, tidy: 20 }, gain: { joy: 50 },
    outputs: [
      "Seven lakes, each one bluer than the last:\nthe Tear, the Eye, the Kidney, the Twin, the Trefoil, the Fish and the Lower Lake.\nI'm tired, sunburnt and very, very happy. 🏞️",
    ],
  },

  // ----- halloween (only on the board around 31 October) -----
  {
    id: "trick", name: "Go trick-or-treating", secs: 60, minLevel: 1, xp: 25, season: "halloween",
    cost: { energy: 8 }, gain: { joy: 15, food: 6 },
    outputs: [
      "Went door to door dressed as a tiny pumpkin.\nGot 4 chocolates, 1 apple and a confused look from the neighbour who doesn't do Halloween.\nShared the chocolates with my husband. (Most of them.) 🎃",
      "\"Trick or treat!\"\nThey said treat. I took the treat AND did a trick (knocked their pumpkin off the step).\nBest of both worlds.",
    ],
  },
  {
    id: "pumpkin", name: "Carve a pumpkin with my husband", secs: 90, minLevel: 1, xp: 35, season: "halloween",
    cost: { energy: 6, tidy: 15 }, gain: { joy: 14 },
    outputs: [
      "Carved a little cat face into it. Ears and everything.\nSaved the insides for tikvenik. Nothing goes to waste in this house.\nIt's the best pumpkin on the street. It looks like me, so obviously.",
      "My husband carved a scary face. I carved a :3 face.\nWe put them next to each other on the windowsill.\nThat's us. That's the whole marriage.",
    ],
  },
  {
    id: "kukeri", name: "Scare off spirits with the kukeri", secs: 180, minLevel: 3, xp: 70, season: "halloween",
    cost: { energy: 18, food: 8 }, gain: { joy: 20 },
    outputs: [
      "Halloween is cute, but Bulgaria has kukeri: huge furry costumes, scary masks and giant bells.\nI joined in wearing my bell collar. The bad spirits left. So did the neighbour's dog.\nДрън-дрън. 🔔",
    ],
  },
];

// stretch the base lengths above: quick tickets get noticeably longer, long ones only a little,
// and bump xp to match (most tickets land around 16-24 xp per minute)
for (const t of TASKS) {
  const secs = t.secs * 1.3 + 30;
  t.secs = secs < 120 ? Math.round(secs / 5) * 5 : Math.round(secs / 30) * 30;
  t.xp = Math.round(t.xp * 1.5);
}

// tickets that count towards "Best wife ever"
const SWEET_TASKS = ["love", "div", "wifi", "stream", "curry", "kasmeti", "surprise"];

const WARDROBE = [
  { id: "none", name: "Nothing", desc: "just fur", lv: 1 },
  { id: "bow", name: "Pink bow", desc: "a classic", lv: 1 },
  { id: "glasses", name: "Dev glasses", desc: "+10 to code review", lv: 2 },
  { id: "headphones", name: "Headphones", desc: "lofi beats to debug to", lv: 3 },
  { id: "scarf", name: "Cozy scarf", desc: "for Sofia winters", lv: 4 },
  { id: "beanie", name: "Beanie", desc: "hides the ears. scandalous.", lv: 5 },
  { id: "martenitsa", name: "Martenitsa", desc: "red and white, for health and luck", lv: 6 },
  { id: "flowers", name: "Flower crown", desc: "spring in the Rose Valley", lv: 7 },
  { id: "crown", name: "Twilight crown", desc: "fit for an aspect of twilight", lv: 10 },
  { id: "collar", name: "Bell collar", desc: "you'll always hear me coming", lv: 3 },
  { id: "bandana", name: "Red bandana", desc: "rebel developer energy", lv: 5 },
  { id: "witch", name: "Twilight witch hat", desc: "casts `git revert` on bad days", lv: 9 },
  { id: "sunglasses", name: "Sunglasses", desc: "deal with it", trophy: "redbull" },
  { id: "chef", name: "Chef hat", desc: "for curry nights", trophy: "gourmet" },
  { id: "propeller", name: "Propeller cap", desc: "for debugging at altitude", trophy: "dns" },
  { id: "party", name: "Party hat", desc: "every release is a party", trophy: "tickets25" },
  { id: "rose", name: "Kazanlak rose", desc: "a gift from my husband", trophy: "wifey" },
  { id: "pumpkin", name: "Pumpkin hat", desc: "a tiny jack-o'-lantern :3", trophy: "trickortreat" },
];

// backgrounds for the screen; the rest unlock with levels or by finishing a ticket
const ROOMS = [
  { id: "twilight", name: "Twilight sky", desc: "where it all began", lv: 1 },
  { id: "cave", name: "Dev cave", desc: "lights off, monitor on, RGB on everything", lv: 3 },
  { id: "servers", name: "Server room", desc: "warm racks and blinking lights", ticket: "rack" },
  { id: "varna", name: "Black Sea at Varna", desc: "sunset over the water", ticket: "varna" },
  { id: "vitosha", name: "Vitosha at dusk", desc: "Sofia's lights far below", ticket: "vitosha" },
];

function roomUnlocked(r) {
  return r.ticket ? state.counts.doneIds.includes(r.ticket) : state.level >= r.lv;
}

function wardrobeUnlocked(w) {
  return w.trophy ? state.trophies.includes(w.trophy) : state.level >= w.lv;
}

const TROPHIES = [
  { id: "hello", icon: "👋", name: "Hello, world", desc: "Close your first ticket" },
  { id: "tickets10", icon: "🎫", name: "Sprint survivor", desc: "Close 10 tickets" },
  { id: "tickets25", icon: "🏅", name: "Ticket machine", desc: "Close 25 tickets" },
  { id: "lv5", icon: "⭐", name: "Promoted", desc: "Reach level 5" },
  { id: "lv10", icon: "🌟", name: "Senior kotka", desc: "Reach level 10" },
  { id: "banitsa", icon: "🥐", name: "Banitsa enjoyer", desc: "Eat 5 banitsas" },
  { id: "tickets50", icon: "👑", name: "Tech lead", desc: "Close 50 tickets" },
  { id: "coffee", icon: "☕", name: "Fueled by coffee", desc: "Drink 10 coffees" },
  { id: "redbull", icon: "⚡", name: "Zoomies", desc: "Drink 5 Red Bulls" },
  { id: "gourmet", icon: "🍽️", name: "Gourmet kotka", desc: "Taste every snack at least once" },
  { id: "dns", icon: "🌐", name: "It's always DNS", desc: "Debug a mysterious outage" },
  { id: "horo", icon: "💃", name: "Horo master", desc: "Dance horo at the office party" },
  { id: "babamarta", icon: "🌸", name: "Честита Баба Марта", desc: "Tie a martenitsa on a blooming tree" },
  { id: "lakes", icon: "🏞️", name: "Seven lakes", desc: "Hike to the Seven Rila Lakes" },
  { id: "wifey", icon: "💜", name: "Best wife ever", desc: "Do 5 sweet things for her husband" },
  { id: "married", icon: "💍", name: "Happily married", desc: "Do 15 sweet things for her husband" },
  { id: "workaholic", icon: "🗂️", name: "Workaholic", desc: "Close 100 tickets" },
  { id: "zone", icon: "🎯", name: "Flow state", desc: "Finish 10 tickets while in the zone" },
  { id: "tour", icon: "🗺️", name: "Tour of Bulgaria", desc: "Visit Varna, Rila Monastery, the Seven Lakes and Vitosha" },
  { id: "coworkers", icon: "🎵", name: "Coworkers", desc: "Pair-program with the bongo cat" },
  { id: "laserlegend", icon: "💫", name: "Laser legend", desc: "Catch the laser 10 times in one game" },
  { id: "lucky", icon: "🍀", name: "Lucky streak", desc: "Win which-paw 5 times in a row" },
  { id: "swatted", icon: "😾", name: "Personal space", desc: "Pet Vyley until she swats you" },
  { id: "sleepyhead", icon: "😴", name: "Sleepyhead", desc: "Let Vyley nap until fully rested" },
  { id: "clean", icon: "🫧", name: "Squeaky clean", desc: "Groom 20 times" },
  { id: "yarn", icon: "🧶", name: "Yarn addict", desc: "Play with the yarn 15 times" },
  { id: "baron", icon: "🥮", name: "Banitsa baron", desc: "Eat 25 banitsas" },
  { id: "dressed", icon: "👗", name: "Dressed to impress", desc: "Wear 5 different outfits" },
  { id: "golden", icon: "🌇", name: "Golden hour", desc: "Hang out with Vyley at twilight (18:00–21:00)" },
  { id: "getwell", icon: "🩺", name: "Get well soon", desc: "Nurse Vyley back to health" },
  { id: "garlic", icon: "🧄", name: "Village medicine", desc: "Cure Vyley with raw garlic" },
  { id: "grownup", icon: "🐈", name: "All grown up", desc: "Raise Vyley into an adult" },
  { id: "starlit", icon: "✨", name: "Starlit", desc: "Raise a Starlit Empress (2 or fewer care mistakes)" },
  { id: "gremlin", icon: "👹", name: "Gremlin tamer", desc: "Raise a Chaos Gremlin" },
  { id: "perfect", icon: "🏵️", name: "Perfect parent", desc: "Grow up with zero care mistakes" },
  { id: "lofi", icon: "🎧", name: "Beats to debug to", desc: "Listen to lofi with Vyley" },
  { id: "lv15", icon: "🌙", name: "Aspect of Twilight", desc: "Reach level 15" },
  { id: "chaos", icon: "💥", name: "Agent of chaos", desc: "Knock 5 mugs off the desk" },
  { id: "laser", icon: "🔴", name: "Red dot hunter", desc: "Catch the laser 6 times in one game" },
  { id: "paw", icon: "🐾", name: "Mind reader", desc: "Win which-paw 3 times in a row" },
  { id: "trap", icon: "🪤", name: "It's a trap", desc: "Get bitten during a belly rub" },
  { id: "pets", icon: "🤲", name: "Professional petter", desc: "Pet Vyley 50 times" },
  { id: "fashion", icon: "🎀", name: "Fashion kotka", desc: "Wear something from the wardrobe" },
  { id: "purrfect", icon: "💜", name: "Purrfect", desc: "Get every stat above 95" },
  { id: "owl", icon: "🦉", name: "Night owl", desc: "Hang out with Vyley after 22:00" },
  { id: "friday", icon: "🚀", name: "Brave soul", desc: "Survive a Friday deploy" },
  { id: "vitosha", icon: "🏔️", name: "Top of the world", desc: "Watch the twilight from Vitosha" },
  { id: "trickortreat", icon: "🎃", name: "Trick or treat", desc: "Go trick-or-treating at Halloween" },
  { id: "decor", icon: "🖼️", name: "Interior designer", desc: "Move Vyley into a new room" },
];

const LINES = {
  idle: [
    "mrrp.",
    "works on my machine :3",
    "I'm not procrastinating. I'm thinking. with my eyes closed.",
    "the sky's turning purple. my favourite hour.",
    "someone left a box here. it's mine now.",
    "мяу :3",
    "I can hear the bongo cat from here. we're coworkers.",
    "git push --force? …no. never. (maybe)",
    "my husband's terminal is warm. I like sitting on it.",
    "tabs. obviously tabs.",
    "one more ticket and then a nap. probably.",
    "if I fits, I ships.",
    "айде, let's ship it.",
    "абе… whatever, it compiles.",
    "where's my husband? I need head scratches.",
    "husband! look! I closed a ticket! (I didn't. but look!)",
    "Cyrillic was invented here, you know. very proud.",
    "is it time for a Red Bull? it's always time for a Red Bull.",
    "I'm a senior developer. I'm also a cat. both are true.",
  ],
  happy: ["prrrr :3", "today is a good day to ship.", "I love it here.", "*slow blink* (that means I love you)"],
  food: ["is that banitsa I smell?", "my bowl is… concerningly empty.", "I would fight a dog for tuna right now.", "husband… curry tonight? please?", "I could eat a whole tray of kebapcheta."],
  energy: ["*yawns* compiling… myself…", "five minute nap? just five.", "my eyes are doing the slow blink thing."],
  tidy: ["my desk is a mess. so is my fur.", "there's a sock on my keyboard. why.", "a quick groom would be lovely."],
  joy: ["play with me? the laser maybe?", "nobody has petted me in ages (minutes).", "*stares at you meaningfully*"],
  night: ["it's late. лека нощ soon, okay?", "the stars are out. twilight's over, but I'm still here."],
  pet: ["prrr", "♡", "more.", "*headbutts your hand*", "you may continue."],
  sick: ["I don't feel so good… 🤒", "*sniffle*", "липов чай? please?", "husband… I'm dying. (I have a cold.)"],
  lofi: [
    "this beat is perfect for debugging.",
    "the lofi girl is studying. so am I. kind of.",
    "*nods to the beat*",
    "lofi + rain + code = perfection.",
    "husband, come listen! it's the good stuff.",
  ],
  sleepPet: ["*sleepy mrrp*", "zzz… five more minutes…"],
  halloween: [
    "boo! :3 …did I scare you? say yes.",
    "a black cat at Halloween. I'm basically a celebrity right now.",
    "I'm not scared of ghosts. I'm scared of the vacuum.",
    "trick or treat? (treat. it's always treat.)",
    "the twilight is extra spooky this week. I love it.",
    "husband, can we carve a pumpkin? please? 🎃",
  ],
};

const ROOM_LINES = {
  twilight: ["back under the purple sky. my favourite.", "home sweet twilight :3"],
  cave: ["lights off. monitor on. it's coding time.", "the RGB makes me code 20% faster. science.", "my husband's battlestation. I live here now."],
  servers: ["it's so warm in here… *loafs*", "the blinky lights are blinking at me. I'm blinking back."],
  varna: ["sand in my paws again. worth it.", "the Black Sea is purple at sunset. did you know?"],
  vitosha: ["Sofia looks so tiny from up here.", "this is the spot. the twilight spot. 🌙"],
};

// server racks for the server room, with blinking lights drawn in
const RACKS = [[6, 30, 34, 106], [58, 48, 24, 88], [118, 48, 24, 88], [160, 30, 34, 106]];
const LED_COLORS = ["#a5ea9b", "#a5ea9b", "#7ed1e2", "#ffcc81"];

function buildRacks() {
  const ns = "http://www.w3.org/2000/svg";
  const g = $("racks");
  const el = (tag, attrs) => {
    const node = document.createElementNS(ns, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    g.appendChild(node);
    return node;
  };
  for (const [x, y, w, h] of RACKS) {
    el("rect", { x, y, width: w, height: h, rx: 1.5, fill: "#151f31", stroke: "#2c3a52", "stroke-width": 1 });
    for (let row = y + 5; row < y + h - 4; row += 7) {
      el("rect", { x: x + 2.5, y: row, width: w - 5, height: 5, fill: "#0d1524" });
      for (let i = 0; i < 3; i++) {
        const led = el("circle", { cx: x + w - 5 - i * 3, cy: row + 2.5, r: 0.8, fill: pick(LED_COLORS), class: "rack-led" });
        led.style.animationDelay = `${(-Math.random() * 1.4).toFixed(2)}s`;
        led.style.animationDuration = `${(0.6 + Math.random() * 1.6).toFixed(2)}s`;
      }
    }
  }
}

// ---------- state ----------

function freshState() {
  const now = Date.now();
  return {
    bornAt: now,
    savedAt: now,
    stats: { food: 80, energy: 90, tidy: 100, joy: 75 },
    xp: 0,
    level: 1,
    tasksDone: 0,
    sleeping: false,
    task: null,
    acc: "none",
    room: "twilight",
    recent: { play: [], caffeine: [] },
    trophies: [],
    mistakes: 0,
    zeroSince: {},
    zeroCounted: {},
    sick: null,
    lastRemedy: 0,
    volume: 10,
    form: null,
    counts: { pets: 0, banitsa: 0, coffee: 0, redbull: 0, mugs: 0, sweet: 0, pawStreak: 0, tasted: [],
      zone: 0, grooms: 0, yarn: 0, worn: [], doneIds: [] },
  };
}

// fill in anything an older save doesn't have yet
function hydrate(saved) {
  const fresh = freshState();
  return { ...fresh, ...saved, counts: { ...fresh.counts, ...saved.counts }, recent: { ...fresh.recent, ...saved.recent } };
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return hydrate(JSON.parse(raw));
  } catch (e) {}
  return null;
}

function save() {
  state.savedAt = Date.now();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {}
}

const loaded = load();
let state = loaded || freshState();
let transientMood = null;
let transientUntil = 0;
let lastTick = state.savedAt;
let laser = null;
let radioOn = false;

// ---------- helpers ----------

const $ = (id) => document.getElementById(id);
const clamp = (n) => Math.max(0, Math.min(100, n));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const xpNeeded = (level) => 60 + level * 45 + level * level * 3;

function levelTitle(level) {
  let title = LEVEL_TITLES[0][1];
  for (const [min, t] of LEVEL_TITLES) if (level >= min) title = t;
  return title;
}

function fmtDuration(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d) return `${d}d ${h}h`;
  if (h) return `${h}h ${m}m`;
  if (m) return m < 10 && s % 60 ? `${m}m ${s % 60}s` : `${m}m`;
  return `${s}s`;
}

function fmtClock(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function isNight() {
  const h = new Date().getHours();
  return h >= 22 || h < 6;
}

// 24 October – 2 November
function isHalloween() {
  const d = new Date();
  return (d.getMonth() === 9 && d.getDate() >= 24) || (d.getMonth() === 10 && d.getDate() <= 2);
}

// seasonal snacks and tickets only show up during their season
function inSeason(x) {
  return !x.season || (x.season === "halloween" && isHalloween());
}

function applyChanges(changes) {
  for (const k of STATS) if (changes[k]) state.stats[k] = clamp(state.stats[k] + changes[k]);
}

function describeChanges(changes) {
  return Object.entries(changes)
    .filter(([, v]) => v)
    .map(([k, v]) => `${v > 0 ? "+" : ""}${v} ${STAT_NAMES[k]}`)
    .join(", ");
}

// ---------- anti-farming ----------

// play is for joy, tickets are for xp: after a few games in a row, play xp fades out for a while
const PLAY_WINDOW = 10 * 60000;
const FRESH_PLAYS = 3;

// caffeine stops working if she chugs it: each recent cup halves the next one, and after 3 she says no
const CAFFEINE = ["coffee", "redbull"];
const CAFFEINE_WINDOW = 30 * 60000;
const CAFFEINE_LIMIT = 3;

function recent(kind, windowMs) {
  const now = Date.now();
  state.recent[kind] = state.recent[kind].filter((t) => now - t < windowMs);
  return state.recent[kind].length;
}

function playXp(base) {
  const n = recent("play", PLAY_WINDOW);
  state.recent.play.push(Date.now());
  return Math.round(base * (n < FRESH_PLAYS ? 1 : 0.5 ** (n - FRESH_PLAYS + 1)));
}

function negate(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, -v]));
}

function netChanges(t) {
  const out = negate(t.cost);
  for (const [k, v] of Object.entries(t.gain)) out[k] = (out[k] || 0) + v;
  return out;
}

// ---------- simulation ----------

// while nobody is watching (tab closed, hidden or the computer asleep) she curls up and dozes,
// so a night away leaves her hungry and a bit lonely instead of neglected
const UNWATCHED = { food: 0.12, energy: 1, tidy: 0.05, joy: 0.08 };

// per-minute stat changes right now (sickness makes everything drain faster)
function rates(unwatched) {
  const s = state.stats;
  const sick = state.sick ? 1.5 : 1;
  if (unwatched) {
    return {
      food: -UNWATCHED.food * sick,
      energy: state.sleeping ? SLEEP_REGEN : UNWATCHED.energy,
      tidy: -UNWATCHED.tidy * sick,
      joy: -UNWATCHED.joy * sick,
    };
  }
  if (state.sleeping) {
    return { food: -DECAY.food * 0.5 * sick, energy: SLEEP_REGEN, tidy: 0, joy: -DECAY.joy * 0.2 * sick };
  }
  const neglected = s.food === 0 || s.energy === 0;
  const chill = radioOn ? 0.6 : 1;
  return {
    food: -DECAY.food * sick,
    energy: -DECAY.energy * sick,
    tidy: -DECAY.tidy * sick,
    joy: -DECAY.joy * (neglected ? 2 : 1) * sick * chill,
  };
}

function decay(minutes, from, unwatched) {
  if (minutes <= 0 || state.task) return;
  const r = rates(unwatched);
  for (const k of STATS) {
    const before = state.stats[k];
    state.stats[k] = clamp(before + r[k] * minutes);
    // remember when a stat bottomed out, even if that happened while the tab was closed
    if (state.stats[k] === 0 && !state.zeroSince[k]) {
      state.zeroSince[k] = before > 0 && r[k] < 0 ? from + (before / -r[k]) * 60000 : from;
    }
  }
  catchBug(minutes, unwatched);
}

// ---------- care mistakes + sickness ----------

const MISTAKE_AFTER = 15 * 60000;
const SICK_MISTAKE_AFTER = 30 * 60000;
const NEGLECT = { food: "went hungry", energy: "got exhausted", tidy: "lived in a mess", joy: "felt lonely" };

function careMistake(reason) {
  state.mistakes++;
  log(`💔 care mistake #${state.mistakes}: Vyley ${reason}`, "bad");
}

// coming back from a long absence costs at most `limit` mistakes; the rest are forgiven
function checkCare(now, limit = Infinity) {
  let made = 0;
  for (const k of STATS) {
    if (state.stats[k] > 10) {
      state.zeroSince[k] = null;
      state.zeroCounted[k] = false;
    } else if (state.zeroSince[k] && !state.zeroCounted[k] && now - state.zeroSince[k] >= MISTAKE_AFTER) {
      state.zeroCounted[k] = true;
      if (made++ >= limit) continue;
      careMistake(`${NEGLECT[k]} for too long`);
      if (!state.sick && Math.random() < 0.5) getSick("being neglected wore her down");
    }
  }
  if (state.sick && !state.sick.counted && now - state.sick.since >= SICK_MISTAKE_AFTER) {
    state.sick.counted = true;
    if (made < limit) careMistake("was left sick for too long");
  }
}

function catchBug(minutes, unwatched) {
  if (state.sick) return;
  const messy = state.stats.tidy < 15;
  const perMinute = (0.0005 + (messy ? 0.03 : 0)) * (unwatched ? 0.25 : 1);
  if (Math.random() < 1 - Math.pow(1 - perMinute, minutes)) {
    getSick(messy ? "the messy desk made her sick" : "caught a cold");
  }
}

function getSick(reason) {
  state.sick = { since: Date.now(), counted: false };
  log(`🤒 Vyley got sick: ${reason}`, "bad");
  say("I don't feel so good… 🤒");
}

const REMEDIES = [
  { id: "lipa", emoji: "🍵", name: "Lipov chai s med", desc: "linden tea with honey, grandma-approved", chance: 0.5, joy: 5 },
  { id: "garlic", emoji: "🧄", name: "Raw garlic", desc: "the village cure-all. she won't like it", chance: 0.35, joy: -6 },
  { id: "vet", emoji: "💊", name: "Vet medicine", desc: "works every time. she hates it", chance: 1, joy: -12 },
];
const REMEDY_COOLDOWN = 60000;

function giveRemedy(r) {
  state.lastRemedy = Date.now();
  applyChanges({ joy: r.joy });
  if (Math.random() < r.chance) {
    state.sick = null;
    award("getwell");
    if (r.id === "garlic") award("garlic");
    log(`${r.emoji} ${r.name.toLowerCase()} worked. Vyley is healthy again ♡`, "good");
    setMood("happy", 2500);
    burst("✨", 4);
    say(r.id === "vet" ? "*spits out pill* …okay fine. I do feel better." : "I feel better! благодаря ♡");
  } else {
    log(`${r.emoji} ${r.name.toLowerCase()} didn't work yet`, "warn");
    say(r.id === "garlic" ? "*breathes garlic at you* still sick. and now I smell." : "still sniffly… 🤧 give it a minute?");
  }
  save();
  render();
}

// ---------- life stages ----------

const STAGES = [
  { id: "kitten", name: "kitten", from: 1 },
  { id: "teen", name: "teen", from: 4 },
  { id: "adult", name: "adult", from: 8 },
];

// which adult Vyley grows into depends on care mistakes made while growing up
const FORMS = [
  { id: "starlit", name: "Starlit Empress", maxMistakes: 2, desc: "Raised with so much love that she glows. The stars follow her around now." },
  { id: "cozy", name: "Cozy Housecat", maxMistakes: 6, desc: "Soft, round and content. A very, very good cat." },
  { id: "gremlin", name: "Chaos Gremlin", maxMistakes: Infinity, desc: "A little scruffy, a little feral, all chaos. Still loved, always." },
];

function stageOf(level) {
  let stage = STAGES[0];
  for (const st of STAGES) if (level >= st.from) stage = st;
  return stage;
}

function formFor(mistakes) {
  return FORMS.find((f) => mistakes <= f.maxMistakes).id;
}

function growUp() {
  if (state.level === STAGES[1].from) {
    log("🌱 Vyley grew into a teen!", "good");
    queueModal("vyley is growing up", (body) => {
      body.appendChild(para("✦ Vyley is a teen now!"));
      body.appendChild(para("Bigger paws, bigger opinions. How you look after her from here decides what kind of adult cat she becomes."));
      body.appendChild(para(`care mistakes so far: ${state.mistakes}`));
    });
  }
  if (state.level === STAGES[2].from && !state.form) {
    state.form = formFor(state.mistakes);
    const f = FORMS.find((x) => x.id === state.form);
    log(`🌙 Vyley grew up into a ${f.name}!`, "good");
    award("grownup");
    if (state.form === "starlit") award("starlit");
    if (state.form === "gremlin") award("gremlin");
    if (state.mistakes === 0) award("perfect");
    queueModal("all grown up", (body) => {
      body.appendChild(para(`✦ Vyley grew up into a ${f.name}!`));
      body.appendChild(para(f.desc));
      body.appendChild(para(`care mistakes while growing up: ${state.mistakes}`));
    });
  }
}

function addXp(amount) {
  state.xp += amount;
  while (state.xp >= xpNeeded(state.level)) {
    state.xp -= xpNeeded(state.level);
    state.level++;
    log(`level up! now lv ${state.level}: ${levelTitle(state.level)} ✦`, "good");
    const unlocked = WARDROBE.find((w) => w.lv === state.level);
    if (unlocked) log(`wardrobe unlocked: ${unlocked.name.toLowerCase()} 🎀`, "good");
    const room = ROOMS.find((r) => r.lv === state.level);
    if (room) log(`new room unlocked: ${room.name.toLowerCase()} 🖼️`, "good");
    setMood("happy", 3000);
    say(`честито! level ${state.level}! :3`);
    burst("✦", 6);
    if (state.level >= 5) award("lv5");
    if (state.level >= 10) award("lv10");
    if (state.level >= 15) award("lv15");
    growUp();
  }
}

function award(id) {
  if (state.trophies.includes(id)) return;
  const t = TROPHIES.find((x) => x.id === id);
  state.trophies.push(id);
  log(`★ trophy unlocked: ${t.name} ${t.icon}`, "trophy");
  const outfit = WARDROBE.find((w) => w.trophy === id);
  if (outfit) log(`wardrobe unlocked: ${outfit.name.toLowerCase()} 🎀`, "good");
  burst(t.icon, 3);
}

function checkTrophies() {
  if (STATS.every((k) => state.stats[k] > 95)) award("purrfect");
  if (isNight() && !state.sleeping && !state.task) award("owl");
  const h = new Date().getHours();
  if (h >= 18 && h < 21 && !state.task) award("golden");
}

// gaps longer than this mean the page wasn't running (closed tab, sleeping computer)
const LONG_GAP = 5 * 60000;

function tick() {
  const now = Date.now();
  const gap = now - lastTick;
  decay(gap / 60000, lastTick, document.hidden || gap > LONG_GAP);
  lastTick = now;
  checkCare(now, gap > LONG_GAP ? 1 : Infinity);

  if (state.task && now >= state.task.end) finishTask();

  if (state.sleeping && state.stats.energy >= 100) {
    state.sleeping = false;
    log("woke up fully rested ☀", "good");
    award("sleepyhead");
    say("добро утро! ☀ (good morning)");
  }

  checkTrophies();
  render();
}

// ---------- rendering ----------

function currentMood() {
  if (state.sleeping) return "sleep";
  if (transientMood && Date.now() < transientUntil) return transientMood;
  if (state.sick) return "sad";
  const s = state.stats;
  const low = Math.min(...STATS.map((k) => s[k]));
  if (low < 15) return "sad";
  if (low < 35) return "meh";
  if (STATS.every((k) => s[k] > 88)) return "happy";
  return "content";
}

function setMood(mood, ms) {
  transientMood = mood;
  transientUntil = Date.now() + ms;
  render();
}

function render() {
  const kitty = $("kitty");
  kitty.dataset.mood = currentMood();
  kitty.dataset.acc = state.acc;
  kitty.dataset.form = state.form || "";
  kitty.classList.toggle("sick", !!state.sick);
  kitty.classList.toggle("vibing", radioOn && !state.sleeping);
  const stage = stageOf(state.level);
  $("pet").dataset.stage = stage.id;
  $("stage-name").textContent = state.form ? FORMS.find((f) => f.id === state.form).name.toLowerCase() : stage.name;
  $("mistakes").textContent = state.mistakes;
  $("health").textContent = state.sick ? "sick 🤒" : "healthy";
  $("health").classList.toggle("bad", !!state.sick);
  $("tasks-btn").textContent = state.sick ? "🩺 nurse her back to health" : "💻 assign a ticket";

  for (const k of STATS) {
    const row = document.querySelector(`.stat[data-stat="${k}"]`);
    const v = Math.round(state.stats[k]);
    row.querySelector(".fill").style.width = `${v}%`;
    row.querySelector(".val").textContent = v;
    row.classList.toggle("low", v < 35 && v >= 15);
    row.classList.toggle("critical", v < 15);
  }

  const need = xpNeeded(state.level);
  $("xp-fill").style.width = `${(state.xp / need) * 100}%`;
  $("xp-val").textContent = `${state.xp}/${need}`;
  $("level-label").textContent = `lv ${state.level}`;
  $("screen-level").textContent = `Lv ${state.level}`;
  $("level-title").textContent = levelTitle(state.level);
  $("age").textContent = fmtDuration(Date.now() - state.bornAt);
  $("tasks-done").textContent = state.tasksDone;
  $("trophy-count").textContent = `${state.trophies.length}/${TROPHIES.length}`;
  $("screen-clock").textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const screen = $("screen");
  screen.classList.toggle("night", isNight());
  screen.classList.toggle("halloween", isHalloween());
  screen.dataset.room = state.room;
  screen.classList.toggle("sleeping", state.sleeping);

  const away = !!state.task;
  $("pet").hidden = away;
  $("away").hidden = !away;
  if (away) {
    const t = TASKS.find((x) => x.id === state.task.id);
    const total = state.task.end - state.task.start;
    const left = state.task.end - Date.now();
    $("away-title").textContent = `out: ${t.name.toLowerCase()}`;
    $("away-fill").style.width = `${Math.min(100, ((total - left) / total) * 100)}%`;
    $("away-time").textContent = `back in ${fmtClock(left)}`;
  }

  for (const btn of document.querySelectorAll("#actions button")) {
    const a = btn.dataset.action;
    const always = a === "trophies" || a === "wardrobe" || a === "rooms";
    btn.disabled = !always && (away || !!laser || (state.sleeping && a !== "sleep"));
  }
  $("sleep-btn").textContent = state.sleeping ? "☀ wake" : "💤 nap";

  renderClutter();
}

const CLUTTER_GLYPHS = ["☕", "📝", "🧶", "🧦", "📦", "🍪", "🔌", "🐟"];
const CLUTTER_SPOTS = [[6, 4], [84, 8], [20, 12], [72, 2], [2, 14], [90, 16], [30, 2], [62, 13]];

function renderClutter() {
  const el = $("clutter");
  if (el.classList.contains("sweep")) return;
  const want = state.task ? 0 : Math.min(CLUTTER_SPOTS.length, Math.floor((100 - state.stats.tidy) / 12));
  while (el.children.length > want) el.lastChild.remove();
  while (el.children.length < want) {
    const i = el.children.length;
    const span = document.createElement("span");
    span.textContent = CLUTTER_GLYPHS[i];
    span.style.left = `${CLUTTER_SPOTS[i][0]}%`;
    span.style.bottom = `${CLUTTER_SPOTS[i][1]}%`;
    el.appendChild(span);
  }
}

let speechTimer;
function say(text, ms = 4200) {
  const el = $("speech");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(speechTimer);
  speechTimer = setTimeout(() => el.classList.remove("show"), ms);
  log(`vyley: ${text}`, "say");
}

function particle(text, cls = "", x, y) {
  const pet = $("pet");
  const p = document.createElement("div");
  p.className = `particle ${cls}`;
  p.textContent = text;
  const left = x ?? pet.offsetLeft + (Math.random() - 0.5) * pet.offsetWidth * 0.6;
  const top = y ?? pet.offsetTop + pet.offsetHeight * 0.15;
  p.style.left = `${left}px`;
  p.style.top = `${top}px`;
  p.style.setProperty("--dx", `${(Math.random() - 0.5) * 40}px`);
  $("stage").appendChild(p);
  p.addEventListener("animationend", () => p.remove());
}

function burst(text, n, cls) {
  for (let i = 0; i < n; i++) setTimeout(() => particle(text, cls), i * 120);
}

function log(text, cls = "") {
  const el = $("log");
  const line = document.createElement("div");
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  line.innerHTML = `<span class="t">[${time}]</span> `;
  const msg = document.createElement("span");
  msg.className = cls;
  msg.textContent = text;
  line.appendChild(msg);
  el.appendChild(line);
  while (el.children.length > 80) el.firstChild.remove();
  el.scrollTop = el.scrollHeight;
}

function moveTo(percent, fast) {
  const pet = $("pet");
  const current = parseFloat(pet.style.left) || 50;
  $("kitty").classList.toggle("flip", percent < current);
  pet.classList.toggle("dash", !!fast);
  pet.style.left = `${percent}%`;
}

// ---------- modal ----------

const modal = $("modal");

function openModal(title, build) {
  $("modal-title").textContent = title;
  const body = $("modal-body");
  body.innerHTML = "";
  build(body);
  if (!modal.open) modal.showModal();
}

// show after whatever is open right now (e.g. a ticket report) gets closed
const modalQueue = [];
function queueModal(title, build) {
  if (modal.open) modalQueue.push([title, build]);
  else openModal(title, build);
}

function choiceButton({ name, desc, tag, disabled, on, onClick }) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = on ? "choice on" : "choice";
  b.disabled = !!disabled;
  b.innerHTML = `<span><span class="c-name"></span><span class="c-desc"></span></span><span class="c-tag"></span>`;
  b.querySelector(".c-name").textContent = name;
  b.querySelector(".c-desc").textContent = desc || "";
  b.querySelector(".c-tag").textContent = tag || "";
  b.addEventListener("click", onClick);
  return b;
}

function para(text) {
  const p = document.createElement("p");
  p.textContent = text;
  return p;
}

// ---------- actions ----------

const actions = {
  feed() {
    const full = state.stats.food >= 95;
    const cups = recent("caffeine", CAFFEINE_WINDOW);
    const wired = cups >= CAFFEINE_LIMIT;
    openModal("feed vyley", (body) => {
      if (full) body.appendChild(para("*pats tummy* I'm so full. maybe a coffee though?"));
      if (wired) body.appendChild(para("no more caffeine. my heart is doing a drum solo. 🥁 (a nap works better)"));
      else if (cups) body.appendChild(para("(caffeine works less if she keeps chugging it. naps are the real fix)"));
      for (const f of FOODS.filter(inSeason)) {
        const caffeinated = CAFFEINE.includes(f.id);
        const energy = caffeinated ? Math.round(f.energy * 0.5 ** cups) : f.energy;
        body.appendChild(choiceButton({
          name: `${f.emoji} ${f.name}`,
          desc: caffeinated && wired ? "too much caffeine. wait a bit" : f.desc,
          tag: describeChanges({ food: f.food, energy, joy: f.joy, tidy: f.tidy }),
          disabled: (full && !DRINKS.includes(f.id)) || (caffeinated && wired),
          onClick: () => {
            modal.close();
            eat(f);
          },
        }));
      }
    });
  },

  play() {
    openModal("play with vyley", (body) => {
      const tired = state.stats.energy < 8 || !!state.sick;
      if (state.sick) body.appendChild(para("*sniffle* too sick to run around… a gentle belly rub maybe?"));
      else if (tired) body.appendChild(para("*flops over* too sleepy to play… maybe a belly rub?"));
      if (recent("play", PLAY_WINDOW) >= FRESH_PLAYS) {
        body.appendChild(para("(we've played a lot just now, so games give less xp for a bit. still fun though ♡)"));
      }
      body.appendChild(choiceButton({
        name: "🔴 Laser pointer", desc: "catch the red dot before it escapes", tag: "-8 energy",
        disabled: tired, onClick: startLaser,
      }));
      body.appendChild(choiceButton({
        name: "🐾 Which paw?", desc: "guess where the star is hidden", tag: "-5 energy",
        disabled: tired, onClick: playPaw,
      }));
      body.appendChild(choiceButton({
        name: "🧶 Dangle the yarn", desc: "simple, timeless", tag: "+12 joy, -4 energy",
        disabled: tired, onClick: playYarn,
      }));
      body.appendChild(choiceButton({
        name: "🤲 Belly rub", desc: "what could possibly go wrong", tag: "risky",
        onClick: bellyRub,
      }));
    });
  },

  sleep() {
    state.sleeping = !state.sleeping;
    if (state.sleeping) {
      log("curled up for a nap 💤");
      say("лека нощ… (good night)", 2500);
    } else {
      log("woke up early");
      say(state.stats.energy < 60 ? "mrrrh… okay, I'm up. mostly." : "добро утро! what did I miss?");
    }
    save();
    render();
  },

  groom() {
    if (state.stats.tidy > 95) {
      say("already immaculate. look at this fur.");
      return;
    }
    const el = $("clutter");
    el.classList.add("sweep");
    setTimeout(() => {
      el.classList.remove("sweep");
      el.innerHTML = "";
      render();
    }, 650);
    // a proper clean-up earns xp; a quick touch-up doesn't
    if (state.stats.tidy < 60) addXp(3);
    state.stats.tidy = 100;
    applyChanges({ joy: 3 });
    log("groomed fur & tidied the desk 🪮", "good");
    if (++state.counts.grooms >= 20) award("clean");
    setMood("happy", 1600);
    burst("✨", 3);
    say("*licks paw* *pushes junk off desk* much better ✨");
    save();
    render();
  },

  tasks() {
    if (state.sick) return actions.heal();
    openModal("assign vyley a ticket", (body) => {
      body.appendChild(para("I'll go work on it and come back with a report. My stats pause while I'm away."));
      const sulking = state.stats.joy < 15;
      const s = state.stats;
      if (sulking) body.appendChild(para("…not in the mood. play with me first? 😿"));
      else if (STATS.every((k) => s[k] >= 70)) body.appendChild(para("I'm feeling great. in the zone! (+25% xp)"));
      else if (STATS.some((k) => s[k] < 30)) body.appendChild(para("I'm a bit distracted… (-40% xp until you look after me)"));
      const sorted = TASKS.filter(inSeason).sort((a, b) => a.minLevel - b.minLevel || a.secs - b.secs);
      for (const t of sorted.filter((x) => state.level >= x.minLevel)) {
        const short = STATS.filter((k) => (t.cost[k] || 0) > 0 && state.stats[k] < t.cost[k] + 5);
        const desc = short.length
          ? `not enough ${short.map((k) => STAT_NAMES[k]).join(" & ")}`
          : describeChanges(netChanges(t)) + (state.lastTaskId === t.id ? " · again? (-30% xp)" : "");
        body.appendChild(choiceButton({
          name: t.name,
          desc,
          tag: `${fmtDuration(t.secs * 1000)} · +${Math.max(1, Math.round(t.xp * focusFor(t).mult))}xp`,
          disabled: sulking || short.length > 0,
          onClick: () => {
            modal.close();
            startTask(t);
          },
        }));
      }
      const locked = sorted.filter((x) => state.level < x.minLevel);
      if (locked.length) {
        body.appendChild(choiceButton({
          name: `🔒 ${locked.length} more ticket${locked.length === 1 ? "" : "s"} in the backlog`,
          desc: `next one unlocks at lv ${locked[0].minLevel}`,
          disabled: true,
          onClick: () => {},
        }));
      }
    });
  },

  heal() {
    openModal("nurse vyley back to health", (body) => {
      body.appendChild(para("*sniffle* I caught a bug. the real kind. 🤒 Everything drains faster while I'm sick, and leaving me sick too long counts as a care mistake."));
      const wait = state.lastRemedy + REMEDY_COOLDOWN - Date.now();
      if (wait > 0) body.appendChild(para(`(the last remedy needs time to work: ${Math.ceil(wait / 1000)}s)`));
      for (const r of REMEDIES) {
        body.appendChild(choiceButton({
          name: `${r.emoji} ${r.name}`,
          desc: r.desc,
          tag: `${Math.round(r.chance * 100)}% · ${r.joy > 0 ? "+" : ""}${r.joy} joy`,
          disabled: wait > 0,
          onClick: () => {
            modal.close();
            giveRemedy(r);
          },
        }));
      }
    });
  },

  wardrobe() {
    openModal("wardrobe", (body) => {
      const order = (w) => (w.trophy ? 99 : w.lv);
      for (const w of [...WARDROBE].sort((a, b) => order(a) - order(b))) {
        const locked = !wardrobeUnlocked(w);
        const how = w.trophy
          ? `unlock with trophy: ${TROPHIES.find((t) => t.id === w.trophy).name}`
          : `unlocks at lv ${w.lv}`;
        body.appendChild(choiceButton({
          name: locked ? "🔒 ???" : w.name,
          desc: locked ? how : w.desc,
          tag: state.acc === w.id ? "wearing" : w.trophy && !locked ? "🏆" : "",
          on: state.acc === w.id,
          disabled: locked,
          onClick: () => {
            state.acc = w.id;
            if (w.id !== "none") {
              award("fashion");
              if (!state.counts.worn.includes(w.id)) state.counts.worn.push(w.id);
              if (state.counts.worn.length >= 5) award("dressed");
              say(pick(["how do I look? :3", "*poses*", "very professional. very cute."]));
            }
            save();
            render();
            actions.wardrobe();
          },
        }));
      }
    });
  },

  rooms() {
    openModal("rooms", (body) => {
      for (const r of ROOMS) {
        const locked = !roomUnlocked(r);
        const how = r.ticket
          ? `finish the ticket: ${TASKS.find((t) => t.id === r.ticket).name.toLowerCase()}`
          : `unlocks at lv ${r.lv}`;
        body.appendChild(choiceButton({
          name: locked ? "🔒 ???" : r.name,
          desc: locked ? how : r.desc,
          tag: state.room === r.id ? "here now" : "",
          on: state.room === r.id,
          disabled: locked,
          onClick: () => {
            if (state.room !== r.id) {
              state.room = r.id;
              if (r.id !== "twilight") award("decor");
              log(`moved to: ${r.name.toLowerCase()} 🖼️`);
              say(pick(ROOM_LINES[r.id]));
            }
            save();
            render();
            actions.rooms();
          },
        }));
      }
    });
  },

  trophies() {
    openModal(`trophies ${state.trophies.length}/${TROPHIES.length}`, (body) => {
      for (const t of TROPHIES) {
        const got = state.trophies.includes(t.id);
        const row = document.createElement("div");
        row.className = got ? "trophy-row" : "trophy-row locked";
        row.innerHTML = `<span class="ico"></span><span><div class="nm"></div><div class="ds"></div></span>`;
        row.querySelector(".ico").textContent = got ? t.icon : "🔒";
        row.querySelector(".nm").textContent = t.name;
        row.querySelector(".ds").textContent = t.desc;
        body.appendChild(row);
      }
    });
  },
};

function eat(f) {
  // snacking when already well fed leaves crumbs everywhere
  const crumbs = state.stats.food > 75 ? -5 : 0;
  // only a meal she actually needed counts for xp (no ayran spam)
  if (state.stats.food < 80) addXp(1);
  let energy = f.energy;
  if (CAFFEINE.includes(f.id)) {
    energy = Math.round(f.energy * 0.5 ** recent("caffeine", CAFFEINE_WINDOW));
    state.recent.caffeine.push(Date.now());
  }
  applyChanges({ food: f.food, energy, joy: f.joy, tidy: (f.tidy || 0) + crumbs });
  log(`ate: ${f.name.toLowerCase()} ${f.emoji}${crumbs ? " (crumbs everywhere)" : ""}`, "good");
  setMood("eat", 1800);
  burst(f.emoji, 3);
  if (f.id === "banitsa" && ++state.counts.banitsa >= 5) award("banitsa");
  if (state.counts.banitsa >= 25) award("baron");
  if (f.id === "coffee" && ++state.counts.coffee >= 10) award("coffee");
  if (f.id === "redbull" && ++state.counts.redbull >= 5) award("redbull");
  if (!state.counts.tasted.includes(f.id)) state.counts.tasted.push(f.id);
  if (FOODS.every((x) => x.season || state.counts.tasted.includes(x.id))) award("gourmet");
  setTimeout(() => say(FOOD_REACTIONS[f.id]), 900);
  save();
  render();
}

// ----- play: which paw -----

function playPaw() {
  const star = Math.random() < 0.5 ? "left" : "right";
  setMood("think", 60000);
  openModal("which paw?", (body) => {
    body.appendChild(para("I'm hiding a tiny star ✦ under one of my paws. Which one?"));
    const hands = document.createElement("div");
    hands.className = "hands";
    for (const side of ["left", "right"]) {
      hands.appendChild(choiceButton({
        name: side === "left" ? "🐾 left" : "right 🐾",
        onClick: () => resolvePaw(side === star, star),
      }));
    }
    body.appendChild(hands);
  });
}

function resolvePaw(won, star) {
  applyChanges({ energy: -5, food: -2, joy: won ? 16 : 8 });
  addXp(playXp(won ? 8 : 3));
  state.counts.pawStreak = won ? state.counts.pawStreak + 1 : 0;
  if (state.counts.pawStreak >= 3) award("paw");
  if (state.counts.pawStreak >= 5) award("lucky");
  log(won ? "which-paw: you found the star ✦" : "which-paw: the star got away", won ? "good" : "");
  setMood(won ? "happy" : "content", 2200);
  if (won) burst("✦", 4);
  openModal("which paw?", (body) => {
    body.appendChild(para(won
      ? `Yes! It was under my ${star} paw. Are you reading my mind? ✦`
      : `Nope, it was under my ${star} paw! Hehe. Again?`));
    if (state.counts.pawStreak > 1) body.appendChild(para(`streak: ${state.counts.pawStreak} 🔥`));
    body.appendChild(choiceButton({
      name: "▶ play again",
      desc: "-5 energy, -2 snacks",
      disabled: state.stats.energy < 8,
      onClick: playPaw,
    }));
    body.appendChild(choiceButton({ name: "that's enough for now", onClick: () => modal.close() }));
  });
  save();
  render();
}

// ----- play: yarn + belly rub -----

function playYarn() {
  modal.close();
  applyChanges({ joy: 12, energy: -4, food: -2 });
  addXp(playXp(4));
  log("played with the yarn 🧶", "good");
  if (++state.counts.yarn >= 15) award("yarn");
  setMood("happy", 2400);
  burst("🧶", 3);
  moveTo(30 + Math.random() * 40, true);
  say(pick(["MINE. *pounces*", "*bats at it* *bats at it again*", "I have defeated the yarn."]));
  save();
}

function bellyRub() {
  modal.close();
  if (Math.random() < 0.4) {
    applyChanges({ joy: -3 });
    setMood("grump", 2200);
    award("trap");
    log("belly rub: got bitten (gently) 🪤", "bad");
    say("*CHOMP* …it was a trap. it's always a trap.");
  } else {
    applyChanges({ joy: 10 });
    addXp(playXp(3));
    setMood("happy", 2200);
    burst("purr", 3, "purr");
    log("belly rub: approved 💜", "good");
    say("prrrrrr… okay, this is allowed.");
  }
  save();
  render();
}

// ----- play: laser pointer -----

const LASER_SECS = 12;

function startLaser() {
  modal.close();
  laser = { hits: 0, end: Date.now() + LASER_SECS * 1000 };
  setMood("wow", LASER_SECS * 1000);
  $("laser").hidden = false;
  $("laser-hud").hidden = false;
  moveLaser();
  laser.timer = setInterval(() => {
    const left = laser.end - Date.now();
    if (left <= 0) return endLaser();
    $("laser-hud").textContent = `caught ${laser.hits} · ${Math.ceil(left / 1000)}s`;
    if (Math.random() < 0.3) moveLaser();
  }, 400);
  render();
}

function moveLaser() {
  const dot = $("laser");
  const x = 8 + Math.random() * 84;
  const y = 25 + Math.random() * 55;
  dot.style.left = `${x}%`;
  dot.style.top = `${y}%`;
  moveTo(Math.min(72, Math.max(28, x)), true);
}

$("laser").addEventListener("click", (e) => {
  if (!laser) return;
  e.stopPropagation();
  laser.hits++;
  const dot = $("laser");
  particle("✦", "", dot.offsetLeft, dot.offsetTop);
  setMood("happy", 600);
  moveLaser();
  setTimeout(() => laser && setMood("wow", laser.end - Date.now()), 600);
});

function endLaser() {
  clearInterval(laser.timer);
  const hits = laser.hits;
  laser = null;
  $("laser").hidden = true;
  $("laser-hud").hidden = true;
  $("pet").classList.remove("dash");
  applyChanges({ energy: -8, food: -3, joy: 6 + hits * 3 });
  addXp(playXp(2 + hits * 2));
  if (hits >= 6) award("laser");
  if (hits >= 10) award("laserlegend");
  log(`laser pointer: caught it ${hits} time${hits === 1 ? "" : "s"} 🔴`, hits ? "good" : "");
  setMood(hits ? "happy" : "grump", 2200);
  say(hits >= 6 ? "I AM THE APEX PREDATOR." : hits ? `got it ${hits} times! again?` : "…where did it go. where does it ALWAYS go.");
  save();
  render();
}

// ----- tickets -----

// a well-cared-for kotka works better; a neglected or bored one less so
function focusFor(t) {
  const s = state.stats;
  let mult = 1;
  const notes = [];
  if (STATS.every((k) => s[k] >= 70)) {
    mult += 0.25;
    notes.push("in the zone +25%");
  } else if (STATS.some((k) => s[k] < 30)) {
    mult -= 0.4;
    notes.push("distracted -40%");
  }
  if (state.lastTaskId === t.id) {
    mult -= 0.3;
    notes.push("same ticket again -30%");
  }
  return { mult, notes };
}

function startTask(t) {
  const now = Date.now();
  const { mult, notes } = focusFor(t);
  state.task = { id: t.id, start: now, end: now + t.secs * 1000, mult, notes };
  state.lastTaskId = t.id;
  log(`picked up ticket: ${t.name.toLowerCase()}`, "warn");
  say("on it! brb 🐾", 1500);
  save();
  setTimeout(render, 900);
}

function finishTask() {
  const task = state.task;
  const t = TASKS.find((x) => x.id === task.id);
  const xp = Math.max(1, Math.round(t.xp * (task.mult ?? 1)));
  lastTick = Math.min(Date.now(), task.end);
  state.task = null;
  const changes = netChanges(t);
  applyChanges(changes);
  state.tasksDone++;
  award("hello");
  if (state.tasksDone >= 10) award("tickets10");
  if (state.tasksDone >= 25) award("tickets25");
  if (t.id === "mug" && ++state.counts.mugs >= 5) award("chaos");
  if (state.tasksDone >= 50) award("tickets50");
  if (SWEET_TASKS.includes(t.id) && ++state.counts.sweet >= 5) award("wifey");
  if (state.counts.sweet >= 15) award("married");
  if (state.tasksDone >= 100) award("workaholic");
  if (task.notes?.some((n) => n.startsWith("in the zone")) && ++state.counts.zone >= 10) award("zone");
  if (!state.counts.doneIds.includes(t.id)) {
    state.counts.doneIds.push(t.id);
    const room = ROOMS.find((r) => r.ticket === t.id);
    if (room) log(`new room unlocked: ${room.name.toLowerCase()} 🖼️`, "good");
  }
  if (["varna", "monastery", "lakes", "vitosha"].every((id) => state.counts.doneIds.includes(id))) award("tour");
  if (t.id === "bongo") award("coworkers");
  const trophyFor = { friday: "friday", vitosha: "vitosha", dns: "dns", horo: "horo", martenitsa: "babamarta", lakes: "lakes", trick: "trickortreat" };
  if (trophyFor[t.id]) award(trophyFor[t.id]);
  log(`closed ticket: ${t.name.toLowerCase()} (+${xp}xp)`, "good");
  openModal("ticket report", (body) => {
    body.appendChild(para(`✦ ${t.name}`));
    const rep = document.createElement("div");
    rep.className = "report";
    rep.textContent = pick(t.outputs);
    body.appendChild(rep);
    const r = document.createElement("div");
    r.className = "rewards";
    const desc = describeChanges(changes);
    r.textContent = `+${xp} xp${desc ? ` · ${desc}` : ""}`;
    body.appendChild(r);
    if (task.notes?.length) body.appendChild(para(`(${task.notes.join(", ")})`));
  });
  addXp(xp);
  setMood("happy", 2500);
  save();
}

// ---------- idle behaviour ----------

function idle() {
  return !state.task && !state.sleeping && !modal.open && !laser;
}

function idleChatter() {
  if (idle()) {
    const s = state.stats;
    const needs = STATS.filter((k) => s[k] < 35).sort((a, b) => s[a] - s[b]);
    if (state.sick) say(pick(LINES.sick));
    else if (radioOn && Math.random() < 0.3) say(pick(LINES.lofi));
    else if (needs.length) say(pick(LINES[needs[0]]));
    else if (isHalloween() && Math.random() < 0.35) say(pick(LINES.halloween));
    else if (isNight() && Math.random() < 0.4) say(pick(LINES.night));
    else if (currentMood() === "happy") say(pick(LINES.happy));
    else say(pick(LINES.idle));
  }
  setTimeout(idleChatter, 14000 + Math.random() * 10000);
}

function wander() {
  if (idle()) moveTo(28 + Math.random() * 44);
  setTimeout(wander, 5000 + Math.random() * 5000);
}

function snore() {
  if (state.sleeping && !state.task) particle("z", "zzz");
  else if (state.sick && !state.task && Math.random() < 0.3) particle("🤧");
}

let lastPet = 0;
let recentPets = [];
$("pet").addEventListener("click", () => {
  const now = Date.now();
  if (now - lastPet < 700 || laser) return;
  lastPet = now;
  if (state.sleeping) {
    say(pick(LINES.sleepPet), 2000);
    return;
  }
  // she's a cat: too many pets in a row and she's had enough
  recentPets = recentPets.filter((t) => now - t < 20000);
  recentPets.push(now);
  if (recentPets.length > 6) {
    recentPets = [];
    applyChanges({ joy: -4 });
    setMood("grump", 2200);
    log("petted too much. got swatted 🐾", "bad");
    award("swatted");
    say(pick(["okay. that's enough. *swats*", "I said ENOUGH. *tail flick*", "personal space, please. I'm a professional."]));
    save();
    render();
    return;
  }
  applyChanges({ joy: 2 });
  particle("♡");
  particle("purr", "purr");
  setMood("happy", 1400);
  if (++state.counts.pets >= 50) award("pets");
  if (Math.random() < 0.3) say(pick(LINES.pet), 1800);
  save();
  render();
});

// ---------- radio ----------

// Lofi Girl's 24/7 stream; only loaded once the visitor presses play
const LOFI_VIDEO = "rFZHOHl-L8A";
let ytPlayer = null;
let ytApi = null;

// YouTube's player API is what lets us set the volume (it starts quiet instead of at full blast)
function loadYouTubeApi() {
  ytApi ??= new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = resolve;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return ytApi;
}

function showVolume() {
  const v = state.volume;
  $("radio-volume").value = v;
  $("volume-label").textContent = `${v === 0 ? "🔇" : v < 50 ? "🔉" : "🔊"} ${v}%`;
}

$("radio-volume").addEventListener("input", (e) => {
  state.volume = Number(e.target.value);
  showVolume();
  if (ytPlayer?.setVolume) ytPlayer.setVolume(state.volume);
});
$("radio-volume").addEventListener("change", save);
showVolume();

$("radio-btn").addEventListener("click", () => {
  radioOn = !radioOn;
  const player = $("radio-player");
  if (radioOn) {
    player.innerHTML = `<div id="yt-player"></div>`;
    player.hidden = false;
    loadYouTubeApi().then(() => {
      if (!radioOn) return;
      ytPlayer = new YT.Player("yt-player", {
        host: "https://www.youtube-nocookie.com",
        videoId: LOFI_VIDEO,
        playerVars: { autoplay: 1, rel: 0, playsinline: 1 },
        events: {
          onReady: (e) => {
            e.target.setVolume(state.volume);
            e.target.playVideo();
          },
        },
      });
    });
    award("lofi");
    log("radio on: lofi beats 🎧", "good");
    if (!state.sleeping) say("ooh, lofi! *bops* 🎧");
  } else {
    ytPlayer?.destroy();
    ytPlayer = null;
    player.innerHTML = "";
    player.hidden = true;
    log("radio off");
  }
  $("radio-btn").textContent = radioOn ? "⏹ stop" : "🎧 play lofi";
  save();
  render();
});

// ---------- wiring ----------

document.querySelectorAll("#actions button").forEach((btn) => {
  btn.addEventListener("click", () => actions[btn.dataset.action]());
});

modal.addEventListener("close", () => {
  if (transientMood === "think") transientUntil = 0;
  if (modalQueue.length) setTimeout(() => openModal(...modalQueue.shift()), 200);
  render();
});

// ---------- export / import (to move Vyley between computers) ----------

const CODE_PREFIX = "VYLEY1:";

function exportCode() {
  save();
  const bytes = new TextEncoder().encode(JSON.stringify(state));
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return CODE_PREFIX + btoa(bin);
}

// accepts a save code or the raw JSON from a save file; throws if it isn't a Vyley
function parseSave(text) {
  text = text.trim();
  let json = text;
  if (text.startsWith(CODE_PREFIX)) {
    const bin = atob(text.slice(CODE_PREFIX.length).replace(/\s+/g, ""));
    json = new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  }
  const saved = JSON.parse(json);
  const ok = saved && typeof saved === "object" && saved.stats && STATS.every((k) => typeof saved.stats[k] === "number")
    && Number.isFinite(saved.level) && Number.isFinite(saved.savedAt);
  if (!ok) throw new Error("not a Pocket Vyley save");
  return saved;
}

function downloadSave() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `pocket-vyley-lv${state.level}-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  log("exported save file 💾", "good");
}

function confirmImport(saved) {
  const age = fmtDuration(Date.now() - saved.bornAt);
  openModal("import save", (body) => {
    body.appendChild(para(`Found a lv ${saved.level} Vyley, ${age} old, with ${saved.tasksDone ?? 0} tickets closed and ${saved.trophies?.length ?? 0} trophies.`));
    body.appendChild(para(`This replaces the Vyley on this computer (lv ${state.level}). There's no undo, so export this one first if you want to keep it.`));
    body.appendChild(choiceButton({
      name: "📥 yes, bring her over",
      desc: "time since that save was made counts as time away",
      onClick: () => {
        modal.close();
        importSave(saved);
      },
    }));
    body.appendChild(choiceButton({ name: "cancel", onClick: () => actions.saves() }));
  });
}

function importSave(saved) {
  if (laser) endLaser();
  state = hydrate(saved);
  lastTick = Math.min(Date.now(), state.savedAt);
  if (state.task && Date.now() >= state.task.end) finishTask();
  tick();
  log(`imported a save: lv ${state.level} ${levelTitle(state.level).toLowerCase()} 📥`, "good");
  say("*sniffs around* new computer! same me. мяу :3");
  setMood("happy", 2500);
  burst("✦", 5);
  save();
  render();
}

function readImportText(text, msg) {
  try {
    confirmImport(parseSave(text));
  } catch (e) {
    msg.textContent = "hmm, that doesn't look like a Vyley save. 😿";
    msg.classList.add("bad");
  }
}

actions.saves = () => {
  openModal("export / import save", (body) => {
    body.appendChild(para("Moving Vyley to another computer? Export her here, then import her there. (She lives in only one place at a time: the other copy won't update by itself.)"));
    const msg = document.createElement("div");
    msg.className = "save-msg";
    body.appendChild(choiceButton({
      name: "💾 Download save file",
      desc: "a .json file you can send or copy over",
      onClick: downloadSave,
    }));
    body.appendChild(choiceButton({
      name: "📋 Copy save code",
      desc: "one long line of text, easy to paste into a chat",
      onClick: async () => {
        const code = exportCode();
        try {
          await navigator.clipboard.writeText(code);
          msg.textContent = "copied! paste it into “paste a save code” on the other computer ✦";
        } catch (e) {
          area.value = code;
          area.select();
          msg.textContent = "couldn't copy automatically, so the code is in the box below. copy it from there.";
        }
        msg.classList.remove("bad");
        log("copied save code 📋", "good");
      },
    }));
    body.appendChild(choiceButton({
      name: "📂 Load save file",
      desc: "pick a .json file exported from Pocket Vyley",
      onClick: () => $("import-file").click(),
    }));
    const area = document.createElement("textarea");
    area.className = "save-code";
    area.placeholder = "…or paste a save code here (starts with VYLEY1:)";
    area.spellcheck = false;
    body.appendChild(area);
    body.appendChild(choiceButton({
      name: "📝 Load pasted save code",
      onClick: () => readImportText(area.value, msg),
    }));
    body.appendChild(msg);
  });
};

$("saves").addEventListener("click", actions.saves);

$("import-file").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;
  const text = await file.text();
  const msg = document.querySelector("#modal-body .save-msg") || document.createElement("div");
  readImportText(text, msg);
});

$("reset").addEventListener("click", () => {
  if (!confirm("Start over with a brand new kitten? (all progress is lost)")) return;
  state = freshState();
  lastTick = Date.now();
  $("log").innerHTML = "";
  save();
  greet(true);
  render();
});

function greet(isNew) {
  if (isHalloween()) log("🎃 it's Halloween week! spooky snacks and tickets until 2 November", "trophy");
  if (isNew) {
    log("a new kotka appeared at twilight 🌙", "good");
    setTimeout(() => say("мяу! I'm Vyley, a developer kitty. look after me? :3", 5000), 600);
    return;
  }
  const away = Date.now() - state.savedAt;
  log(`welcome back (away ${fmtDuration(away)})`);
  if (state.sleeping) return;
  setTimeout(() => {
    if (away > 10 * 60000) say(`you're back! I napped the whole ${fmtDuration(away)} you were gone. I missed you. мяу.`);
    else say("oh hi again :3");
  }, 600);
}

if (state.level >= STAGES[2].from && !state.form) state.form = formFor(state.mistakes);
buildRacks();

// catch up on time spent away (stats don't decay while on a ticket)
if (loaded) {
  if (state.task && Date.now() >= state.task.end) finishTask();
  tick();
  greet(false);
} else {
  greet(true);
}

render();
save();
setInterval(tick, 1000);
setInterval(save, 10000);
setInterval(snore, 1300);
setTimeout(idleChatter, 9000);
setTimeout(wander, 3000);
window.addEventListener("beforeunload", save);
