"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  LeadResponse,
  LeadStatus,
  SalesPotential,
  type Lead,
} from "@prisma/client";
import Link from "next/link";
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
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {input}
      <FormFieldError message={errors[name]?.message as string | undefined} />
    </div>
  );
  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6">
      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}
      <section className="card p-5 sm:p-6">
        <h2 className="font-semibold">Dados do negócio</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {field(
            "businessName",
            "Nome do negócio",
            <input
              id="businessName"
              className="input"
              autoFocus
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
      <section className="card p-5 sm:p-6">
        <h2 className="font-semibold">Presença digital</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
      <section className="card p-5 sm:p-6">
        <h2 className="font-semibold">Diagnóstico</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {field(
            "salesPotential",
            "Potencial de venda",
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
      <section className="card p-5 sm:p-6">
        <h2 className="font-semibold">Prospecção</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
            "Data do contato",
            <input
              id="contactedAt"
              className="input"
              type="date"
              {...register("contactedAt")}
            />,
          )}
          {field(
            "followUpDate",
            "Data de follow-up",
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
              "Observações",
              <textarea
                id="notes"
                className="input min-h-28"
                {...register("notes")}
              />,
            )}
          </div>
        </div>
      </section>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href={lead ? `/leads/${lead.id}` : "/leads"}
          className="btn-secondary"
        >
          Cancelar
        </Link>
        <SubmitButton pending={pending}>
          {lead ? "Salvar alterações" : "Cadastrar lead"}
        </SubmitButton>
      </div>
    </form>
  );
}
