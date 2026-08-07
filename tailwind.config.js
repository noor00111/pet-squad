/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			colorPrimary: {
  				DEFAULT: 'hsl(var(--color-primary))'
  			},
  			colorSecondary: {
  				DEFAULT: 'hsl(var(--color-secondary))'
  			},
  			footer: {
  				DEFAULT: 'hsl(var(--footer-bg))',
  				foreground: 'hsl(var(--footer-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			headingFont: [
  				'Fraunces',
  				'ui-serif',
  				'Georgia',
  				'serif'
  			],
  			bodyFont: [
  				'"Plus Jakarta Sans"',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			xs: ['0.75rem', { lineHeight: '1.5' }],
  			sm: ['0.875rem', { lineHeight: '1.55' }],
  			base: ['1rem', { lineHeight: '1.6' }],
  			lg: ['1.125rem', { lineHeight: '1.55' }],
  			xl: ['1.25rem', { lineHeight: '1.5' }],
  			'2xl': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
  			'3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
  			'4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
  			'5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
  			'6xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			blob: {
  				'0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
  				'33%': { transform: 'translate(30px, -40px) scale(1.1)' },
  				'66%': { transform: 'translate(-20px, 20px) scale(0.95)' }
  			},
  			'glow-pulse': {
  				'0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
  				'50%': { opacity: '1', transform: 'scale(1.05)' }
  			},
  			'fade-up': {
  				from: { opacity: '0', transform: 'translateY(24px)' },
  				to: { opacity: '1', transform: 'translateY(0)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			blob: 'blob 12s infinite ease-in-out',
  			'glow-pulse': 'glow-pulse 4s infinite ease-in-out',
  			'fade-up': 'fade-up 0.6s ease-out both'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

