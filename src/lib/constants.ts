import client1 from "../../public/img/client1.png";
import client2 from "../../public/img/client2.png";
import client3 from "../../public/img/client3.png";
import client4 from "../../public/img/client4.png";
import client5 from "../../public/img/client5.png";

export const CLIENTS = [
  { alt: "client1", logo: client1 },
  { alt: "client2", logo: client2 },
  { alt: "client3", logo: client3 },
  { alt: "client4", logo: client4 },
  { alt: "client5", logo: client5 },
  { alt: "client1", logo: client1 },
  { alt: "client2", logo: client2 },
  { alt: "client3", logo: client3 },
  { alt: "client4", logo: client4 },
  { alt: "client5", logo: client5 },
];

export const MAX_FOLDERS_LENGTH = 5;

export const FEATURES = [
  {
    title: 'Mur mur',
    description: 'Mur mur',
    bgUrl: '/img/wave-1.jpg'
  },
  {
    title: 'Mur mur',
    description: 'Mur mur',
    bgUrl: '/img/wave-4.jpg'
  },
  {
    title: 'Mur mur',
    description: 'Mur mur',
    bgUrl: '/img/wave-3.jpg'
  },
  {
    title: 'Mur mur',
    description: 'Mur mur',
    bgUrl: '/img/flower-1.jpg'
  },
]

export const PRICING_CARDS = [
  {
    planType: 'Free Plan',
    price: 0,
    description: 'Limited feature for teams',
    highlightFeature: '',
    features: [
      "it's free",
      "unlimited file upload",
      'idk you name it'
    ],
  },
  {
    planType: 'Pro Plan',
    price: 9.99,
    description: 'Unlimited power!',
    highlightFeature: 'Unlimited everything',
    features: [
      "it's paid",
      "unlimited file upload",
      'unlimited friends',
      'unlimited folders',
      'idk you name it'
    ],
  },
]