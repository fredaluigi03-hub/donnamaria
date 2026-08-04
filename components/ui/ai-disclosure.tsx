"use client";

import Link from "next/link";
import { Sparkles, X } from "lucide-react";

import { aiDisclosure } from "@/config/site";
import { cn } from "@/lib/utils";

const DIALOG_ID = "ai-disclosure";

// Il pannello è montato una volta sola (nel Footer). Aprirlo da altrove passa
// da qui invece che da un context: <dialog> espone già showModal(), e un
// provider per un singolo booleano sarebbe un layer con un solo consumatore.
export function openAiDisclosure() {
  const el = document.getElementById(DIALOG_ID);
  if (el instanceof HTMLDialogElement) el.showModal();
}

/**
 * Etichetta sui media generati con IA.
 * Il fondo scuro non è decorativo: su una foto chiara il solo testo bianco
 * scenderebbe sotto il rapporto di contrasto 4.5:1.
 * `pointer-events-none` perché ogni media su cui appare è cliccabile
 * (lightbox, coverflow): l'etichetta non deve rubare click né hover.
 */
export function AiTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute z-10 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[0.6rem] font-semibold tracking-wider text-white uppercase backdrop-blur-sm",
        className,
      )}
    >
      <Sparkles className="size-2.5" aria-hidden="true" />
      {aiDisclosure.tagShort}
    </span>
  );
}

/** Nota nella scheda camera, accanto alla galleria della stanza. */
export function AiRoomNote() {
  return (
    <p className="text-muted-foreground flex gap-2.5 text-xs leading-relaxed">
      <Sparkles className="text-warning mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      <span>
        {aiDisclosure.roomNote}{" "}
        <button
          type="button"
          onClick={openAiDisclosure}
          className="text-foreground underline underline-offset-2"
        >
          Come funziona
        </button>
      </span>
    </p>
  );
}

/**
 * Badge + pannello. Va montato UNA sola volta, nel Footer.
 * <dialog> porta con sé focus trap, chiusura con Esc e sfondo inerte: nessuna
 * libreria di modali e nessuna gestione manuale del focus.
 */
export function AiDisclosure() {
  return (
    <>
      <button
        type="button"
        onClick={openAiDisclosure}
        // Testo in `foreground` e non in `warning`: #c08a3e su #faf8f5 sta
        // sotto 4.5:1, l'accento resta sull'icona (decorativa).
        className="btn-3d border-gold/40 bg-card text-foreground inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-[0.7rem] font-semibold tracking-widest uppercase"
      >
        <Sparkles className="text-warning size-3.5" aria-hidden="true" />
        {aiDisclosure.badge}
      </button>

      <dialog
        id={DIALOG_ID}
        aria-labelledby="ai-disclosure-title"
        // <dialog> non chiude da solo cliccando sullo sfondo: il click sul
        // backdrop ha come target il dialog stesso, il contenuto sta nel div.
        onClick={(e) => {
          if (e.target === e.currentTarget)
            (e.currentTarget as HTMLDialogElement).close();
        }}
        className="ai-dialog border-border bg-card text-foreground m-auto w-[min(34rem,calc(100vw-2rem))] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <div className="p-6 md:p-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="text-warning size-5 shrink-0" aria-hidden="true" />
              <h2
                id="ai-disclosure-title"
                className="font-display text-2xl font-medium tracking-tight md:text-3xl"
              >
                {aiDisclosure.panelTitle}
              </h2>
            </div>
            <form method="dialog">
              <button
                aria-label="Chiudi"
                className="text-muted-foreground hover:text-foreground -m-2 flex size-11 items-center justify-center transition-colors"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </form>
          </div>

          <div className="text-muted-foreground space-y-3.5 text-sm leading-relaxed">
            {aiDisclosure.panelBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <Link
            href={aiDisclosure.href}
            // Il layout (e quindi questo <dialog>) sopravvive alla navigazione
            // client di Next: senza chiuderlo resterebbe aperto sulla pagina
            // di destinazione.
            onClick={(e) => e.currentTarget.closest("dialog")?.close()}
            className="text-foreground mt-6 inline-block text-xs font-semibold tracking-widest uppercase underline underline-offset-4"
          >
            Dichiarazione completa →
          </Link>
        </div>
      </dialog>
    </>
  );
}
