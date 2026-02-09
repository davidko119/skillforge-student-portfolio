
import { Opportunity, Quiz } from './types';

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    title: 'Erasmus+ v Madride',
    type: 'Erasmus',
    date: '2024-09-15',
    description: 'Študijný pobyt na Universidad Complutense de Madrid pre študentov IT.',
    location: 'Madrid, Španielsko',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=800',
    fullContent: 'Tento program je určený pre študentov informatiky, ktorí chcú stráviť semester v jednom z najživších miest Európy. Madrid ponúka skvelú kombináciu technického vzdelania a kultúrneho vyžitia.',
    steps: [
      'Vyplňte prihlášku na domácej univerzite do 1. marca.',
      'Doložte certifikát z angličtiny (min. B2).',
      'Pripravte si motivačný list v španielčine alebo angličtine.',
      'Absolvujte pohovor s Erasmus koordinátorom.'
    ],
    whatToExpect: 'Očakávajte intenzívne štúdium softvérového inžinierstva, množstvo networkingových akcií a nezabudnuteľný študentský život v slnečnom Španielsku.',
    applyLink: 'https://erasmus-plus.ec.europa.eu/',
    tags: ['IT', 'Španielsko', 'Výmenný pobyt']
  },
  {
    id: '2',
    title: 'UX/UI Design Stáž',
    type: 'Stáž',
    date: '2024-06-01',
    description: 'Trojmesačná letná stáž v poprednom digitálnom štúdiu v Bratislave.',
    location: 'Bratislava, SR',
    imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800',
    fullContent: 'Hľadáme talentovaného junior dizajnéra, ktorý sa chce učiť od seniorov v oblasti produktového dizajnu. Budete pracovať na reálnych projektoch pre lokálnych aj svetových klientov.',
    steps: [
      'Pošlite svoje portfólio (Behance/Dribbble) na hr@studio.sk.',
      'Vypracujte krátke testovacie zadanie (redizajn mobilnej appky).',
      'Osobné stretnutie s art directorom.'
    ],
    whatToExpect: 'Rýchle tempo, denné standupy, spätná väzba od expertov a možnosť trvalého zamestnania po skončení stáže.',
    applyLink: 'https://profesia.sk',
    tags: ['Design', 'Slovensko', 'Práca']
  },
  {
    id: '3',
    title: 'AI Workshop: Generative Models',
    type: 'Workshop',
    date: '2024-05-10',
    description: 'Workshop zameraný na praktické využitie Gemini API a LLM.',
    location: 'Online',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    fullContent: 'Tento workshop vás prevedie svetom generatívnej umelej inteligencie. Naučíte sa, ako integrovať Gemini modely do vašich webových aplikácií.',
    steps: [
      'Zaregistrujte sa cez formulár na Eventbrite.',
      'Získajte bezplatný API kľúč pre Google AI Studio.',
      'Pripravte si vývojové prostredie (Node.js/React).'
    ],
    whatToExpect: '4 hodiny intenzívneho kódovania, ukážky prompt engineeringu a prístup k študijným materiálom.',
    applyLink: 'https://eventbrite.com',
    tags: ['IT', 'AI', 'Online']
  },
  {
    id: '4',
    title: 'Erasmus+ v Berlíne',
    type: 'Erasmus',
    date: '2024-10-05',
    description: 'Študijný pobyt na TU Berlin pre inžinierske smery.',
    location: 'Berlín, Nemecko',
    imageUrl: 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&q=80&w=800',
    tags: ['Inžinierstvo', 'Nemecko', 'Výmenný pobyt']
  }
];

// Added MOCK_QUIZZES to resolve import error in App.tsx
export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'q1',
    title: 'Základy UI/UX Designu',
    description: 'Otestuj si svoje vedomosti o farbách, typografii a užívateľskej psychológii.',
    creatorId: 'admin',
    completedBy: [],
    questions: [
      {
        id: 'q1_1',
        text: 'Čo znamená skratka "UX"?',
        options: ['User Experience', 'User Extension', 'Universal X-platform', 'User Example'],
        correctIndex: 0
      },
      {
        id: 'q1_2',
        text: 'Ktorý farebný model sa zvyčajne používa pre digitálne obrazovky?',
        options: ['CMYK', 'RGB', 'Pantone', 'RYB'],
        correctIndex: 1
      }
    ]
  },
  {
    id: 'q2',
    title: 'React & Frontend Vývoj',
    description: 'Kvíz zameraný na moderné webové technológie a knižnicu React.',
    creatorId: 'admin',
    completedBy: [],
    questions: [
      {
        id: 'q2_1',
        text: 'Čo je to "Virtual DOM" v Reacte?',
        options: [
          'Kópia reálneho DOMu v pamäti',
          'Priamy prístup k HTML elementom',
          'Nástroj na animácie',
          'Súbor s CSS štýlmi'
        ],
        correctIndex: 0
      }
    ]
  }
];
