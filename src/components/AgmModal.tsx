"use client";

import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import { lenisRef } from "./Layout/SmoothScrollProvider";

export interface AgmModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  date?: string;
  time?: string;
  buttonText?: string;
  webcastUrl?: string;
  onWebcastClick?: () => void;
  backgroundImage?: string;
  defaultOpen?: boolean;
  props?: any;
  data?: any;
}

const AgmModal: FC<AgmModalProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  defaultOpen = true,
  data,
  onWebcastClick,
  backgroundImage,
}) => {
  const [mounted, setMounted] = useState(false);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isModalOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

  const modalData = useMemo(() => {
    if (!data) return [];

    return React.Children.toArray(data)
      .filter(
        (child): child is React.ReactElement<any> =>
          React.isValidElement(child) &&
          typeof child.props !== "undefined"
      )
      .map((child, index) => {
        const items = child.props.children || [];
        return {
          id: index + 1,
          title: items.find((c: any) => c?.type === "modaltitle")?.props?.children,
          date: items.find((c: any) => c?.type === "eventdate")?.props?.children,
          time: items.find((c: any) => c?.type === "eventtime")?.props?.children,
          buttonText: items.find((c: any) => c?.type?.toLowerCase() === "eventlink")?.props?.children,
          webcastUrl: items.find((c: any) => c?.type?.toLowerCase() === "eventlink")?.props?.href,
        };
      });
  }, [data]);

  const currentItem = modalData[0];

  const title = currentItem?.title;
  const date = currentItem?.date;
  const time = currentItem?.time;
  const buttonText = currentItem?.buttonText;
  const webcastUrl = currentItem?.webcastUrl;

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalOpen(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isModalOpen) {
      // Pause Lenis smooth scroll
      lenisRef.current?.stop();
      // In case Lenis initializes shortly after modal mounts
      const lenisInterval = setInterval(() => {
        if (lenisRef.current) {
          lenisRef.current.stop();
        }
      }, 100);
      const lenisTimeout = setTimeout(() => clearInterval(lenisInterval), 1500);

      // Lock body and html scroll
      const body = document.body;
      const html = document.documentElement;
      const prevBodyOverflow = body.style.overflow;
      const prevHtmlOverflow = html.style.overflow;

      body.classList.add("overflow-hidden");
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        clearInterval(lenisInterval);
        clearTimeout(lenisTimeout);
        lenisRef.current?.start();
        body.classList.remove("overflow-hidden");
        body.style.overflow = prevBodyOverflow;
        html.style.overflow = prevHtmlOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      lenisRef.current?.start();
      document.body.classList.remove("overflow-hidden");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [isModalOpen, mounted]);

  if (!isModalOpen || !mounted) return null;

  const defaultBgStyle: React.CSSProperties = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  return createPortal(
    <div
      className="c-agm-modal"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="agm-modal-title"
    >
      <div
        className={`c-agm-modal__container ${!backgroundImage ? "c-agm-modal__container--default-bg" : ""}`}
        style={defaultBgStyle}
        onClick={(e) => e.stopPropagation()}
        data-lenis-ignore
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="c-agm-modal__close"
          aria-label="Close modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Ambient Overlay */}
        <div className="c-agm-modal__overlay" />

        {/* Modal Content */}
        <div className="c-agm-modal__content">
          <h2 id="agm-modal-title" className="c-agm-modal__title">
            {title}
          </h2>

          <div className="c-agm-modal__datetime">
            <p className="c-agm-modal__date">{date}</p>
            <p className="c-agm-modal__time">{time}</p>
          </div>

          {onWebcastClick ? (
            <button
              type="button"
              onClick={onWebcastClick}
              className="c-agm-modal__action"
            >
              {buttonText}
            </button>
          ) : (
            <Link
              prefetch={false}
              href={webcastUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="c-agm-modal__action"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AgmModal;
