/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#064e3b',
                    'primary-light': '#065f46',
                    'primary-lighter': '#009668',
                    'primary-dark': '#022c22',
                    
                    'neutral-50': '#f8f8f6',
                    'neutral-100': '#f0f7fd',
                    'neutral-200': '#e1e1e0',
                    'neutral-300': '#9ca3af',
                    'neutral-600': '#4b5563',
                    'neutral-700': '#374151',
                    'neutral-800': '#1f2937',
                    'neutral-900': '#111827',
                    
                    'text-primary': '#022c22',
                    'text-secondary': '#1b293c',
                    'text-muted': '#46566a',
                },
                blue: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    500: '#065f46',
                    600: '#064e3b',
                    700: '#022c22',
                    900: '#0f1419',
                },
                status: {
                    'red-bg': '#fee2e2',
                    'red-text': '#b91c1c',
                    'red-dark-bg': '#7f1d1d',
                    'red-dark-text': '#fca5a5',
                    
                    'orange-bg': '#fed7aa',
                    'orange-text': '#c2410c',
                    'orange-dark-bg': '#9a3412',
                    'orange-dark-text': '#fed7aa',
                    
                    'yellow-bg': '#fef08a',
                    'yellow-text': '#a16207',
                    'yellow-dark-bg': '#854d0e',
                    'yellow-dark-text': '#fde047',
                    
                    'purple-bg': '#e9d5ff',
                    'purple-text': '#7c3aed',
                    'purple-dark-bg': '#5b21b6',
                    'purple-dark-text': '#c4b5fd',
                    
                    'green-bg': '#bbf7d0',
                    'green-text': '#15803d',
                    'green-dark-bg': '#14532d',
                    'green-dark-text': '#86efac',
                },
                progress: {
                    'red': '#ef4444',
                    'orange': '#f97316',
                    'yellow': '#eab308',
                    'green': '#22c55e',
                }
            }
        },
    },
    plugins: [],
}
