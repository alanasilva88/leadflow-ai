import { QueueList } from "@/components/prospecting/queue-list";
import { verifySession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
export const dynamic="force-dynamic";
export default async function Page(){await verifySession();const end=new Date();end.setDate(end.getDate()+1);const leads=await prisma.lead.findMany({where:{status:{in:["NEW","ANALYZED","FOLLOW_UP"]},OR:[{followUpDate:null},{followUpDate:{lte:end}}]},orderBy:[{salesPotential:"asc"},{opportunityScore:"desc"}],take:50,select:{id:true,businessName:true,salesPotential:true,mainProblem:true,suggestedSolution:true,personalizedMessage:true}});return <div className="space-y-5"><div><h1 className="text-2xl font-bold">Prospectar hoje</h1><p className="mt-1 text-sm text-slate-500">Revise as mensagens e registre o contato manualmente no lead.</p></div>{leads.length?<QueueList leads={leads}/>:<div className="card p-10 text-center text-sm text-slate-500">Nenhuma oportunidade prevista para hoje.</div>}</div>}
