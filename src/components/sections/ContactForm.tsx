"use client";

import {
  useId,
  useRef,
  useState,
  type FormEvent,
  type MutableRefObject,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/icons/Icon";
import { Button } from "@/components/ui/Button";
import { services } from "@/content/services";

type Status = "idle" | "sending" | "success" | "error";

type FieldName =
  | "fullName"
  | "company"
  | "email"
  | "phone"
  | "serviceInterest"
  | "budgetRange"
  | "projectDetails";

type FieldErrors = Partial<Record<FieldName, string>>;

type FormValues = Record<FieldName, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s().-]{7,20}$/;

const inputBase =
  "w-full rounded-sm border bg-base px-3.5 py-2.5 text-body-sm placeholder:text-ink-muted transition-colors duration-150 focus-visible:outline-none";

function fieldClasses(invalid: boolean, extra = "") {
  return [
    inputBase,
    invalid
      ? "border-red-500 text-ink focus-visible:border-red-500"
      : "border-line text-ink hover:border-tech-blue/50 focus-visible:border-tech-blue",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function ContactForm() {
  const t = useTranslations("contact.form");
  const tServices = useTranslations("services.items");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [formKey, setFormKey] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serviceInterest, setServiceInterest] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const firstErrorRef = useRef<HTMLElement | null>(null);
  const budgetRanges = t.raw("budgetRanges") as string[];

  function clearError(name: FieldName) {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function validate(values: FormValues): FieldErrors {
    const next: FieldErrors = {};

    if (!values.fullName.trim()) next.fullName = t("requiredError");

    if (!values.email.trim()) next.email = t("requiredError");
    else if (!EMAIL_RE.test(values.email.trim())) next.email = t("emailError");

    if (values.phone.trim() && !PHONE_RE.test(values.phone.trim())) {
      next.phone = t("phoneError");
    }

    if (!values.serviceInterest.trim()) next.serviceInterest = t("requiredError");

    if (!values.projectDetails.trim()) next.projectDetails = t("requiredError");
    else if (values.projectDetails.trim().length < 20) {
      next.projectDetails = t("detailsMinError");
    }

    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("idle");

    const form = e.currentTarget;
    const data = new FormData(form);
    const values: FormValues = {
      fullName: String(data.get("fullName") ?? ""),
      company: String(data.get("company") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      serviceInterest: String(data.get("serviceInterest") ?? ""),
      budgetRange: String(data.get("budgetRange") ?? ""),
      projectDetails: String(data.get("projectDetails") ?? ""),
    };

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      requestAnimationFrame(() => {
        firstErrorRef.current?.focus();
      });
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
        setServiceInterest("");
        setBudgetRange("");
        setErrors({});
        setFormKey((k) => k + 1);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-sm border border-line bg-surface p-6 text-body text-ink">
        {t("success")}
      </div>
    );
  }

  const order: FieldName[] = [
    "fullName",
    "company",
    "email",
    "phone",
    "serviceInterest",
    "budgetRange",
    "projectDetails",
  ];
  const firstError = order.find((name) => errors[name]);

  return (
    <form key={formKey} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t("fullName")}
          required
          error={errors.fullName}
          setFirstErrorRef={firstError === "fullName" ? firstErrorRef : undefined}
        >
          {(id, describedBy, invalid) => (
            <input
              id={id}
              name="fullName"
              type="text"
              autoComplete="name"
              required
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={fieldClasses(invalid)}
              onChange={() => clearError("fullName")}
            />
          )}
        </Field>
        <Field label={t("company")} optionalLabel={t("optional")} error={errors.company}>
          {(id, describedBy, invalid) => (
            <input
              id={id}
              name="company"
              type="text"
              autoComplete="organization"
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={fieldClasses(invalid)}
              onChange={() => clearError("company")}
            />
          )}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t("email")}
          required
          error={errors.email}
          setFirstErrorRef={firstError === "email" ? firstErrorRef : undefined}
        >
          {(id, describedBy, invalid) => (
            <input
              id={id}
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={fieldClasses(invalid)}
              onChange={() => clearError("email")}
            />
          )}
        </Field>
        <Field
          label={t("phone")}
          optionalLabel={t("optional")}
          error={errors.phone}
          setFirstErrorRef={firstError === "phone" ? firstErrorRef : undefined}
        >
          {(id, describedBy, invalid) => (
            <input
              id={id}
              name="phone"
              type="tel"
              autoComplete="tel"
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={fieldClasses(invalid)}
              onChange={() => clearError("phone")}
            />
          )}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t("serviceInterest")}
          required
          error={errors.serviceInterest}
          setFirstErrorRef={firstError === "serviceInterest" ? firstErrorRef : undefined}
        >
          {(id, describedBy, invalid) => (
            <SelectField
              id={id}
              name="serviceInterest"
              required
              invalid={invalid}
              describedBy={describedBy}
              value={serviceInterest}
              onValueChange={(value) => {
                setServiceInterest(value);
                clearError("serviceInterest");
              }}
            >
              <option value="" disabled>
                {t("serviceInterestPlaceholder")}
              </option>
              {services.map((s) => (
                <option key={s.slug} value={tServices(`${s.slug}.title`)}>
                  {tServices(`${s.slug}.title`)}
                </option>
              ))}
            </SelectField>
          )}
        </Field>
        <Field label={t("budgetRange")} optionalLabel={t("optional")} error={errors.budgetRange}>
          {(id, describedBy, invalid) => (
            <SelectField
              id={id}
              name="budgetRange"
              invalid={invalid}
              describedBy={describedBy}
              value={budgetRange}
              onValueChange={(value) => {
                setBudgetRange(value);
                clearError("budgetRange");
              }}
            >
              <option value="">{t("budgetRangePlaceholder")}</option>
              {budgetRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </SelectField>
          )}
        </Field>
      </div>

      <Field
        label={t("projectDetails")}
        required
        error={errors.projectDetails}
        setFirstErrorRef={firstError === "projectDetails" ? firstErrorRef : undefined}
      >
        {(id, describedBy, invalid) => (
          <textarea
            id={id}
            name="projectDetails"
            required
            rows={5}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={fieldClasses(invalid, "resize-none")}
            onChange={() => clearError("projectDetails")}
          />
        )}
      </Field>

      {status === "error" && (
        <p role="alert" className="text-body-sm text-red-500">
          {t("serverError")}
        </p>
      )}

      <Button type="submit" disabled={status === "sending"} showArrow>
        {status === "sending" ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}

function SelectField({
  children,
  className,
  invalid = false,
  describedBy,
  value,
  onValueChange,
  ...props
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange" | "defaultValue"> & {
  invalid?: boolean;
  describedBy?: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  const empty = value === "";

  return (
    <div className="relative">
      <select
        {...props}
        value={value}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onChange={(e) => onValueChange(e.target.value)}
        className={[
          fieldClasses(invalid, "cursor-pointer appearance-none pr-10"),
          empty ? "text-ink-muted" : "text-ink",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </select>
      <Icon
        name="chevron-down"
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
        aria-hidden
      />
    </div>
  );
}

function Field({
  label,
  required,
  optionalLabel,
  error,
  setFirstErrorRef,
  children,
}: {
  label: string;
  required?: boolean;
  optionalLabel?: string;
  error?: string;
  setFirstErrorRef?: MutableRefObject<HTMLElement | null>;
  children: (id: string, describedBy: string | undefined, invalid: boolean) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const invalid = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5 text-body-sm">
      <label htmlFor={id} className="font-medium text-ink">
        {label}
        {!required && optionalLabel && (
          <span className="ml-1 text-ink-muted">({optionalLabel})</span>
        )}
      </label>
      <div
        ref={(node) => {
          if (!setFirstErrorRef) return;
          const control = node?.querySelector<HTMLElement>("input, select, textarea");
          setFirstErrorRef.current = control ?? null;
        }}
      >
        {children(id, error ? errorId : undefined, invalid)}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-body-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
