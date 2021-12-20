import fs from 'fs';
import WavEncoder from 'wav-encoder';
import { SuliModel } from './suli';
import { WasoModel } from './waso';
import yargs from 'yargs';

const models = ["suli", "waso"] as const;

function preprocess(l: string): string {
  return l.split(/\s+/g).map(w=> {
    w = w.toLowerCase().replace(/e/g, 'i').replace(/u/g, 'o');
    if (w.length < 4 && !/^(i|a|o)/.test(w)) return w;
    return w.replace(/i|a|o/, m => m.toUpperCase());
  }).join('');
}

async function main(){
  const argv = await yargs(process.argv.slice(2)).options({
    split: { type: 'boolean', default: false },
    model: { alias: 'm', choices: models, default: 'suli' },
    i: { type: 'string', demandOption: true },
  }).argv;

  const fname = argv.i;
  const stats = fs.statSync(fname, { throwIfNoEntry: false });
  const input = (stats && stats.isFile()) ? 
    fs.readFileSync(fname).toString('utf8').split('\n').map(s => s.trim()) : [fname];

  const sampleRate = 44100;
  const model = argv.m === 'suli' ? SuliModel : WasoModel;
  console.error(`Using model "${argv.m}".`);

  if (argv.split) {
    for (const line of input) {
      const text = preprocess(line);
      const [PCM] = model.synthesize({ text, settings: { sampleRate } });

      const buffer = await WavEncoder.encode({
        sampleRate,
        channelData: [PCM as Float32Array],
      });
      console.log(`${line}.wav`);
      fs.writeFileSync(`${line}.wav`, new Uint8Array(buffer));
    }
  } else {
    const text = input.map(preprocess).join(' ');
    const [PCM] = model.synthesize({ text, settings: { sampleRate } });

    const buffer = await WavEncoder.encode({
      sampleRate,
      channelData: [PCM as Float32Array],
    });
    process.stdout.write(new Uint8Array(buffer));
  }
}

main();