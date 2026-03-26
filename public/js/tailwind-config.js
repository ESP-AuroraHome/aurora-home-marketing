tailwind.config = {
    theme: {
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
        },
        extend: {
            colors: {
                cream: {
                    50: '#FDFCF8',
                    100: '#F7F5F0',
                    200: '#EBE8E0',
                },
                stone: {
                    800: '#292524',
                    500: '#78716C',
                }
            },
            animation: {
                'aurora': 'aurora 10s ease infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                aurora: {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '50%': { transform: 'translate(20px, -20px) scale(1.1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        }
    }
}
