import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="flex flex-1 items-center justify-center bg-base py-24">
      <Container className="max-w-md text-center">
        <p className="font-mono text-display font-display text-tech-blue">404</p>
        <h1 className="mt-4 text-heading-sm font-semibold">{t("heading")}</h1>
        <div className="mt-8 flex justify-center">
          <Button href="/">{t("backHome")}</Button>
        </div>
      </Container>
    </section>
  );
}
