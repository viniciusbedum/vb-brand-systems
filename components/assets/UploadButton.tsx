"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { UploadSimple as Upload } from "@/lib/icons";
import { Button } from "@/components/ui/button";

type UploadButtonProps = {
  accept: string;
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  loading?: boolean;
};

export function UploadButton({ accept, onFiles, disabled, loading }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("assets");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      onFiles(files);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input ref={inputRef} type="file" accept={accept} multiple className="hidden" onChange={handleChange} aria-label={t("uploadLabel")} />
      <Button
        onClick={() => inputRef.current?.click()}
        disabled={disabled || loading}
        className="shrink-0 whitespace-nowrap"
      >
        <Upload aria-hidden="true" />
        {loading ? t("uploading") : t("upload")}
      </Button>
    </>
  );
}
