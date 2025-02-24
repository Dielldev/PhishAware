/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            animation: {
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "hover": "hover 3s ease-in-out infinite",
                "glow": "glow 2s ease-in-out infinite",
                "slide": "slide 15s linear infinite",
                "float": "float 6s ease-in-out infinite",
            },
            keyframes: {
                hover: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                glow: {
                    '0%, 100%': {
                        opacity: 0.2,
                        transform: 'scale(1)'
                    },
                    '50%': {
                        opacity: 0.4,
                        transform: 'scale(1.05)'
                    }
                },
                slide: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
                    '50%': { transform: 'translateY(-10px) rotate(2deg)' },
                }
            },
            colors: {
                primary: '#47F3AB',
                dark: {
                    100: '#2a2a2a',
                    200: '#1a1a1a',
                    300: '#0a0a0a',
                }
            }
        },
    },
    plugins: [],
}