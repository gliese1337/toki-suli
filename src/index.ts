import fs from 'fs';
import WavEncoder from 'wav-encoder';
import { TokiModel } from './model';

const fname = process.argv[2];
const stats = fs.statSync(fname, { throwIfNoEntry: false });
const input = (stats && stats.isFile()) ? 
  fs.readFileSync(process.argv[2]).toString('utf8').split('\n').map(s => s.trim()) : [fname];

function preprocess(l: string): string {
  return l.split(/\s+/g).map(w=> {
    w = w.toLowerCase().replace(/e/g, 'i').replace(/u/g, 'o');
    if (w.length < 4 && !/^(i|a|o)/.test(w)) return w;
    return w.replace(/i|a|o/, m => m.toUpperCase());
  }).join('');
}

const sampleRate = 44100;

if (process.argv[3] === 'split') {
  (async()=> {
    for (const line of input) {
      const text = preprocess(line);
      const [PCM] = TokiModel.synthesize({ text, settings: { sampleRate } });

      const buffer = await WavEncoder.encode({
        sampleRate,
        channelData: [PCM as Float32Array],
      });
      console.log(`${line}.wav`);
      fs.writeFileSync(`${line}.wav`, new Uint8Array(buffer));
    }
  })();
} else {
  const text = input.map(preprocess).join(' ');
  const [PCM] = TokiModel.synthesize({ text, settings: { sampleRate } });

  WavEncoder.encode({
    sampleRate,
    channelData: [PCM as Float32Array],
  }).then((buffer: ArrayBuffer) => {
    process.stdout.write(new Uint8Array(buffer));
  });
}