import clientHolder from '../../public/img/client_holder.png';

export const CLIENTS = [
  { alt: "client1", logo: clientHolder },
  { alt: "client2", logo: clientHolder },
  { alt: "client3", logo: clientHolder },
  { alt: "client4", logo: clientHolder},
  { alt: "client5", logo: clientHolder },
  { alt: "client1", logo: clientHolder },
  { alt: "client2", logo: clientHolder },
  { alt: "client3", logo: clientHolder },
  { alt: "client4", logo: clientHolder },
  { alt: "client5", logo: clientHolder },
];

export const MAX_FOLDERS_LENGTH = 5;

export const FEATURES = [
  {
    title: 'Real Time Collaboration',
    description: 'Lorem ipsum',
    bgUrl: '/img/wave-1.jpg'
  },
  {
    title: 'Unlimited files upload',
    description: 'Lorem Ipsum',
    bgUrl: '/img/wave-4.jpg'
  },
  {
    title: 'Highly customizable workspaces',
    description: 'Lorem Ipsum',
    bgUrl: '/img/wave-3.jpg'
  },
  {
    title: 'And other...',
    description: 'Lorem Ipsum',
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