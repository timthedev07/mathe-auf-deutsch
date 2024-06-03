import { FC } from "react";

const Section: FC<{ title: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold text-white">{title}</h1>
      <hr className="h-0 border-1 border-slate-200/30" />
      {children}
    </section>
  );
};

export default function Home() {
  return (
    <div className="px-16 py-16 max-w-[1000px] mx-auto">
      <Section title="Worum geht es bei dieser Website?">
        <p>
          Ich habe im Mai 2024 mit dieser persönlichen Website angefangen.
          Damals war ich noch ein IB-Schüler, der Mathematik, Informatik und
          Physik auf dem hohen Niveau und Deutsch B auf SL belegte. Ich hatte
          und habe noch immer eine so starke Leidenschaft für diese Fächer,
          insbesondere Mathematik, da ich vor hatte, die an der Universität zu
          studieren.
        </p>
        <p>
          Also, das Ziel dieser Website ist, die faszinierenden Momente und
          interessante Gedanken, denen ich in Mathe oder den anderen Fächern
          begegne, irgendwo festzuhalten... natürlich ist alles auf Deutsch!
          Warum? Gute Frage. Ich habe einfach Lust darauf, denn ich liebe auch
          die deutsche Sprache und Kultur, und dadurch kann ich auch mein
          Deutsch verbessern.
        </p>
        <p>
          Möglicherweise werde ich noch mit dieser Website fortfahren, sogar an
          der Universität... Jetzt ist es noch Mai 2024, und in diesem
          Augenblick bin ich mir noch nicht sicher.
        </p>
        <p>
          Es ist ganz normal, dass man manchmal einige Fehler in meinen Artikeln
          bemerken kann. Wenn Sie irgendwelche Fehler finden, bitte lassen Sie
          mich wissen (timpersonal07@gmail.com), ich möchte auch von euch
          lernen!
        </p>
      </Section>
    </div>
  );
}
