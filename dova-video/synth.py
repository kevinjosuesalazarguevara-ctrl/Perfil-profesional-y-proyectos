"""Sintetiza la banda sonora (sonidos originales, sin licencias) a partir de timeline-<lang>.json,
la misma línea de tiempo que usa el render, así que queda sincronizada con cada animación.
Uso: python3 synth.py es  ->  dova-es-sfx.wav"""
import json, sys, wave
import numpy as np

lang = sys.argv[1] if len(sys.argv) > 1 else 'es'
TL = json.load(open(f'timeline-{lang}.json'))
SR, DUR = 44100, float(TL['duration'])
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)

def tt(d): return np.arange(int(SR * d)) / SR
def env(d, a=0.003, r=None):
    n = int(SR * d); e = np.ones(n); a_n = max(1, int(SR * a)); e[:a_n] = np.linspace(0, 1, a_n)
    r_n = max(1, int(SR * (r if r else d * 0.8))); e[-r_n:] *= np.linspace(1, 0, r_n) ** 2
    return e
def put(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N or i < 0: return
    sig = sig[: N - i]
    L[i:i + len(sig)] += sig * gain * (1 - max(0, pan)); R[i:i + len(sig)] += sig * gain * (1 - max(0, -pan))
def tick(f=1800, d=0.05):
    t = tt(d); return np.sin(2 * np.pi * f * t) * np.exp(-t * 90) + rng.normal(0, .25, len(t)) * np.exp(-t * 400)
def blip(f0, f1, d=0.12):
    t = tt(d); f = f0 + (f1 - f0) * (t / d); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.004, d * 0.7)
def pop(f, d=0.14):
    t = tt(d); f_t = f * (1 + 0.8 * np.exp(-t * 30)); return np.sin(2 * np.pi * np.cumsum(f_t) / SR) * np.exp(-t * 22) * env(d, 0.002, d * 0.5)
def whoosh(d, up=True):
    n = rng.normal(0, 1, int(SR * d)); k = np.linspace(0.02, 0.35, len(n)) if up else np.linspace(0.35, 0.02, len(n))
    y = np.zeros_like(n); acc = 0.0
    for i in range(len(n)):
        acc += k[i] * (n[i] - acc); y[i] = acc
    return y * np.sin(np.pi * tt(d)[:len(n)] / d) ** 1.5
def chime(f, d=0.9):
    t = tt(d); return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * 2 * f * t) + .15 * np.sin(2 * np.pi * 3.01 * f * t)) * np.exp(-t * 4.5) * env(d, .004, d * .5)

# cama: acorde suave con trémolo lento + pulso grave discreto desde el primer acto
t = np.arange(N) / SR
pad = sum(np.sin(2 * np.pi * f * t + i) for i, f in enumerate([110, 164.8, 196, 261.6])) / 4 * (0.7 + 0.2 * np.sin(2 * np.pi * 0.25 * t))
fade = np.clip(t / 1.2, 0, 1) * np.clip((DUR - t) / 0.8, 0, 1)
L += pad * fade * 0.07; R += pad * fade * 0.07
beat_a, beat_b = TL['scenes']['web']['start'], TL['scenes']['cta']['start']
tb = beat_a
while tb < beat_b:
    k = tt(0.25); put(np.sin(2 * np.pi * (55 + 40 * np.exp(-k * 40)) * k) * np.exp(-k * 12), tb, .2)
    put(rng.normal(0, 1, int(SR * .04)) * np.exp(-tt(.04) * 120), tb + .3, .05)
    tb += 0.6

for e in TL['sfx']:
    k, t0 = e['k'], e['t']
    if k == 'tick': put(tick(1500), t0, .16)
    elif k == 'whoosh': put(whoosh(e.get('d', .5), e.get('up', True)), t0, .35 * e.get('vol', 1))
    elif k == 'logo':
        put(whoosh(.8, True), t0, .3); put(np.sin(2 * np.pi * 70 * tt(.5)) * np.exp(-tt(.5) * 7), t0 + .75, .3)
    elif k == 'draw':
        d = e.get('d', .35); f = e.get('f', 400); sw = blip(f, f * (2.8 if d > 1 else 1.8), d)
        if d > 1: sw = sw * np.linspace(.2, 1, len(sw))
        put(sw, t0, .15, -.2 if d > 1 else .15)
    elif k == 'pop': put(pop(e.get('f', 500)), t0, .3, e.get('pan', 0))
    elif k == 'node': put(blip(e['f'], e['f'] * 1.01, .18) * np.exp(-tt(.18) * 9), t0, .25)
    elif k == 'toggle':
        put(tick(900, .06), t0 - .5, .4); put(np.sin(2 * np.pi * 120 * tt(.12)) * np.exp(-tt(.12) * 30), t0 - .48, .35)
        put(whoosh(.4, True), t0 - .45, .2); put(tick(2200, .05), t0, .3)
    elif k == 'vib':
        d = 1.4; tl = tt(d); prog = np.clip((tl - .25) / 1.1, 0, 1); f = 260 + 260 * prog + 40 * (1 - prog) * np.sin(2 * np.pi * 7 * tl)
        put(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, .01, .2), t0, .2)
    elif k == 'chime': put(chime(e['f']), t0, .17 * e.get('vol', 1))
    elif k == 'click': put(tick(2000, .06), t0, .4)

peak = max(np.abs(L).max(), np.abs(R).max()); g = 0.7 / peak
st = np.stack([L * g, R * g], 1); pcm = (np.clip(st, -1, 1) * 32767).astype('<i2')
out = f'dova-{lang}-sfx.wav'
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok', out, DUR, 's', len(TL['sfx']), 'eventos')
