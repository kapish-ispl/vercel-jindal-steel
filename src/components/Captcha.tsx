import React, { useEffect, useRef } from 'react';

type CharMap = 'upper' | 'lower' | 'numbers' | 'special_char' | '';

interface CaptchaProps {
    numberOfCharacters: number;
    backgroundColor?: string;
    fontColor?: string;
    charMap?: CharMap;
    reloadText?: string;
    reloadColor?: string;
    onChange?: (value: string) => void;
    setReloadCaptcha: (value: boolean) => void;
}

export const generateCaptcha = (
    length: number,
    charMap: CharMap = ''
): string => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = "~`!@#$%^&*()_+-=[]{}\\|:'<>,.?/";

    let charset = lowercase + uppercase + numbers;
    if (charMap === 'upper') charset = uppercase + numbers;
    else if (charMap === 'lower') charset = lowercase + numbers;
    else if (charMap === 'numbers') charset = numbers;
    else if (charMap === 'special_char') charset = special;

    let result = '';
    const hasAllTypes = charMap === '' || charMap === 'upper' || charMap === 'lower';
    if (hasAllTypes && length >= 3) {
        result += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
        result += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
        result += numbers.charAt(Math.floor(Math.random() * numbers.length));
        for (let i = 3; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        result = result.split('').sort(() => 0.5 - Math.random()).join('');
    } else {
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
    }

    return result;
};

export const validateCaptcha = (input: string, actual: string): boolean => {
    return input === actual;
};

export const Captcha = ({
    numberOfCharacters,
    backgroundColor = 'white',
    fontColor = 'black',
    charMap = '',
    reloadText = 'Reload Captcha',
    reloadColor = 'black',
    onChange,
    setReloadCaptcha,
}: CaptchaProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawCaptcha = (text: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const length = text.length;
        const height = 40;
        const width = length * 20;

        canvas.width = width + 10;
        canvas.height = height;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        ctx.textBaseline = 'middle';
        ctx.font = 'italic 20px Monospace';
        ctx.fillStyle = fontColor;

        for (let i = 0; i < length; i++) {
            const x = 20 * i + 10;
            const y = Math.floor(Math.random() * 10) + 15;
            ctx.fillText(text[i], x, y);
        }
    };

    const reloadCaptcha = () => {
        const newCaptcha = generateCaptcha(numberOfCharacters, charMap);
        if (onChange) onChange(newCaptcha);
        drawCaptcha(newCaptcha);
    };

    useEffect(() => {
        reloadCaptcha();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberOfCharacters, charMap]);

    useEffect(() => {
        return () => { setReloadCaptcha(false) }
    }, [])

    return (
        <>
            <canvas ref={canvasRef} className="d-flex align-self-start" style={{ minWidth: "130px" }} />
            <div className='captcha-container'>
                <button
                    onClick={reloadCaptcha}
                    type="button"
                    tabIndex={4}
                    style={{ cursor: 'pointer', color: reloadColor, background: 'none', border: 'none', padding: 0 }}
                >
                    {reloadText}
                </button>
            </div>
        </>
    );
};