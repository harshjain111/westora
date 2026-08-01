"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/form/Field";
import { CountrySelect } from "@/components/form/CountrySelect";
import { ProductMultiSelect } from "@/components/form/ProductMultiSelect";
import { ConsentCheckbox } from "@/components/form/ConsentCheckbox";
import { SuccessPanel } from "@/components/form/SuccessPanel";
import { TurnstileWidget } from "@/components/form/TurnstileWidget";
import { inputClassName } from "@/components/form/inputStyles";
import { enquirySchema, type EnquiryFormValues } from "@/lib/schemas/enquiry";
import { submitEnquiry } from "@/lib/actions/enquiry";
import { track } from "@/lib/analytics/track";
import { getBySlug } from "@/data/products";
import { company } from "@/data/company";
import { cn } from "@/lib/utils/cn";

export interface EnquiryFormProps {
  variant: "full" | "compact";
  lockedProduct?: string;
  sourceSection: "modal" | "main_form" | "product_page";
  className?: string;
}

export function EnquiryForm({ variant, lockedProduct, sourceSection, className }: EnquiryFormProps) {
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [productsExpanded, setProductsExpanded] = useState(!lockedProduct);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const hasStartedRef = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    mode: "onBlur",
    defaultValues: {
      country: "United Kingdom",
      phoneDialCode: "+44",
      products: lockedProduct ? [lockedProduct] : [],
      consent: undefined,
      companyWebsite: "",
    },
  });

  const selectedProducts = watch("products");
  const lockedProductData = lockedProduct ? getBySlug(lockedProduct) : undefined;

  const onSubmit = async (values: EnquiryFormValues) => {
    setServerError(null);
    const params = new URLSearchParams(window.location.search);
    const result = await submitEnquiry({
      ...values,
      sourceSection,
      sourceProduct: lockedProduct,
      turnstileToken: turnstileToken ?? undefined,
      utmSource: params.get("utm_source") ?? undefined,
      utmMedium: params.get("utm_medium") ?? undefined,
      utmCampaign: params.get("utm_campaign") ?? undefined,
    });

    if (result.success) {
      track("enquiry_form_submit", {
        source_section: sourceSection,
        source_product: lockedProduct,
        product_count: values.products.length,
      });
      setReference(result.reference);
      setSubmitState("success");
    } else {
      setServerError(result.error);
      setSubmitState("error");
      // Typed data is preserved — react-hook-form doesn't reset on a
      // failed submit unless we call reset() ourselves, which we don't.
    }
  };

  const onInvalid = (formErrors: typeof errors) => {
    for (const field of Object.keys(formErrors)) {
      track("enquiry_form_error", { field });
    }
  };

  const onFormFocus = () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    track("enquiry_form_start", { source_section: sourceSection, source_product: lockedProduct });
  };

  if (submitState === "success" && reference) {
    return <SuccessPanel reference={reference} />;
  }

  const isCompact = variant === "compact";

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      onFocusCapture={onFormFocus}
      noValidate
      className={cn("flex flex-col gap-6", className)}
    >
      {/* Honeypot — visually hidden, real visitors never fill it in. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="companyWebsite">Leave this field blank</label>
        <input id="companyWebsite" type="text" tabIndex={-1} autoComplete="off" {...register("companyWebsite")} />
      </div>

      <div className={cn("grid grid-cols-1 gap-6", !isCompact && "sm:grid-cols-2")}>
        <Field label="Full name" htmlFor="fullName" required error={errors.fullName?.message}>
          <input id="fullName" className={inputClassName} {...register("fullName")} />
        </Field>

        <Field label="Company name" htmlFor="companyName" required error={errors.companyName?.message}>
          <input id="companyName" className={inputClassName} {...register("companyName")} />
        </Field>

        <Field label="Work email" htmlFor="email" required error={errors.email?.message}>
          <input id="email" type="email" className={inputClassName} {...register("email")} />
        </Field>

        <Field label="Phone / WhatsApp" htmlFor="phone" required error={errors.phone?.message}>
          <div className="flex gap-2">
            <select
              aria-label="Dial code"
              className={cn(inputClassName, "w-24 shrink-0")}
              {...register("phoneDialCode")}
            >
              <option value="+44">+44</option>
              <option value="+1">+1</option>
              <option value="+91">+91</option>
            </select>
            <input id="phone" type="tel" className={inputClassName} {...register("phone")} />
          </div>
        </Field>

        <Field label="Country" htmlFor="country" required error={errors.country?.message}>
          <CountrySelect id="country" {...register("country")} />
        </Field>

        <Field label="Estimated volume" htmlFor="volume" error={errors.volume?.message}>
          <input
            id="volume"
            placeholder="e.g. 2 tonnes / month"
            className={inputClassName}
            {...register("volume")}
          />
        </Field>

        <Field label="Destination port" htmlFor="destinationPort" error={errors.destinationPort?.message}>
          <input id="destinationPort" className={inputClassName} {...register("destinationPort")} />
        </Field>
      </div>

      <Field
        label="Products of interest"
        htmlFor="products"
        required
        error={errors.products?.message}
      >
        {lockedProductData && !productsExpanded ? (
          <div className="flex items-center justify-between gap-4 border border-accent bg-accent/5 px-4 py-3 text-body text-ink">
            <span>{lockedProductData.name}</span>
            <button
              type="button"
              onClick={() => setProductsExpanded(true)}
              className="flex min-h-11 items-center font-mono text-small tracking-mono-label text-accent underline underline-offset-2"
            >
              Add more products
            </button>
          </div>
        ) : (
          <ProductMultiSelect
            id="products"
            value={selectedProducts ?? []}
            onChange={(slugs) => setValue("products", slugs, { shouldValidate: true })}
          />
        )}
      </Field>

      <Field label="Message" htmlFor="message" error={errors.message?.message}>
        <textarea id="message" rows={4} className={inputClassName} {...register("message")} />
      </Field>

      <ConsentCheckbox {...register("consent")} />
      {errors.consent && (
        <p role="alert" className="text-small font-medium text-ink">
          — {errors.consent.message}
        </p>
      )}

      {submitState === "error" && serverError && (
        <p role="alert" className="border border-ink px-4 py-3 text-small text-ink">
          {serverError} If this keeps happening, email us directly at{" "}
          <a href={`mailto:${company.contact.email}`} className="underline underline-offset-2">
            {company.contact.email}
          </a>
          .
        </p>
      )}

      <TurnstileWidget onVerify={setTurnstileToken} />

      <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="self-start">
        Send enquiry
      </Button>
    </form>
  );
}
