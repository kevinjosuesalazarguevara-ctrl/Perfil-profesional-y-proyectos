"""Sintetiza la banda sonora de 15 s (sonidos originales, sin licencias) sincronizada con scene.html.
Uso: python3 synth.py  ->  dova-sfx.wav  y luego mezcla con ffmpeg (ver README)."""
import wave
import numpy as np

SR, DUR = 44100, 15.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)

def tt(d): return np.arange(int(SR * d)) / SR
def env(d, a=0.003, r=None):
    n = int(SR * d); e = np.ones(n); a_n = max(1, int(SR * a)); e[:a_n] = np.linspace(0, 1, a_n)
    r_n = int(SR * (r if r else d * 0.8)); e[-r_n:] *= np.linspace(1, 0, r_n) ** 2
    return e
def put(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR); sig = sig[: max(0, N - i)]
    L[i:i + len(sig)] += sig * gain * (1 - max(0, pan)); R[i:i + len(sig)] += sig * gain * (1 - max(0, -pan))
def lp(x, k):  # filtro paso bajo simple
    y = np.zeros_like(x); a = 1 - np.exp(-k); acc = 0.0
    for i, v in enumerate(x): acc += a * (v - acc); y[i] = acc
    return y

def tick(f=1800, d=0.05):  # clic seco de interfaz
    t = tt(d); return (np.sin(2 * np.pi * f * t) * np.exp(-t * 90) + rng.normal(0, .25, len(t)) * np.exp(-t * 400))
def blip(f0, f1, d=0.12, vol=1.0):  # barrido tonal
    t = tt(d); f = f0 + (f1 - f0) * (t / d); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(d, 0.004, d * 0.7) * vol
def pop(f, d=0.14):  # burbuja
    t = tt(d); f_t = f * (1 + 0.8 * np.exp(-t * 30)); ph = 2 * np.pi * np.cumsum(f_t) / SR
    return np.sin(ph) * np.exp(-t * 22) * env(d, 0.002, d * 0.5)
def whoosh(d, up=True, vol=1.0):
    t = tt(d); n = rng.normal(0, 1, len(t)); k = np.linspace(0.02, 0.35, len(t)) if up else np.linspace(0.35, 0.02, len(t))
    y = np.zeros_like(n); acc = 0.0
    for i in range(len(n)):
        acc += k[i] * (n[i] - acc); y[i] = acc
    return y * np.sin(np.pi * t / d) ** 1.5 * vol
def chime(f, d=0.9):
    t = tt(d); return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2 * f * t) + 0.15 * np.sin(2 * np.pi * 3.01 * f * t)) * np.exp(-t * 4.5) * env(d, 0.004, d * 0.5)

# Cama musical: acorde suave (La menor 7) con trémolo lento
t = np.arange(N) / SR
pad = sum(np.sin(2 * np.pi * f * t + i) for i, f in enumerate([110, 164.8, 196, 261.6])) / 4
pad *= 0.5 + 0.5 * np.sin(2 * np.pi * 0.25 * t) * 0.3 + 0.2
fade = np.clip(t / 1.2, 0, 1) * np.clip((DUR - t) / 0.8, 0, 1)
L += pad * fade * 0.07; R += pad * fade * 0.07
# pulso grave discreto (4.4 a 13.2) para dar ritmo
for k in range(int((13.2 - 4.4) / 0.6) + 1):
    tb = 4.4 + 0.6 * k
    if tb < 13.2:
        tk = tt(0.25); put(np.sin(2 * np.pi * (55 + 40 * np.exp(-tk * 40)) * tk) * np.exp(-tk * 12), tb, 0.22)
        h = rng.normal(0, 1, int(SR * 0.04)) * np.exp(-tt(0.04) * 120); put(h, tb + 0.3, 0.05)

# Logotipo (0.1 a 0.9) y línea lima (1.0 a 2.4)
put(whoosh(0.8, True, 0.5), 0.1, 0.35)
put(np.sin(2 * np.pi * 70 * tt(0.5)) * np.exp(-tt(0.5) * 7), 0.85, 0.3)
put(blip(320, 900, 1.4, 0.5) * np.linspace(0.2, 1, int(SR * 1.4)), 1.0, 0.16, -0.2)

# Subtítulos: un clic suave por fragmento
for ts in [0.3, 1.9, 3.2, 4.4, 6.2, 7.2, 8.4, 9.5, 11.2, 12.2, 13.2]:
    put(tick(1500, 0.05), ts, 0.16)

# Sitio web: tres trazos (barra lima y dos líneas)
for ts, f in [(4.6, 420), (5.0, 520), (5.2, 620)]:
    put(blip(f, f * 1.8, 0.35, 0.8), ts, 0.14, 0.15)
put(pop(330, 0.2), 5.8, 0.18)
# Marca: cuatro burbujas en escala pentatónica
for i, f in enumerate([523, 587, 659, 784]):
    put(pop(f), 6.25 + 0.1 * i, 0.32, -0.3 + 0.2 * i)
# Automatización: la bolita toca cada nodo
for k, f in enumerate([392, 494, 587, 392]):
    put(blip(f, f * 1.01, 0.18, 1.0) * np.exp(-tt(0.18) * 9), 7.2 + 0.667 * k, 0.25)
# Selector ES/EN: interruptor
put(tick(900, 0.06), 10.2, 0.4); put(np.sin(2 * np.pi * 120 * tt(0.12)) * np.exp(-tt(0.12) * 30), 10.22, 0.35)
put(whoosh(0.4, True, 0.4), 10.25, 0.2); put(tick(2200, 0.05), 10.7, 0.3)
# Línea que se endereza: vibrato que se calma y resuelve
d = 1.4; tl = tt(d); prog = np.clip((tl - 0.25) / 1.1, 0, 1)
vib = 40 * (1 - prog) * np.sin(2 * np.pi * 7 * tl); f = 260 + 260 * prog + vib
put(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.01, 0.2), 11.25, 0.2)
put(chime(1046, 0.7), 12.6, 0.14)
# Cierre: símbolo sube, campanilla y clic del botón
put(whoosh(0.7, True, 0.5), 13.25, 0.3)
put(chime(784, 1.0), 13.9, 0.2); put(chime(1175, 1.0), 14.0, 0.16); put(chime(1568, 0.9), 14.1, 0.1)
put(tick(2000, 0.06), 13.65, 0.35)

# Normalizar a -3 dBFS y exportar
peak = max(np.abs(L).max(), np.abs(R).max()); g = 0.7 / peak
st = np.stack([L * g, R * g], 1); pcm = (np.clip(st, -1, 1) * 32767).astype('<i2')
with wave.open('dova-sfx.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok dova-sfx.wav', DUR, 's')
