import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  LeadResponse,
  LeadStatus,
  PrismaClient,
  SalesPotential,
} from "@prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  }),
});

const day = 24 * 60 * 60 * 1000;
const now = new Date();

const leads = [
  { businessName: "Clínica Pata Serena", phone: "(11) 98888-1001", instagram: "@pataserena_ficticia", rating: 4.8, reviewCount: 324, segment: "Clínica veterinária", city: "São Paulo", salesPotential: SalesPotential.HIGH, websiteStatus: "Sem site", mainProblem: "Não possui presença própria na web", suggestedSolution: "Landing page com agendamento", status: LeadStatus.NEW },
  { businessName: "Vet Aurora", phone: "(11) 98888-1002", website: "https://example.com/vet-aurora", rating: 4.2, reviewCount: 82, segment: "Clínica veterinária", city: "Campinas", salesPotential: SalesPotential.MEDIUM, websiteStatus: "Site desatualizado", websiteScore: 5, status: LeadStatus.ANALYZED },
  { businessName: "Bicho & Brisa", instagram: "https://instagram.com/exemplo", rating: 4.9, reviewCount: 611, segment: "Hospital veterinário", city: "Santos", salesPotential: SalesPotential.HIGH, websiteStatus: "Sem site", status: LeadStatus.CONTACTED, contactedAt: new Date(now.getTime() - day), response: LeadResponse.NO_RESPONSE },
  { businessName: "Centro Vet Girassol", phone: "(21) 97777-2001", website: "https://example.com/girassol", rating: 3.9, reviewCount: 17, segment: "Clínica veterinária", city: "Rio de Janeiro", salesPotential: SalesPotential.MEDIUM, websiteStatus: "Site básico", websiteScore: 6, status: LeadStatus.FOLLOW_UP, followUpDate: new Date(), response: LeadResponse.CONTACT_LATER },
  { businessName: "Clínica Focinho Feliz", phone: "(31) 96666-3001", instagram: "@focinhofeliz_demo", rating: 4.7, reviewCount: 145, segment: "Clínica veterinária", city: "Belo Horizonte", salesPotential: SalesPotential.HIGH, status: LeadStatus.RESPONDED, response: LeadResponse.POSITIVE },
  { businessName: "Vet Horizonte Azul", website: "https://example.com/horizonte", rating: 4.4, reviewCount: 231, segment: "Hospital veterinário", city: "Niterói", salesPotential: SalesPotential.HIGH, websiteStatus: "Site lento no celular", websiteScore: 4, status: LeadStatus.MEETING, followUpDate: new Date(now.getTime() + day), response: LeadResponse.MEETING_SCHEDULED },
  { businessName: "Espaço Animal Ipê", phone: "(41) 95555-4001", rating: 4.0, reviewCount: 9, segment: "Consultório veterinário", city: "Curitiba", salesPotential: SalesPotential.LOW, websiteStatus: "Sem site", status: LeadStatus.PROPOSAL, response: LeadResponse.PROPOSAL_SENT },
  { businessName: "Clínica Quatro Patas do Sul", instagram: "@quatropatas_demo", rating: 4.9, reviewCount: 802, segment: "Hospital veterinário", city: "Porto Alegre", salesPotential: SalesPotential.HIGH, status: LeadStatus.CLOSED, response: LeadResponse.DEAL_CLOSED },
  { businessName: "Vet Jardim Lunar", phone: "(51) 94444-5001", rating: 3.5, reviewCount: 4, segment: "Consultório veterinário", city: "Canoas", salesPotential: SalesPotential.LOW, status: LeadStatus.LOST, response: LeadResponse.NEGATIVE },
  { businessName: "Clínica Arca Clara", website: "https://example.com/arca-clara", instagram: "@arcaclara_demo", rating: 4.6, reviewCount: 93, segment: "Clínica veterinária", city: "Recife", salesPotential: SalesPotential.MEDIUM, websiteStatus: "Site adequado", websiteScore: 8, status: LeadStatus.NEW },
  { businessName: "Núcleo Vet Estrela", phone: "(71) 93333-6001", rating: 4.1, reviewCount: 56, segment: "Clínica veterinária", city: "Salvador", salesPotential: SalesPotential.MEDIUM, websiteStatus: "Sem site", status: LeadStatus.FOLLOW_UP, followUpDate: new Date(now.getTime() + 2 * day), response: LeadResponse.MORE_INFORMATION },
  { businessName: "Casa Vet Manacá", website: "https://example.com/manaca", rating: 4.8, reviewCount: 278, segment: "Clínica veterinária", city: "Brasília", salesPotential: SalesPotential.HIGH, websiteStatus: "Não converte visitas", websiteScore: 7, status: LeadStatus.CONTACTED, contactedAt: new Date(now.getTime() - 2 * day), followUpDate: new Date(now.getTime() + 3 * day), notes: "Interessada em automação de agendamentos." },
];

async function main() {
  await prisma.lead.deleteMany();
  await prisma.lead.createMany({ data: leads });
  console.log(`${leads.length} leads fictícios criados.`);
}

main()
  .finally(async () => prisma.$disconnect());
