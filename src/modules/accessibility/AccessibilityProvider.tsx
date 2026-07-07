"use client";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

type FontSize = "level0" | "level1" | "level2" | "level3" | "level4";

type AccessibilityState = {
    fontSize: FontSize;
    lineHeight: FontSize;
    letterSpacing: FontSize;
    highlightLinks: boolean;
    dyslexiaFont: boolean;
    darkMode: boolean;
    invertColors: boolean;
    hideImages: boolean;
    screenReader: boolean;
    largeCursor: boolean;
};

type AccessibilitySettings = AccessibilityState & {
    toggleSetting: (key: keyof AccessibilityState, value: boolean | string) => void;
    speakText: (text: string) => void;
    toggleResetSetting: () => void,
};

const AccessibilityContext = createContext<AccessibilitySettings | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedText, setSelectedText] = useState('');
    const [settings, setSettings] = useState<AccessibilityState>({
        fontSize: "level0",
        lineHeight: "level0",
        letterSpacing: "level0",
        highlightLinks: false,
        dyslexiaFont: false,
        darkMode: false,
        invertColors: false,
        hideImages: false,
        screenReader: false,
        largeCursor: false,
    });

    const speakText = useCallback((text: string) => {
        const speechSynthesis = window.speechSynthesis;
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        let voices = speechSynthesis.getVoices();

        if (voices.length === 0) {
            speechSynthesis.onvoiceschanged = () => {
                voices = speechSynthesis.getVoices();
                setPreferredVoice(utterance, voices);
                speechSynthesis.speak(utterance);
            };
            return;
        }

        setPreferredVoice(utterance, voices);
        speechSynthesis.speak(utterance);
    }, []);

    const setPreferredVoice = (utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[]) => {
        const preferredVoices = ['Tessa', 'Google UK English Female'];
        const voice = voices.find(v => preferredVoices.includes(v.name)) || voices.find(v => v.default);
        if (voice) {
            utterance.voice = voice;
        }
    };

    const isFocusable = (element: HTMLElement): boolean => {
        if (element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') {
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (!settings.screenReader) return;

        const handleFocusOrHover = (event: Event) => {
            const target = event.currentTarget as HTMLElement;
            if (target?.innerText && isFocusable(target)) {
                speakText(target.innerText);
            }
        };

        const handleTextSelection = () => {
            const selection = window.getSelection();
            const text = selection?.toString().trim() ?? "";
            if (text && text !== selectedText) {
                setSelectedText(text);
                speakText(text);
            }
        };

        const handleRange = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const selection = window.getSelection();
            if (target && !target.classList.contains('form_grider_wrap_field')) {
                selection?.removeAllRanges();
            }
        };

        const handleTouchEnd = () => {
            const selection = window.getSelection();
            const text = selection?.toString().trim() ?? "";
            if (text && text !== selectedText) {
                setSelectedText(text);
                speakText(text);
            }
        };

        const interactiveElements = document.querySelectorAll(
            "a, button, [role='button'], input[type='button'], input[type='submit']"
        );

        interactiveElements.forEach(el => {
            el.addEventListener("mouseenter", handleFocusOrHover);
            el.addEventListener("focus", handleFocusOrHover);
        });

        document.addEventListener("mouseup", handleTextSelection);
        document.addEventListener("click", handleRange);
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            interactiveElements.forEach(el => {
                el.removeEventListener("mouseenter", handleFocusOrHover);
                el.removeEventListener("focus", handleFocusOrHover);
            });
            document.removeEventListener("mouseup", handleTextSelection);
            document.removeEventListener("click", handleRange);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [settings.screenReader, selectedText, speakText]);

    const toggleSetting = (key: keyof AccessibilityState, value: boolean | string) => {
        setSettings(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const toggleResetSetting = () => {
        setSettings({
            fontSize: "level0",
            lineHeight: "level0",
            letterSpacing: "level0",
            highlightLinks: false,
            dyslexiaFont: false,
            darkMode: false,
            invertColors: false,
            hideImages: false,
            screenReader: false,
            largeCursor: false,
        });
    };

    function getFontSizeClass(step: number): string | null {
        switch (step) {
            case 1: return "font_increase_1";
            case 2: return "font_increase_2";
            case 3: return "font_increase_3";
            case 4: return "font_increase_4";
            case 0: return null;
            case -1: return "font_decrease_1";
            case -2: return "font_decrease_2";
            case -3: return "font_decrease_3";
            case -4: return "font_decrease_4";
            default: return null;
        }
    }

    useEffect(() => {
        const body = document.body;
        const html = document.documentElement;

        body.classList.remove(
            "font_increase_1", "font_increase_2", "font_increase_3", "font_increase_4",
            "font_decrease_1", "font_decrease_2", "font_decrease_3", "font_decrease_4",
            "lineheight_increase_1", "lineheight_increase_2", "lineheight_increase_3",
            "letterspacing_increase_1", "letterspacing_increase_2", "letterspacing_increase_3"
        );

        const step = parseInt(settings.fontSize.replace("level", ""));
        const fontClass = getFontSizeClass(step);
        if (fontClass) body.classList.add(fontClass);

        const lsLevel = parseInt(settings.letterSpacing.replace("level", ""));
        if (lsLevel > 0 && lsLevel <= 4) {
            body.classList.add(`letterspacing_increase_${lsLevel}`);
        }

        const lhLevel = parseInt(settings.lineHeight.replace("level", ""));
        if (lhLevel > 0 && lhLevel <= 4) {
            body.classList.add(`lineheight_increase_${lhLevel}`);
        }

        html.classList.toggle("invert-colors", settings.invertColors);

        const toggles = {
            "highlight-links": settings.highlightLinks,
            "dyslexia_font": settings.dyslexiaFont,
            "dark-mode": settings.darkMode,
            "hide-images": settings.hideImages,
            "large-cursor": settings.largeCursor,
        };

        for (const [className, enabled] of Object.entries(toggles)) {
            body.classList.toggle(className, enabled);
        }
    }, [settings]);

    return (
        <AccessibilityContext.Provider value={{ ...settings, toggleSetting, speakText, toggleResetSetting }}>
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) throw new Error("useAccessibility must be used within AccessibilityProvider");
    return context;
};
