import { get } from "svelte/store";

import { page } from "$app/stores";
import { goto } from "$app/navigation";

import type { NFTMetaData } from "./types";

export function clickOutside(element: HTMLElement, callbackFunction: () => void) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onClick(event: any) {
    if (!element.contains(event.target)) {
      callbackFunction();
    }
  }

  document.body.addEventListener("click", onClick);

  return {
    update(newCallbackFunction: () => void) {
      callbackFunction = newCallbackFunction;
    },
    destroy() {
      document.body.removeEventListener("click", onClick);
    },
  };
}

export function extractMetaData(tokenURI: string): NFTMetaData {
  const encoded = tokenURI.split(";base64,")[1];

  try {
    const json = atob(encoded);
    return JSON.parse(json) as NFTMetaData;
  } catch (e) {
    throw new Error("Failed to parse metadata");
  }
}

export function goToNext() {
  const nextPath = get(page).url.searchParams.get("next") || "/";
  goto(nextPath);
}
