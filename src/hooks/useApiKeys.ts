import { useState } from "react";

export type ApiKeys = {
  deepseekApiKey?: string;
  geminiApiKey?: string;
  llamaApiKey?: string;
};

const STORAGE_KEY = "studybuddy:apiKeys";

function readKeys(): ApiKeys {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ApiKeys) : {};
  } catch {
    return {};
  }
}

function writeKeys(data: ApiKeys) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // no-op
  }
}

export function getApiKeys(): ApiKeys {
  return readKeys();
}

export function setApiKeyValue(key: keyof ApiKeys, value: string) {
  const current = readKeys();
  current[key] = value;
  writeKeys(current);
}

export function useApiKeys() {
  const [keys, setKeys] = useState<ApiKeys>(() => readKeys());

  const setApiKey = (key: keyof ApiKeys, value: string) => {
    setApiKeyValue(key, value);
    setKeys((prev) => ({ ...prev, [key]: value }));
  };

  const refresh = () => setKeys(readKeys());

  return { keys, setApiKey, refresh };
}
