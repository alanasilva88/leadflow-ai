"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  LeadResponse,
  LeadStatus,
  SalesPotential,
  type Lead,
} from "@prisma/client";
import Link from "next/link";
import { BriefcaseBusiness, Building2, CalendarDays, Save, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createLead, updateLead } from "@/lib/actions/lead-actions";
import {
  responseLabels,
  statusLabels,
  potentialLabels,
} from "@/lib/utils/lead-labels";
import {
  leadSchema,
  type LeadFormInput,
  type LeadFormValues,
} from "@/lib/validations/lead-schema";
import { FormFieldError } from "@/components/ui/form-field-error";
import { SubmitButton } from "@/components/ui/submit-button";

function dateInput(value?: Date | null) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}
const text = (value?: string | null) => value ?? "";

export function LeadForm({ lead }: { lead?: Lead }) {
  const [serverError, setServerError] = useState("");
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormInput, unknown, LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: lead
      ? {
          businessName: lead.businessName,
          phone: text(lead.phone),
          instagram: text(lead.instagram),
          website: text(lead.website),
          rating: lead.rating ?? "",
          reviewCount: lead.reviewCount ?? "",
          segment: text(lead.segment),
          city: text(lead.city),
          salesPotential: lead.salesPotential,
          websiteStatus: text(lead.websiteStatus),
          websiteScore: lead.websiteScore ?? "",
          mainProblem: text(lead.mainProblem),
          suggestedSolution: text(lead.suggestedSolution),
          personalizedMessage: text(lead.personalizedMessage),
          status: lead.status,
          contactedAt: dateInput(lead.contactedAt),
          followUpDate: dateInput(lead.followUpDate),
          response: lead.response ?? "",
          notes: text(lead.notes),
        }
      : {
          businessName: "",
          salesPotential: SalesPotential.MEDIUM,
          status: LeadStatus.NEW,
          response: "",
        },
  });
  const submit = (values: LeadFormValues) => {
    setServerError("");
    startTransition(async () => {
      const result = lead
        ? await updateLead(lead.id, values)
        : await createLead(values);
      if (!result.success)
        setServerError(result.message ?? "Não foi possível salvar o lead.");
    });
  };
  const field = (
    name: keyof LeadFormValues,
    label: string,
    input: React.ReactNode,
    required = false,
  ) => (
    <div>
      <label
        htmlFor={name}
        className="mb-1 block text-xs font-medium tracking-[.02em] text-[#464555]"
      >
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {input}
      <FormFieldError message={errors[name]?.message as string | undefined} />
    </div>
  );
  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-8">
      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}
      <section className="overflow-hidden rounded-xl border border-[#c7c4d8] bg-white shadow-sm">
        <h2 className="flex items-center gap-2 border-b border-[#c7c4d8] bg-[#f8f9fa] px-5 py-4 text-xl font-medium tracking-[-.02em] sm:px-8"><Building2 size={20} className="text-[#3525cd]"/>Empresa</h2>
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
          {field(
            "businessName",
            "Nome",
            <input
              id="businessName"
              className="input"
              autoFocus
              placeholder="Ex: Acme Corp"
              {...register("businessName")}
            />,
            true,
          )}
          {field(
            "segment",
            "Segmento",
            <input
              id="segment"
              className="input"
              placeholder="Ex.: Clínica veterinária"
              {...register("segment")}
            />,
          )}
          {field(
            "city",
            "Cidade",
            <input id="city" className="input" {...register("city")} />,
          )}
          {field(
            "phone",
            "Telefone",
            <input
              id="phone"
              className="input"
              inputMode="tel"
              {...register("phone")}
            />,
          )}
          {field(
            "rating",
            "Nota de avaliação",
            <input
              id="rating"
              className="input"
              type="number"
              min="0"
              max="5"
              step="0.1"
              {...register("rating")}
            />,
          )}
          {field(
            "reviewCount",
            "Número de avaliações",
            <input
              id="reviewCount"
              className="input"
              type="number"
              min="0"
              step="1"
              {...register("reviewCount")}
            />,
          )}
        </div>
      </section>
      <section className="overflow-hidden rounded-xl border border-[#c7c4d8] bg-white shadow-sm">
        <h2 className="flex items-center gap-2 border-b border-[#c7c4d8] bg-[#f8f9fa] px-5 py-4 text-xl font-medium tracking-[-.02em] sm:px-8"><BriefcaseBusiness size={20} className="text-[#3525cd]"/>Presença digital</h2>
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
          {field(
            "website",
            "Site",
            <input
              id="website"
              className="input"
              placeholder="https://..."
              {...register("website")}
            />,
          )}
          {field(
            "instagram",
            "Instagram",
            <input
              id="instagram"
              className="input"
              placeholder="@perfil ou URL"
              {...register("instagram")}
            />,
          )}
          {field(
            "websiteStatus",
            "Situação do site",
            <input
              id="websiteStatus"
              className="input"
              {...register("websiteStatus")}
            />,
          )}
          {field(
            "websiteScore",
            "Nota do site",
            <input
              id="websiteScore"
              className="input"
              type="number"
              min="0"
              max="10"
              step="1"
              {...register("websiteScore")}
            />,
          )}
        </div>
      </section>
      <section className="overflow-hidden rounded-xl border border-[#c7c4d8] bg-white shadow-sm">
        <h2 className="flex items-center gap-2 border-b border-[#c7c4d8] bg-[#f8f9fa] px-5 py-4 text-xl font-medium tracking-[-.02em] sm:px-8"><Sparkles size={20} className="text-[#3525cd]"/>Qualificação &amp; Contexto</h2>
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
          {field(
            "salesPotential",
            "Prioridade",
            <select
              id="salesPotential"
              className="input"
              {...register("salesPotential")}
            >
              {Object.values(SalesPotential).map((v) => (
                <option key={v} value={v}>
                  {potentialLabels[v]}
                </option>
              ))}
            </select>,
          )}
          <div />
          {field(
            "mainProblem",
            "Problema principal",
            <textarea
              id="mainProblem"
              className="input min-h-24"
              {...register("mainProblem")}
            />,
          )}
          {field(
            "suggestedSolution",
            "Solução sugerida",
            <textarea
              id="suggestedSolution"
              className="input min-h-24"
              {...register("suggestedSolution")}
            />,
          )}
          <div className="sm:col-span-2">
            {field(
              "personalizedMessage",
              "Mensagem personalizada",
              <textarea
                id="personalizedMessage"
                className="input min-h-28"
                {...register("personalizedMessage")}
              />,
            )}
          </div>
        </div>
      </section>
      <section className="overflow-hidden rounded-xl border border-[#c7c4d8] bg-white shadow-sm">
        <h2 className="flex items-center gap-2 border-b border-[#c7c4d8] bg-[#f8f9fa] px-5 py-4 text-xl font-medium tracking-[-.02em] sm:px-8"><CalendarDays size={20} className="text-[#3525cd]"/>Acompanhamento</h2>
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
          {field(
            "status",
            "Status",
            <select id="status" className="input" {...register("status")}>
              {Object.values(LeadStatus).map((v) => (
                <option key={v} value={v}>
                  {statusLabels[v]}
                </option>
              ))}
            </select>,
          )}
          {field(
            "response",
            "Resposta",
            <select id="response" className="input" {...register("response")}>
              <option value="">Não informado</option>
              {Object.values(LeadResponse).map((v) => (
                <option key={v} value={v}>
                  {responseLabels[v]}
                </option>
              ))}
            </select>,
          )}
          {field(
            "contactedAt",
            "Data do 1º contato",
            <input
              id="contactedAt"
              className="input"
              type="date"
              {...register("contactedAt")}
            />,
          )}
          {field(
            "followUpDate",
            "Data do próximo follow-up",
            <input
              id="followUpDate"
              className="input"
              type="date"
              {...register("followUpDate")}
            />,
          )}
          <div className="sm:col-span-2">
            {field(
              "notes",
              "Notas adicionais",
              <textarea
                id="notes"
                className="input min-h-28"
                {...register("notes")}
              />,
            )}
          </div>
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#c7c4d8] bg-white px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,.05)]">
        <div className="mx-auto flex max-w-3xl justify-end gap-4">
        <Link
          href={lead ? `/leads/${lead.id}` : "/leads"}
          className="btn-secondary"
        >
          Cancelar
        </Link>
        <SubmitButton pending={pending}>
          <Save size={14}/>{lead ? "Salvar alterações" : "Cadastrar lead"}
        </SubmitButton>
        </div>
      </div>
    </form>
  );
}
