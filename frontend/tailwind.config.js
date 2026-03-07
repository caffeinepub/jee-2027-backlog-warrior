import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            fontFamily: {
                sans: [
                    'Inter',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'sans-serif'
                ],
                display: [
                    'Space Grotesk',
                    'Inter',
                    'system-ui',
                    'sans-serif'
                ],
            },
            colors: {
                border: 'rgb(var(--border-rgb) / <alpha-value>)',
                input: 'rgb(var(--input-rgb) / <alpha-value>)',
                ring: 'rgb(var(--ring-rgb) / <alpha-value>)',
                background: 'rgb(var(--background-rgb) / <alpha-value>)',
                foreground: 'rgb(var(--foreground-rgb) / <alpha-value>)',
                primary: {
                    DEFAULT: 'rgb(var(--primary-rgb) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'rgb(var(--secondary-rgb) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'rgb(var(--destructive-rgb) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'rgb(var(--muted-rgb) / <alpha-value>)',
                    foreground: 'rgb(var(--muted-foreground-rgb) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))',
                    cyan: 'oklch(var(--accent-cyan) / <alpha-value>)',
                    lime: 'oklch(var(--accent-lime) / <alpha-value>)',
                    amber: 'oklch(var(--accent-amber) / <alpha-value>)',
                    pink: 'oklch(var(--accent-pink) / <alpha-value>)',
                    purple: 'oklch(var(--accent-purple) / <alpha-value>)',
                },
                popover: {
                    DEFAULT: 'rgb(var(--popover-rgb) / <alpha-value>)',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'rgb(var(--card-rgb) / <alpha-value>)',
                    foreground: 'oklch(var(--card-foreground))'
                },
                success: {
                    DEFAULT: 'rgb(var(--success-rgb) / <alpha-value>)',
                    foreground: 'oklch(var(--success-foreground))'
                },
                warning: {
                    DEFAULT: 'rgb(var(--warning-rgb) / <alpha-value>)',
                    foreground: 'oklch(var(--warning-foreground))'
                },
                chart: {
                    1: 'oklch(var(--accent-cyan))',
                    2: 'oklch(var(--accent-lime))',
                    3: 'oklch(var(--accent-amber))',
                    4: 'oklch(var(--accent-pink))',
                    5: 'oklch(var(--destructive))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                xl: 'calc(var(--radius) + 4px)',
                '2xl': 'calc(var(--radius) + 8px)',
            },
            boxShadow: {
                xs: '0 1px 2px 0 oklch(0% 0 0 / 0.05)',
                'glow-sm': '0 0 12px rgb(var(--primary-rgb) / 0.35)',
                'glow-md': '0 0 24px rgb(var(--primary-rgb) / 0.45)',
                'glow-lg': '0 0 36px rgb(var(--primary-rgb) / 0.55)',
                'elevated': '0 4px 6px -1px oklch(0% 0 0 / 0.15), 0 2px 4px -1px oklch(0% 0 0 / 0.1), inset 0 1px 0 0 oklch(100% 0 0 / 0.05)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'fade-in-up': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' }
                },
                'slide-in-right': {
                    from: { opacity: '0', transform: 'translateX(-20px)' },
                    to: { opacity: '1', transform: 'translateX(0)' }
                },
                'slide-in-left': {
                    from: { opacity: '0', transform: 'translateX(-100%)' },
                    to: { opacity: '1', transform: 'translateX(0)' }
                },
                'scale-in': {
                    from: { opacity: '0', transform: 'scale(0.9)' },
                    to: { opacity: '1', transform: 'scale(1)' }
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgb(var(--primary-rgb) / 0.3)' },
                    '50%': { boxShadow: '0 0 35px rgb(var(--primary-rgb) / 0.5)' }
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                'fade-in': 'fade-in 0.5s ease-out',
                'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-in-left': 'slide-in-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
                'shimmer': 'shimmer 3s infinite'
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
