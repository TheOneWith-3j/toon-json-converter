"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV === "development") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => void registration.unregister());
      });
      caches.keys().then((keys) => {
        keys.forEach((key) => void caches.delete(key));
      });
    } else {
      navigator.serviceWorker
        .register("/service-worker.js")
        .catch(() => undefined);
    }
  }, []);

  return null;
}
