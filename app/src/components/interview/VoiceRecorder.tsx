"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Mic, MicOff, AlertTriangle } from "lucide-react";

interface Props {
  locale: string;
  onAppend: (text: string, durationSec: number) => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
}

interface SpeechRecognitionResultEvent {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
}

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export default function VoiceRecorder({ locale, onAppend }: Props) {
  const t = useTranslations("interview");
  const [supported, setSupported] = useState<boolean | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSupported(false);
      return;
    }
    setSupported(true);
    const rec = new Ctor();
    rec.lang = locale === "en" ? "en-US" : "zh-TW";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        const transcript = r[0].transcript;
        if (r.isFinal) finalText += transcript;
        else interimText += transcript;
      }
      if (finalText) {
        const duration =
          startTimeRef.current > 0
            ? (Date.now() - startTimeRef.current) / 1000
            : 0;
        onAppend(finalText, duration);
        startTimeRef.current = Date.now();
      }
      setInterim(interimText);
    };

    rec.onend = () => {
      setIsListening(false);
      setInterim("");
    };

    rec.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };

    recognitionRef.current = rec;

    return () => {
      try {
        rec.stop();
      } catch {
        // no-op
      }
    };
  }, [locale, onAppend]);

  const toggle = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    setError(null);
    if (isListening) {
      try {
        rec.stop();
      } catch {
        // no-op
      }
      setIsListening(false);
    } else {
      try {
        startTimeRef.current = Date.now();
        rec.start();
        setIsListening(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "start failed");
      }
    }
  };

  if (supported === null) return null;

  if (!supported) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
        <AlertTriangle className="h-3.5 w-3.5" />
        {t("voiceUnsupported")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            isListening
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "border border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100"
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="h-3.5 w-3.5" />
              {t("stopRecording")}
            </>
          ) : (
            <>
              <Mic className="h-3.5 w-3.5" />
              {t("startRecording")}
            </>
          )}
        </button>
        {isListening && (
          <span className="inline-flex items-center gap-1 text-xs text-red-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            {t("listening")}
          </span>
        )}
      </div>
      {interim && (
        <p className="text-xs italic text-gray-500">
          {t("interimPrefix")} {interim}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-600">
          {t("voiceError", { error })}
        </p>
      )}
    </div>
  );
}
