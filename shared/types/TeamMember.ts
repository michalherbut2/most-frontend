export interface TeamMember {
  id: number;
  memberId: string;
  name: string;
  fullName: string;
  imageUrl: string;
  panelId: string;
  description: string;
  phone: string;
  email: string;
  facebookUrl: string;
  section: string; // "Sekstet", "Przęsłowi", "Podprzęsłowi"
  belongsTo: string; // Dla Podprzęsłowych - nazwa przęsła
  createdAt: string;
  updatedAt: string;
}