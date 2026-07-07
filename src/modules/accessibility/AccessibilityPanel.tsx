'use client';
import React, { useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';
import parse from 'html-react-parser'
import { AccessibilityState } from './AccessibilityService';

type StepControl = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  min: number;
  max: number;
  settingKey: 'fontSize' | 'letterSpacing' | 'lineHeight';
  label: string;
  direction?: 'positive' | 'negative';
  disabled?: boolean;
  icon: string
};

type ToggleSetting = {
  label: string;
  value: boolean;
  key: keyof Pick<AccessibilityState, 'highlightLinks' | 'dyslexiaFont' | 'darkMode' | 'invertColors' | 'hideImages' | 'screenReader' | 'largeCursor'>;
  icon: string;
};

const AccessibilityPanel: React.FC = () => {
  const [fontSizeIncStep, setFontSizeIncStep] = useState(0);
  const [fontSizeDecStep, setFontSizeDecStep] = useState(0);
  const [letterSpacingStep, setLetterSpacingStep] = useState(0);
  const [lineHeightStep, setLineHeightStep] = useState(0);

  const {
    highlightLinks,
    dyslexiaFont,
    darkMode,
    invertColors,
    hideImages,
    screenReader,
    largeCursor,
    toggleSetting,
    toggleResetSetting,
  } = useAccessibility();

  const handleStepChange = (
    currentStep: number,
    setStep: React.Dispatch<React.SetStateAction<number>>,
    key: StepControl['settingKey'],
    max: number,
    min: number = 0,
    direction: StepControl['direction'] = 'positive'
  ) => {
    let nextStep = currentStep;

    if (direction === 'positive') {
      nextStep = currentStep >= max ? min : currentStep + 1;
    } else {
      nextStep = currentStep <= max ? min : currentStep - 1;
    }

    setStep(nextStep);
    toggleSetting(key, `level${nextStep}`);
  };

  const stepControls: StepControl[] = [
    {
      step: fontSizeIncStep,
      setStep: setFontSizeIncStep,
      min: 0,
      max: 4,
      settingKey: 'fontSize',
      label: 'Bigger Text',
      direction: 'positive',
      disabled: fontSizeDecStep < 0,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><mask id="mask0_33_1025" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40"><rect width="40" height="40" fill="#D9D9D9"/></mask><g mask="url(#mask0_33_1025)"><path fill='currentColor' fill-rule='evenodd' d="M24.0223 32.5V11.0416H15.753V7.50006H35.8331V11.0416H27.5638V32.5H24.0223ZM9.13446 32.5V19.2949H4.1665V15.7533H17.628V19.2949H12.66V32.5H9.13446Z" fill="#1C1B1F"/></g></svg>`
    },
    {
      step: fontSizeDecStep,
      setStep: setFontSizeDecStep,
      min: 0,
      max: -4,
      settingKey: 'fontSize',
      label: 'Smaller Text',
      direction: 'negative',
      disabled: fontSizeIncStep > 0,
      icon: `<svg style="transform: scaleX(-1)" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><mask id="mask0_33_1025" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40"><rect width="40" height="40" fill="#D9D9D9"/></mask><g mask="url(#mask0_33_1025)"><path fill='currentColor' fill-rule='evenodd' d="M24.0223 32.5V11.0416H15.753V7.50006H35.8331V11.0416H27.5638V32.5H24.0223ZM9.13446 32.5V19.2949H4.1665V15.7533H17.628V19.2949H12.66V32.5H9.13446Z" fill="#1C1B1F"/></g></svg>`
    },
    {
      step: letterSpacingStep,
      setStep: setLetterSpacingStep,
      min: 0,
      max: 3,
      settingKey: 'letterSpacing',
      label: 'Letter Spacing',
      icon: `<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><mask id='mask0_33_1046' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='40' height='40'><rect width='40' height='40' fill='#D9D9D9'/></mask><g mask='url(#mask0_33_1046)'><path fill='currentColor' fill-rule='evenodd' d='M10.2562 35.8333L4.1665 29.7436L10.2562 23.6699L12.0222 25.4263L8.97088 28.4936H31.0287L28.003 25.4263L29.7594 23.6699L35.8331 29.7436L29.7434 35.8333L27.9774 34.0769L31.0447 30.9936H8.95488L11.9965 34.0769L10.2562 35.8333ZM12.1088 21.9231L18.7819 4.16672H21.2818L27.8908 21.9231H25.4613L23.8139 17.2244H16.237L14.5383 21.9231H12.1088ZM16.9613 15.1667H23.0383L20.1152 6.97439H19.9485L16.9613 15.1667Z' fill='#1C1B1F'/></g></svg>`
    },
    {
      step: lineHeightStep,
      setStep: setLineHeightStep,
      min: 0,
      max: 3,
      settingKey: 'lineHeight',
      label: 'Line Height',
      icon: `<svg width='41' height='40' viewBox='0 0 41 40' fill='none' xmlns='http://www.w3.org/2000/svg'><mask id='mask0_33_1041' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='41' height='40'><rect x='0.333496' width='40' height='40' fill='#D9D9D9'/></mask><g mask='url(#mask0_33_1041)'><path fill='currentColor' fill-rule='evenodd' d='M10.5897 32.4999L4.5 26.4102L6.25638 24.6539L9.33975 27.6859V12.314L6.25638 15.3461L4.5 13.5897L10.5897 7.50003L16.6794 13.5897L14.923 15.3461L11.8397 12.314V27.6859L14.923 24.6539L16.6794 26.4102L10.5897 32.4999ZM20.6538 30.8333V28.3333H36.1666V31.0256L20.6538 30.8333ZM20.6538 21.2499V18.75H36.1666V21.2499H20.6538ZM20.6538 11.6667V9.1667L36.1666 8.97441V11.6667H20.6538Z' fill='#1C1B1F'/></g></svg>`
    },
  ];

  const toggleSettings: ToggleSetting[] = [
    { label: 'Highlight Links', value: highlightLinks, key: 'highlightLinks', icon: `<svg width='33' height='16' viewBox='0 0 33 16' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill='currentColor' fill-rule='evenodd' d='M14.6796 15.564H8.39758C6.30486 15.564 4.521 14.8266 3.046 13.3518C1.571 11.877 0.833496 10.0934 0.833496 8.0009C0.833496 5.90843 1.571 4.12449 3.046 2.64907C4.521 1.17365 6.30486 0.435944 8.39758 0.435944H14.6796V2.93586H8.39758C6.998 2.93586 5.80408 3.42999 4.81583 4.41824C3.82758 5.40649 3.33345 6.6004 3.33345 7.99999C3.33345 9.39957 3.82758 10.5935 4.81583 11.5817C5.80408 12.57 6.998 13.0641 8.39758 13.0641H14.6796V15.564ZM10.4168 9.24994V6.75003H22.9168V9.24994H10.4168ZM18.654 15.564V13.0641H24.936C26.3356 13.0641 27.5295 12.57 28.5177 11.5817C29.506 10.5935 30.0001 9.39957 30.0001 7.99999C30.0001 6.6004 29.506 5.40649 28.5177 4.41824C27.5295 3.42999 26.3356 2.93586 24.936 2.93586H18.654V0.435944H24.936C27.0287 0.435944 28.8126 1.17335 30.2876 2.64815C31.7626 4.12296 32.5001 5.9066 32.5001 7.99907C32.5001 10.0915 31.7626 11.8755 30.2876 13.3509C28.8126 14.8263 27.0287 15.564 24.936 15.564H18.654Z' fill='#1C1B1F'/></svg>` as const },
    // { label: 'Dyslexia-friendly Font', value: dyslexiaFont, key: 'dyslexiaFont', icon: `<svg xmlns='http://www.w3.org/2000/svg' version='1.2' width='45' height='22' viewBox='0 0 31 22'><path fill='currentColor' fill-rule='evenodd' d='M.5 22V1.0083333h7.2421899c6.8051611 0 11.6124768 4.3388889 11.6124768 10.4805556C19.3546667 17.6305556 14.547351 22 7.7421899 22H.5Zm2.4348742-4.31h4.8073157c5.3692097 0 9.1463863-2.8616703 9.1463863-7.27 0-4.3807776-3.7771766-7.2422222-9.1463863-7.2422222H2.9348742V17.69ZM26.2735913 4.0333333l.0114609 2.1694445h4.0126191V8.25h-4.001719L26.77 22h-3.535416L23.78 8.25h-2.4238344V6.2027778h2.55923l.0751088-2.1694445C24.0706908 1.6805556 25.6007488 0 27.697782 0 28.6896221 0 29.677687.3666667 30.5 1.0083333l-.9627285 1.6805556c-.3479788-.3666667-.9515992-.6416667-1.627768-.6416667-.8819593 0-1.6420082.825-1.6359122 1.9861111Z'/></svg>` as const },
    {
      label: 'Dark Mode', value: darkMode, key: 'darkMode', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-moon" viewBox="0 0 16 16">
  <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/>
</svg>` as const
    },
    { label: 'Invert Colors', value: invertColors, key: 'invertColors', icon: `<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><mask id='mask0_33_1073' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='40' height='40'><rect width='40' height='40' fill='#D9D9D9'/></mask><g mask='url(#mask0_33_1073)'><path fill='currentColor' fill-rule='evenodd' d='M20 34.1666C16.5299 34.1666 13.5791 32.9674 11.1474 30.5689C8.71581 28.1704 7.5 25.2639 7.5 21.8494C7.5 20.1122 7.82853 18.5192 8.48558 17.0705C9.14264 15.6218 10.0342 14.3184 11.1602 13.1603L20 4.48724L28.8397 13.1603C29.9657 14.3184 30.8573 15.6298 31.5143 17.0946C32.1714 18.5593 32.4999 20.1442 32.4999 21.8494C32.4999 25.2639 31.2841 28.1704 28.8525 30.5689C26.4209 32.9674 23.47 34.1666 20 34.1666ZM20 31.6667V7.99999L12.9166 15C11.9444 15.9167 11.2152 16.9541 10.7291 18.1122C10.243 19.2703 9.99996 20.516 9.99996 21.8494C9.99996 24.5438 10.9722 26.8536 12.9166 28.7788C14.8611 30.7041 17.2222 31.6667 20 31.6667Z' fill='#1C1B1F'/></g></svg>` as const },
    { label: 'Hide Images', value: hideImages, key: 'hideImages', icon: `<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><mask id='mask0_33_1057' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='40' height='40'><rect width='40' height='40' fill='#D9D9D9'/></mask><g mask='url(#mask0_33_1057)'><path fill='currentColor' fill-rule='evenodd' d='M34.1665 29.4166L31.6665 26.9167V8.84623C31.6665 8.71801 31.6131 8.60047 31.5063 8.4936C31.3994 8.38677 31.2819 8.33335 31.1537 8.33335H13.0832L10.5832 5.83339H31.1537C31.9955 5.83339 32.7082 6.12506 33.2915 6.70839C33.8748 7.29173 34.1665 8.00434 34.1665 8.84623V29.4166ZM33.5768 37.0897L30.6537 34.1666H8.84607C8.00418 34.1666 7.29157 33.875 6.70824 33.2916C6.12491 32.7083 5.83324 31.9957 5.83324 31.1538V9.34615L2.91016 6.42306L4.66653 4.66669L35.3332 35.3334L33.5768 37.0897ZM11.2499 27.9166L15.3845 22.436L18.7178 26.6987L20.6698 24.2083L8.3332 11.8717V31.1538C8.3332 31.282 8.38661 31.3996 8.49345 31.5064C8.60031 31.6133 8.71785 31.6667 8.84607 31.6667H28.1282L24.3781 27.9166H11.2499Z' fill='#1C1B1F'/></g></svg>` as const },
    { label: 'Enable Screen Reader', value: screenReader, key: 'screenReader', icon: `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><mask id='mask0_4660_8146' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='32' height='32'><rect width='32' height='32' fill='#D9D9D9'/></mask><g mask='url(#mask0_4660_8146)'><path fill='currentColor' fill-rule='evenodd' d='M9.33333 22.6666V9.33329C9.33333 8.95551 9.46111 8.63885 9.71667 8.38329C9.97222 8.12774 10.2889 7.99996 10.6667 7.99996C11.0444 7.99996 11.3611 8.12774 11.6167 8.38329C11.8722 8.63885 12 8.95551 12 9.33329V22.6666C12 23.0444 11.8722 23.3611 11.6167 23.6166C11.3611 23.8722 11.0444 24 10.6667 24C10.2889 24 9.97222 23.8722 9.71667 23.6166C9.46111 23.3611 9.33333 23.0444 9.33333 22.6666ZM14.6667 28V3.99996C14.6667 3.62218 14.7944 3.30551 15.05 3.04996C15.3056 2.7944 15.6222 2.66663 16 2.66663C16.3778 2.66663 16.6944 2.7944 16.95 3.04996C17.2056 3.30551 17.3333 3.62218 17.3333 3.99996V28C17.3333 28.3777 17.2056 28.6944 16.95 28.95C16.6944 29.2055 16.3778 29.3333 16 29.3333C15.6222 29.3333 15.3056 29.2055 15.05 28.95C14.7944 28.6944 14.6667 28.3777 14.6667 28ZM4 17.3333V14.6666C4 14.2888 4.12778 13.9722 4.38333 13.7166C4.63889 13.4611 4.95556 13.3333 5.33333 13.3333C5.71111 13.3333 6.02778 13.4611 6.28333 13.7166C6.53889 13.9722 6.66667 14.2888 6.66667 14.6666V17.3333C6.66667 17.7111 6.53889 18.0277 6.28333 18.2833C6.02778 18.5388 5.71111 18.6666 5.33333 18.6666C4.95556 18.6666 4.63889 18.5388 4.38333 18.2833C4.12778 18.0277 4 17.7111 4 17.3333ZM20 22.6666V9.33329C20 8.95551 20.1278 8.63885 20.3833 8.38329C20.6389 8.12774 20.9556 7.99996 21.3333 7.99996C21.7111 7.99996 22.0278 8.12774 22.2833 8.38329C22.5389 8.63885 22.6667 8.95551 22.6667 9.33329V22.6666C22.6667 23.0444 22.5389 23.3611 22.2833 23.6166C22.0278 23.8722 21.7111 24 21.3333 24C20.9556 24 20.6389 23.8722 20.3833 23.6166C20.1278 23.3611 20 23.0444 20 22.6666ZM25.3333 17.3333V14.6666C25.3333 14.2888 25.4611 13.9722 25.7167 13.7166C25.9722 13.4611 26.2889 13.3333 26.6667 13.3333C27.0444 13.3333 27.3611 13.4611 27.6167 13.7166C27.8722 13.9722 28 14.2888 28 14.6666V17.3333C28 17.7111 27.8722 18.0277 27.6167 18.2833C27.3611 18.5388 27.0444 18.6666 26.6667 18.6666C26.2889 18.6666 25.9722 18.5388 25.7167 18.2833C25.4611 18.0277 25.3333 17.7111 25.3333 17.3333Z' fill='#212121'/></g></svg>` as const },
    { label: 'Large Cursor', value: largeCursor, key: 'largeCursor', icon: `<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><mask id='mask0_33_1062' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='40' height='40'><rect width='40' height='40' fill='#D9D9D9'/></mask><g mask='url(#mask0_33_1062)'><path fill='currentColor' fill-rule='evenodd' d='M21.2594 35.7659C21.0495 35.8108 20.8395 35.8333 20.6296 35.8333H19.9998C17.8095 35.8333 15.7512 35.4177 13.8248 34.5866C11.8984 33.7555 10.2228 32.6276 8.79775 31.2029C7.37275 29.7781 6.24463 28.1027 5.41338 26.1766C4.58213 24.2506 4.1665 22.1927 4.1665 20.0028C4.1665 17.8129 4.58206 15.7545 5.41317 13.8276C6.24428 11.9007 7.3722 10.2246 8.79692 8.79919C10.2217 7.3738 11.8971 6.24537 13.8231 5.4139C15.7492 4.58242 17.8071 4.16669 19.997 4.16669C22.1869 4.16669 24.2453 4.58231 26.1722 5.41356C28.0991 6.24481 29.7752 7.37294 31.2006 8.79794C32.626 10.2229 33.7544 11.8986 34.5859 13.825C35.4174 15.7514 35.8331 17.8097 35.8331 20V20.6218C35.8331 20.829 35.8106 21.0363 35.7658 21.2436L33.3331 20.5V20C33.3331 16.2778 32.0415 13.125 29.4581 10.5416C26.8748 7.95831 23.722 6.66665 19.9998 6.66665C16.2776 6.66665 13.1248 7.95831 10.5415 10.5416C7.95813 13.125 6.66646 16.2778 6.66646 20C6.66646 23.7222 7.95813 26.875 10.5415 29.4583C13.1248 32.0416 16.2776 33.3333 19.9998 33.3333H20.4998L21.2594 35.7659ZM33.567 36.0736L26.0093 28.4999L24.1985 33.9741L19.9998 20L33.974 24.1986L28.4997 26.0095L36.0734 33.5672L33.567 36.0736Z' fill='#1C1B1F'/></g></svg>` as const },
  ];

  const handleResetAll = () => {
    toggleResetSetting();
    setFontSizeIncStep(0);
    setFontSizeDecStep(0);
    setLetterSpacingStep(0);
    setLineHeightStep(0);
  };

  return (
    <>
      <div className="accessibility-panel">
        <div className="accessibility__main-wrapper">
          {stepControls.map(
            ({ step, setStep, max, min, settingKey, label, disabled, direction, icon }) => {
              const handleActivate = () => {
                if (disabled) return;
                handleStepChange(step, setStep, settingKey, max, min, direction);
              };

              return (
                <div
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  aria-disabled={disabled}
                  className={`step-control-wrapper mainToggle__btn 
          ${disabled ? 'disabled' : ''} 
          ${step !== 0 ? 'active' : ''}`}
                  key={label}
                  onClick={handleActivate}
                  onKeyDown={(e) => {
                    if (disabled) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleActivate();
                    }
                  }}
                >
                  <div className="controlBtn">
                    <span className="controlBtn__icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="10" viewBox="0 0 400 299" fill="none">
                        <path d="M33.3335 167L129.692 263.357C131.705 265.367 134.967 265.37 136.98 263.357L366.667 33.667" stroke="white" strokeWidth="66.6667" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>

                  <div className="withIcon">
                    {parse(icon)}
                    <button className="step-button" type="button" disabled={disabled}>
                      {label}
                    </button>
                  </div>

                  {step !== 0 && (
                    <div className="step-indicator">
                      {Array.from({ length: Math.abs(max - min) }).map((_, index) => {
                        const isActive = index < Math.abs(step);
                        return <span key={index} className={`step-dot ${isActive ? 'active' : ''}`}></span>;
                      })}
                    </div>
                  )}
                </div>
              );
            }
          )}

          <div className="mainToggle mt-4">
            {toggleSettings.map(({ label, value, key, icon }) => {
              return (
                <div
                  key={key}
                  className={`toggle-control mainToggle__btn ${value ? "active" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => toggleSetting(key, e.target.checked)}
                    id={key}
                    aria-labelledby={key}
                  />
                  <div className="controlBtn">
                    <span className="controlBtn__icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="10" viewBox="0 0 400 299" fill="none">
                        <path
                          d="M33.3335 167L129.692 263.357C131.705 265.367 134.967 265.37 136.98 263.357L366.667 33.667"
                          stroke="white"
                          strokeWidth="66.6667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="withIcon">
                    {parse(icon)}
                    <label htmlFor={key}>{label}</label>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
      <div className="accessFooter">
        <button
          className="resetBtn"
          onClick={handleResetAll}
        >
          <span className="resetBtn__media">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="currentcolor">
              <g clipPath="url(#clip0_615_429)">
                <path fill='currentcolor' fillRule='evenodd' d="M25.2546 31.2546L24.7446 30.7446L28.1306 27.3596H15.9996C8.63265 27.3596 2.63965 21.3666 2.63965 13.9996C2.63965 6.63265 8.63265 0.639648 15.9996 0.639648C23.3666 0.639648 29.3596 6.63265 29.3596 13.9996H28.6396C28.6396 7.02965 22.9696 1.35965 15.9996 1.35965C9.02965 1.35965 3.35965 7.02965 3.35965 13.9996C3.35965 20.9696 9.02965 26.6396 15.9996 26.6396H28.1306L24.7446 23.2546L25.2546 22.7446L29.5086 26.9996L25.2546 31.2546ZM17.8386 22.3596H14.1616V20.3016L13.1996 19.8996L11.7426 21.3566L9.14165 18.7566L10.5966 17.3026L10.2006 16.3376H8.13965V12.6606H10.1956L10.5986 11.6986L9.14165 10.2416L11.7426 7.64165L13.1966 9.09565L14.1616 8.69965V6.63965H17.8386V8.69565L18.8006 9.09865L20.2576 7.64165L22.8586 10.2416L21.4046 11.6956L21.8006 12.6606H23.8616V16.3376H21.8046L21.4026 17.2996L22.8596 18.7566L20.2586 21.3566L18.8046 19.9026L17.8386 20.2996V22.3596Z" />
              </g>
              <defs>
                <clipPath id="clip0_615_429">
                  <rect width="32" height="32" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          <span className="resetBtn__title">Reset All Settings</span>
        </button>
      </div>
    </>
  );
};

export default AccessibilityPanel;
