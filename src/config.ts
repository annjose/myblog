export const SITE = {
  website: "https://annjose.com/",
  author: "Ann Catherine Jose",
  profile: "https://annjose.com/about/",
  desc: "Reflections on software engineering, AI, and personal growth.",
  title: "Reflections",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "",
    url: "",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "America/Los_Angeles",
} as const;
