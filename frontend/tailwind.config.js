/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Semillero Brand Colors
        semillero: {
          primary: '#00A86B',
          'primary-hover': '#059669',
          secondary: '#FFD166',
          accent: '#FFD166',
        },
        // Role Colors
        role: {
          admin: '#8B5CF6',
          coordinator: '#00A86B',
          teacher: '#3B82F6',
          student: '#F59E0B',
        },
        // Status Colors
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
        // Shadcn/ui Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'semillero-sm': 'var(--shadow-sm)',
        'semillero-md': 'var(--shadow-md)',
        'semillero-lg': 'var(--shadow-lg)',
        'semillero-xl': 'var(--shadow-xl)',
      },
      spacing: {
        'semillero-1': 'var(--space-1)',
        'semillero-2': 'var(--space-2)',
        'semillero-3': 'var(--space-3)',
        'semillero-4': 'var(--space-4)',
        'semillero-6': 'var(--space-6)',
        'semillero-8': 'var(--space-8)',
        'semillero-12': 'var(--space-12)',
        'semillero-16': 'var(--space-16)',
      },
      fontSize: {
        'semillero-xs': 'var(--font-size-xs)',
        'semillero-sm': 'var(--font-size-sm)',
        'semillero-base': 'var(--font-size-base)',
        'semillero-lg': 'var(--font-size-lg)',
        'semillero-xl': 'var(--font-size-xl)',
        'semillero-2xl': 'var(--font-size-2xl)',
        'semillero-3xl': 'var(--font-size-3xl)',
        'semillero-4xl': 'var(--font-size-4xl)',
      },
    },
  },
  plugins: [],
}