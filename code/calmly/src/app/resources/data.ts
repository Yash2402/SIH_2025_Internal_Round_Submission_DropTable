import { Video, BookOpen, Brain, Headphones, Users, Heart, Shield } from "lucide-react";

export interface Resource {
  title: string;
  type: string;
  url: string;
  description: string;
  duration?: string;
}

export interface ResourceCategory {
  id: string;
  title: string;
  icon: any;
  bgColor: string;
  resources: Resource[];
}

export interface CrisisResource {
  title: string;
  contacts: { label: string; info: string }[];
}

export interface SelfCareTip {
  title: string;
  description: string;
  icon: any;
  bgColor: string;
}

export const resourceCategories: ResourceCategory[] = [
  {
    id: "feel-good-videos",
    title: "Feel Good Videos & Recovery Stories",
    icon: Video,
    bgColor: "bg-red-50",
    resources: [
      {
        title: "You're Not Alone - Mental Health Awareness",
        type: "YouTube Video",
        url: "https://www.youtube.com/watch?v=NiUu8mMZjEA",
        description: "Inspiring stories of hope and recovery from mental health challenges",
        duration: "15 min"
      },
      {
        title: "Depression Recovery Stories",
        type: "YouTube Video", 
        url: "https://www.youtube.com/watch?v=oHv6vTKD6lg",
        description: "Real people sharing their journey through depression and recovery",
        duration: "12 min"
      },
      {
        title: "Anxiety Success Stories",
        type: "YouTube Video",
        url: "https://www.youtube.com/watch?v=dVIzrmhRJBs", 
        description: "How others overcame anxiety and found peace",
        duration: "18 min"
      },
      {
        title: "Mental Health Recovery Playlist",
        type: "YouTube Playlist",
        url: "https://www.youtube.com/playlist?list=PLBXgZMI_zqfR4dvBdX7XHD-fjgoehFM_9",
        description: "Curated collection of inspiring mental health content",
        duration: "Multiple videos"
      },
      {
        title: "Finding Hope in Dark Times",
        type: "YouTube Video",
        url: "https://www.youtube.com/watch?v=pyHVl54BFHI",
        description: "Motivational content for difficult moments",
        duration: "10 min"
      },
      {
        title: "Mental Health Myths Debunked",
        type: "YouTube Video", 
        url: "https://www.youtube.com/watch?v=ja-n5qUNRi8",
        description: "Breaking stigma around mental health",
        duration: "14 min"
      },
      {
        title: "The Science of Wellbeing", 
        type: "YouTube Video",
        url: "https://www.youtube.com/watch?v=n3ZkL5T5Y5M",
        description: "Evidence-based approaches to happiness",
        duration: "22 min"
      },
      {
        title: "Therapy Changed My Life",
        type: "YouTube Video",
        url: "https://www.youtube.com/watch?v=hBzP8MtJf04", 
        description: "Personal testimonies about the power of therapy",
        duration: "16 min"
      }
    ]
  },
  {
    id: "educational",
    title: "Educational Content",
    icon: BookOpen,
    bgColor: "bg-blue-50",
    resources: [
      {
        title: "Understanding Depression",
        type: "Article",
        url: "https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Depression",
        description: "Comprehensive guide to depression symptoms and treatment",
      },
      {
        title: "Anxiety Disorders Explained",
        type: "Article", 
        url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
        description: "Types of anxiety disorders and management strategies",
      },
      {
        title: "Mental Health First Aid",
        type: "Guide",
        url: "https://www.mentalhealthfirstaid.org/",
        description: "How to help someone experiencing a mental health crisis",
      },
      {
        title: "Stress Management Techniques",
        type: "Article",
        url: "https://www.mayoclinic.org/healthy-lifestyle/stress-management/basics/stress-management/hlv-20049495",
        description: "Evidence-based stress reduction methods",
      },
      {
        title: "Building Resilience",
        type: "Research",
        url: "https://www.apa.org/topics/resilience",
        description: "Psychological research on developing resilience",
      }
    ]
  },
  {
    id: "mindfulness",
    title: "Mindfulness & Meditation",
    icon: Brain,
    bgColor: "bg-purple-50",
    resources: [
      {
        title: "Headspace",
        type: "App",
        url: "https://www.headspace.com/",
        description: "Guided meditation and mindfulness exercises",
      },
      {
        title: "Insight Timer",
        type: "App",
        url: "https://insighttimer.com/",
        description: "Free meditation app with thousands of guided sessions",
      },
      {
        title: "Mindfulness-Based Stress Reduction",
        type: "Program",
        url: "https://palousemindfulness.com/",
        description: "Free 8-week MBSR course online",
      },
      {
        title: "UCLA Guided Meditations",
        type: "Audio",
        url: "https://www.uclahealth.org/programs/marc/free-guided-meditations",
        description: "Free guided meditation sessions from UCLA",
      },
      {
        title: "Breathing Exercises",
        type: "Guide",
        url: "https://www.healthline.com/health/breathing-exercise",
        description: "Simple breathing techniques for anxiety relief",
      }
    ]
  },
  {
    id: "mental-health-apps",
    title: "Recommended Mental Health Apps",
    icon: Headphones,
    bgColor: "bg-green-50",
    resources: [
      {
        title: "Calm",
        type: "App",
        url: "https://www.calm.com/",
        description: "Sleep stories, meditation, and relaxation tools",
      },
      {
        title: "Sanvello",
        type: "App", 
        url: "https://www.sanvello.com/",
        description: "Anxiety and depression tracking with coping tools",
      },
      {
        title: "MindShift",
        type: "App",
        url: "https://www.anxietycanada.com/resources/mindshift-app/",
        description: "CBT-based app for anxiety management",
      },
      {
        title: "Talkspace",
        type: "App",
        url: "https://www.talkspace.com/",
        description: "Text-based therapy with licensed therapists",
      },
      {
        title: "PTSD Coach",
        type: "App",
        url: "https://www.ptsd.va.gov/appvid/mobile/ptsdcoach_app.asp",
        description: "Tools for managing PTSD symptoms",
      }
    ]
  },
  {
    id: "support-communities",
    title: "Support Communities",
    icon: Users,
    bgColor: "bg-orange-50",
    resources: [
      {
        title: "Reddit Mental Health",
        type: "Community",
        url: "https://www.reddit.com/r/mentalhealth/",
        description: "Supportive community for mental health discussions",
      },
      {
        title: "Depression and Bipolar Support Alliance",
        type: "Organization",
        url: "https://www.dbsalliance.org/",
        description: "Support groups and resources for mood disorders",
      },
      {
        title: "NAMI Support Groups",
        type: "Support Group",
        url: "https://www.nami.org/Support-Education/Support-Groups",
        description: "Local support groups across the country",
      },
      {
        title: "Mental Health Forum", 
        type: "Forum",
        url: "https://www.mentalhealthforum.net/",
        description: "Peer support and professional advice",
      },
      {
        title: "7 Cups Community",
        type: "Platform",
        url: "https://www.7cups.com/",
        description: "Free emotional support and online therapy",
      }
    ]
  }
];

export const crisisResources: CrisisResource[] = [
  {
    title: "India Crisis Support",
    contacts: [
      { label: "AASRA", info: "91-9820466726" },
      { label: "iCall", info: "9152987821" },
      { label: "Sneha India", info: "044-24640050" }
    ]
  },
  {
    title: "International Support",
    contacts: [
      { label: "Crisis Text Line", info: "Text HOME to 741741" },
      { label: "Samaritans", info: "116 123 (UK)" },
      { label: "Lifeline", info: "1-800-273-8255 (US)" }
    ]
  },
  {
    title: "Online Chat Support",
    contacts: [
      { label: "7 Cups", info: "Free online therapy" },
      { label: "BetterHelp", info: "Professional counseling" },
      { label: "NAMI HelpLine", info: "1-800-950-NAMI" }
    ]
  }
];

export const selfCareTips: SelfCareTip[] = [
  {
    title: "Practice Gratitude",
    description: "Write down 3 things you're grateful for each day",
    icon: Heart,
    bgColor: "bg-blue-100"
  },
  {
    title: "Stay Active",
    description: "Even 10 minutes of walking can boost your mood",
    icon: Brain,
    bgColor: "bg-green-100"
  },
  {
    title: "Connect",
    description: "Reach out to friends, family, or support groups",
    icon: Users,
    bgColor: "bg-purple-100"
  },
  {
    title: "Set Boundaries",
    description: "It's okay to say no and prioritize your wellbeing",
    icon: Shield,
    bgColor: "bg-orange-100"
  }
];

