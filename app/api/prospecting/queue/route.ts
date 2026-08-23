import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
export async function GET(){try{await requireSession();const leads=await prisma.lead.findMany({where:{status:{in:["NEW","ANALYZED","FOLLOW_UP"]}},orderBy:{opportunityScore:"desc"},take:50});return Response.json({leads});}catch{return Response.json({message:"Não autorizado."},{status:401});}}
