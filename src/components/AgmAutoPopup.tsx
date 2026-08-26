"use client";

import React, { FC, useEffect, useState } from "react";
import AgmModal, { AgmModalProps } from "./AgmModal";

export interface AgmAutoPopupProps extends Partial<Omit<AgmModalProps, "isOpen" | "onClose">> {
  /**
   * ISO Date string or Date object when the modal should start appearing.
   * Default: Friday, August 28, 2026, 10:45:00 AM IST (UTC+05:30)
   */
  liveFromDate?: string | Date;
  /**
   * Optional end date when the popup should stop appearing.
   */
  liveUntilDate?: string | Date;
  /**
   * Storage key to track dismissal. Set to null to always show.
   */
  sessionKey?: string | null;
  /**
   * Force open for testing/preview purposes.
   */
  forceOpen?: boolean;
}

// Default go-live time: Friday, August 28, 2026, 10:45 AM IST (UTC+05:30)
const DEFAULT_LIVE_FROM = "2026-08-28T10:45:00+05:30";
const DEFAULT_SESSION_KEY = "agm_47_popup_dismissed";

export const AgmAutoPopup: FC<AgmAutoPopupProps> = ({
  liveFromDate = DEFAULT_LIVE_FROM,
  liveUntilDate,
  sessionKey = DEFAULT_SESSION_KEY,
  forceOpen = false,
  ...modalProps
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    if (sessionKey && typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem(sessionKey);
      if (isDismissed === "true") {
        return;
      }
    }

    const checkSchedule = () => {
      const now = Date.now();
      const startTime = new Date(liveFromDate).getTime();
      const endTime = liveUntilDate ? new Date(liveUntilDate).getTime() : Infinity;

      if (now >= startTime && now <= endTime) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 30000); // Re-check every 30s
    return () => clearInterval(interval);
  }, [liveFromDate, liveUntilDate, sessionKey, forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (sessionKey && typeof window !== "undefined") {
      sessionStorage.setItem(sessionKey, "true");
    }
  };

  return <AgmModal isOpen={isOpen} onClose={handleClose} {...modalProps} />;
};

export default AgmAutoPopup;
