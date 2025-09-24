import React from 'react';

/**
 * An array of control keys that should not be prevented by validation functions.
 */
const controlKeys: string[] = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];

/**
 * Prevents non-digit characters from being entered into an input field.
 * Allows control keys for navigation and editing.
 * @param e - The React keyboard event.
 */
export const restrictDigits = (e: React.KeyboardEvent<HTMLInputElement>): boolean => {
  const char = e.key;
  // Allows control keys.
  if (controlKeys.includes(char)) {
    return true;
  }
  // Prevents the default action if the key is not a digit.
  if (!/^[0-9]$/.test(char)) {
    e.preventDefault();
    return false;
  }
  return true;
};

/**
 * Restricts input to characters that are valid in an email address.
 * @param e - The React keyboard event.
 */
export const restrictEmailChars = (e: React.KeyboardEvent<HTMLInputElement>): boolean => {
  const char = e.key;
  // Regex for valid email characters.
  const emailCharPattern = /^[a-zA-Z0-9._%+-@]$/;

  // Allow control keys for editing.
  if (controlKeys.includes(char)) {
    return true;
  }

  // Test if the character is a valid email character.
  if (!emailCharPattern.test(char)) {
    e.preventDefault();
    return false;
  }
  return true;
};

/**
 * Restricts letter characters, allowing only digits and specified control keys.
 * @param e - The React keyboard event.
 */
export const restrictLetters = (e: React.KeyboardEvent<HTMLInputElement>): boolean => {
  const char = e.key;

  // Allow digits and a wider range of control/navigation keys.
  if (/^[0-9]$/.test(char) || controlKeys.includes(char) || char === 'ArrowUp' || char === 'ArrowDown') {
    return true;
  }

  // Prevent default for any other characters (primarily letters).
  e.preventDefault();
  return false;
};

/**
 * Restricts most special characters from being entered.
 * @param e - The React keyboard event.
 */
export const restrictSpecialChar = (e: React.KeyboardEvent<HTMLInputElement>): boolean => {
  const char = e.key;
  // Allow control keys for editing.
  if (controlKeys.includes(char)) {
    return true;
  }
  // Regex to block specific special characters.
  if (!/^[^!@#$%^&*()_+`~=\[\]{};':"\\|<>\/?]+$/.test(char)) {
    e.preventDefault();
    return false;
  }
  return true;
};

/**
 * Validates a mobile number input. Ensures it starts with a valid digit (6, 7, 8, or 9)
 * and only contains numbers.
 * @param e - The React keyboard event.
 * @param ref - A React ref to the input element.
 */
export const validateMobile = (e: React.KeyboardEvent<HTMLInputElement>, ref: React.RefObject<HTMLInputElement>): void => {
  if (!ref.current) return;

  const startDigits = ['6', '7', '8', '9'];
  const inputValue = ref.current.value;
  const isDigit = /^[0-9]$/.test(e.key);

  let predictedValue = inputValue;
  if (isDigit) {
    predictedValue += e.key;
  }

  // Prevent non-digit, non-control keys.
  // Also, prevent if the very first digit is not a valid starting digit.
  if ((!isDigit && !controlKeys.includes(e.key)) || (predictedValue.length === 1 && !startDigits.includes(predictedValue[0]))) {
    e.preventDefault();
  }
};

/**
 * Validates the length of a number input, preventing more digits than specified.
 * @param e - The React keyboard event.
 * @param ref - A React ref to the input element.
 * @param maxLength - The maximum allowed length for the number.
 */
export const validateNumberLength = (e: React.KeyboardEvent<HTMLInputElement>, ref: React.RefObject<HTMLInputElement>, maxLength: number): void => {
  if (!ref.current) return;

  const isDigit = /^[0-9]$/.test(e.key);
  const inputValue = ref.current.value;

  // We only check length constraint if a new digit is being added.
  if (isDigit && inputValue.length >= maxLength) {
    e.preventDefault();
    return;
  }

  // Also, ensure only digits or control keys are pressed.
  if (!isDigit && !controlKeys.includes(e.key)) {
    e.preventDefault();
  }
};

/**
 * Prevents the user from copying or pasting into an input field.
 * @param event - The React clipboard event.
 */
export const handleCopyPaste = (event: React.ClipboardEvent<HTMLInputElement>): void => {
  event.preventDefault();
};
