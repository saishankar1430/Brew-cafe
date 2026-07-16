const u = (q: string) => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=1200&q=70`;

export const galleryImages = [
  { src: u("photo-1495474472287-4d71bcdd2085"), alt: "Barista pouring latte art", h: 900 },
  { src: u("photo-1447933601403-0c6688de566e"), alt: "Coffee cup on wooden table", h: 700 },
  { src: u("photo-1509042239860-f550ce710b93"), alt: "Espresso pour", h: 1100 },
  { src: u("photo-1521017432531-fbd92d768814"), alt: "Cozy café corner", h: 800 },
  { src: u("photo-1442512595331-e89e73853f31"), alt: "Latte on marble", h: 950 },
  { src: u("photo-1559056199-641a0ac8b55e"), alt: "Pastry counter", h: 700 },
  { src: u("photo-1445116572660-236099ec97a0"), alt: "Café interior with plants", h: 1000 },
  { src: u("photo-1453614512568-c4024d13c247"), alt: "Coffee beans macro", h: 750 },
  { src: u("photo-1497935586351-b67a49e012bf"), alt: "Cappuccino from above", h: 900 },
  { src: u("photo-1554118811-1e0d58224f24"), alt: "Guests enjoying coffee", h: 800 },
  { src: u("photo-1511081692775-05d0f180a065"), alt: "Warm café light", h: 1100 },
  { src: u("photo-1509785307050-d4066910ec1e"), alt: "Croissant closeup", h: 700 },
];
