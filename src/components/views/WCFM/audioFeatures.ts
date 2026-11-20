export interface AudioFeatures {
  level: number;
  bass: number;
  mid: number;
  treble: number;
  // follows the song
  brightness: number;
  beat: boolean;
  beatStrength: number;
}

export const SILENT: AudioFeatures = {
  level: 0,
  bass: 0,
  mid: 0,
  treble: 0,
  brightness: 0.5,
  beat: false,
  beatStrength: 0,
};

export const STEADY: AudioFeatures = { ...SILENT, level: 0.6, mid: 0.4 };

const BASS_HZ = [40, 200];
const MID_HZ = [200, 2000];
const TREBLE_HZ = [2000, 10000];
const CENTROID_MAX_HZ = 4500;
const MIN_BEAT_GAP = 0.28;

export class AudioAnalysis {
  private analyser: AnalyserNode;
  private freq: Uint8Array<ArrayBuffer>;
  private wave: Uint8Array<ArrayBuffer>;
  private binHz: number;
  private bassAvg = 0;
  private lastBeat = 0;
  private out: AudioFeatures = { ...SILENT };

  constructor(analyser: AnalyserNode) {
    this.analyser = analyser;
    this.freq = new Uint8Array(analyser.frequencyBinCount);
    this.wave = new Uint8Array(analyser.fftSize);
    this.binHz = analyser.context.sampleRate / analyser.fftSize;
  }

  private band([lo, hi]: number[]) {
    const from = Math.max(1, Math.floor(lo / this.binHz));
    const to = Math.min(this.freq.length - 1, Math.ceil(hi / this.binHz));
    let sum = 0;
    for (let i = from; i <= to; i++) sum += this.freq[i];
    return sum / ((to - from + 1) * 255);
  }

  read(time: number): AudioFeatures {
    const { analyser, freq, wave, out } = this;
    analyser.getByteFrequencyData(freq);
    analyser.getByteTimeDomainData(wave);

    let sq = 0;
    for (let i = 0; i < wave.length; i++) {
      const x = (wave[i] - 128) / 128;
      sq += x * x;
    }
    const level = Math.min(Math.sqrt(sq / wave.length) * 3.2, 1);
    out.level += (level - out.level) * (level > out.level ? 0.35 : 0.04);

    const bass = this.band(BASS_HZ);
    out.bass += (bass - out.bass) * 0.3;
    out.mid += (this.band(MID_HZ) - out.mid) * 0.2;
    out.treble += (this.band(TREBLE_HZ) - out.treble) * 0.2;

    let weighted = 0;
    let total = 0;
    for (let i = 1; i < freq.length; i++) {
      weighted += freq[i] * i * this.binHz;
      total += freq[i];
    }
    if (total > 0) {
      const centroid = Math.min(weighted / total / CENTROID_MAX_HZ, 1);
      out.brightness += (centroid - out.brightness) * 0.01;
    }

    const flux = bass - this.bassAvg;
    this.bassAvg += (bass - this.bassAvg) * 0.05;
    out.beat =
      flux > this.bassAvg * 0.3 + 0.04 && time - this.lastBeat > MIN_BEAT_GAP;
    out.beatStrength = out.beat ? Math.min(flux / 0.3, 1) : 0;
    if (out.beat) this.lastBeat = time;

    return out;
  }
}
