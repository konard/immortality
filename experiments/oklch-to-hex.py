"""Convert thegridcn oklch theme tokens to hex for the palette CSS (experiment helper)."""
import math, sys

def oklch_to_hex(L, C, h):
    a = C * math.cos(math.radians(h)); b = C * math.sin(math.radians(h))
    l_ = L + 0.3963377774*a + 0.2158037573*b
    m_ = L - 0.1055613458*a - 0.0638541728*b
    s_ = L - 0.0894841775*a - 1.2914855480*b
    l, m, s = l_**3, m_**3, s_**3
    r = 4.0767416621*l - 3.3077115913*m + 0.2309699292*s
    g = -1.2684380046*l + 2.6097574011*m - 0.3413193965*s
    bl = -0.0041960863*l - 0.7034186147*m + 1.7076147010*s
    def enc(x):
        x = max(0, min(1, x))
        return round(255*(12.92*x if x <= 0.0031308 else 1.055*x**(1/2.4) - 0.055))
    return '#%02x%02x%02x' % (enc(r), enc(g), enc(bl))

themes = {'tron': (0.75,0.18,195), 'ares': (0.6,0.25,25), 'clu': (0.75,0.2,55),
          'athena': (0.85,0.18,90), 'aphrodite': (0.7,0.22,340), 'poseidon': (0.6,0.2,250)}
for name, (L, C, h) in themes.items():
    print(name, 'primary', oklch_to_hex(L, C, h), 'bright', oklch_to_hex(min(.95, L+.12), C*.7, h),
          'series', oklch_to_hex(L-.08, C*.9, h),
          'surface1', oklch_to_hex(0.13, 0.03, h), 'surface2', oklch_to_hex(0.17, 0.035, h),
          'grid', oklch_to_hex(0.24, 0.04, h), 'base', oklch_to_hex(0.33, 0.05, h),
          'textsec', oklch_to_hex(0.78, 0.04, h), 'muted', oklch_to_hex(0.56, 0.04, h))
print('page', oklch_to_hex(0.06, 0.02, 250))
