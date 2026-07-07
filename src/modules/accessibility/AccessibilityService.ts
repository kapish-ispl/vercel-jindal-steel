// Accessibility types
export type FontSize = -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4;

export type AccessibilityState = {
  fontSize: FontSize;
  lineHeight: 0 | 1 | 2 | 3;
  letterSpacing: 0 | 1 | 2 | 3;
  highlightLinks: boolean;
  dyslexiaFont: boolean;
  darkMode: boolean;
  invertColors: boolean;
  hideImages: boolean;
  screenReader: boolean;
  largeCursor: boolean;
};

export type AccessibilityService = {
  getSettings: () => AccessibilityState;
  onUpdate: (callback: (settings: AccessibilityState) => void) => () => void;
  toggleSetting: (
    key: keyof AccessibilityState,
    value: AccessibilityState[keyof AccessibilityState]
  ) => void;
  speakText: (text: string) => void;
  setupScreenReaderListeners: () => () => void;
};

// ---------------------------------------------------
// Implementation
// ---------------------------------------------------

const createAccessibilityService = (
  initialSettings: AccessibilityState
): AccessibilityService => {
  let settings = initialSettings;
  let selectedText = '';
  const updateCallbacks: ((settings: AccessibilityState) => void)[] = [];

  const notifyUpdate = () => {
    updateCallbacks.forEach((cb) => cb(settings));
    applySettings();
  };

  const getSettings = () => settings;

  const onUpdate = (callback: (settings: AccessibilityState) => void) => {
    updateCallbacks.push(callback);
    return () => {
      const index = updateCallbacks.indexOf(callback);
      if (index > -1) updateCallbacks.splice(index, 1);
    };
  };

  const toggleSetting = (
    key: keyof AccessibilityState,
    value: AccessibilityState[keyof AccessibilityState]
  ) => {
    settings = {
      ...settings,
      [key]: value,
    };
    notifyUpdate();
  };

  const speakText = (text: string) => {
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
  };

  const setPreferredVoice = (
    utterance: SpeechSynthesisUtterance,
    voices: SpeechSynthesisVoice[]
  ) => {
    const preferredVoices = ['Tessa', 'Google UK English Female'];
    const voice =
      voices.find((v) => preferredVoices.includes(v.name)) ||
      voices.find((v) => v.default);
    if (voice) {
      utterance.voice = voice;
    }
  };

  const isFocusable = (element: HTMLElement): boolean => {
    if (
      element.hasAttribute('disabled') ||
      element.getAttribute('aria-disabled') === 'true'
    ) {
      return false;
    }
    return true;
  };

  const setupScreenReaderListeners = () => {
    if (!settings.screenReader) return () => {};

    const handleFocusOrHover = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      if (target?.innerText && isFocusable(target)) {
        speakText(target.innerText);
      }
    };

    const handleTextSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() ?? '';
      if (text && text !== selectedText) {
        selectedText = text;
        speakText(text);
      }
    };

    const interactiveElements = document.querySelectorAll(
      "a, button, [role='button'], input[type='button'], input[type='submit']"
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleFocusOrHover);
      el.addEventListener('focus', handleFocusOrHover);
    });

    document.addEventListener('selectionchange', handleTextSelection);

    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleFocusOrHover);
        el.removeEventListener('focus', handleFocusOrHover);
      });
      document.removeEventListener('selectionchange', handleTextSelection);
    };
  };

  const getFontSizeClass = (step: FontSize): string | null => {
    switch (step) {
      case 1:
        return 'font_increase_1';
      case 2:
        return 'font_increase_2';
      case 3:
        return 'font_increase_3';
      case 4:
        return 'font_increase_4';
      case -1:
        return 'font_decrease_1';
      case -2:
        return 'font_decrease_2';
      case -3:
        return 'font_decrease_3';
      case -4:
        return 'font_decrease_4';
      default:
        return null;
    }
  };

  const applySettings = () => {
    const body = document.body;

    body.classList.remove(
      'font_increase_1',
      'font_increase_2',
      'font_increase_3',
      'font_increase_4',
      'font_decrease_1',
      'font_decrease_2',
      'font_decrease_3',
      'font_decrease_4',
      'lineheight_increase_1',
      'lineheight_increase_2',
      'lineheight_increase_3',
      'letterspacing_increase_1',
      'letterspacing_increase_2',
      'letterspacing_increase_3',
      'dyslexia_font',
      'highlight-links',
      'dark-mode',
      'invert-colors',
      'hide-images',
      'large-cursor'
    );

    const fontClass = getFontSizeClass(settings.fontSize);
    if (fontClass) body.classList.add(fontClass);

    if (settings.letterSpacing > 0) {
      body.classList.add(`letterspacing_increase_${settings.letterSpacing}`);
    }

    if (settings.lineHeight > 0) {
      body.classList.add(`lineheight_increase_${settings.lineHeight}`);
    }

    if (settings.dyslexiaFont) body.classList.add('dyslexia_font');
    if (settings.highlightLinks) body.classList.add('highlight-links');
    if (settings.darkMode) body.classList.add('dark-mode');
    if (settings.invertColors) body.classList.add('invert-colors');
    if (settings.hideImages) body.classList.add('hide-images');
    if (settings.largeCursor) body.classList.add('large-cursor');
  };

  return {
    getSettings,
    onUpdate,
    toggleSetting,
    speakText,
    setupScreenReaderListeners,
  };
};

// ---------------------------------------------------
// Export singleton service
// ---------------------------------------------------

export const accessibilityService = createAccessibilityService({
  fontSize: 0,
  lineHeight: 0,
  letterSpacing: 0,
  highlightLinks: false,
  dyslexiaFont: false,
  darkMode: false,
  invertColors: false,
  hideImages: false,
  screenReader: false,
  largeCursor: false,
});
