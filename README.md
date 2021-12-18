# toki-suli
 Whistled Toki Pona Synthesizer

```
npm i
npm run build
node bin {"text to sythesize" or filename} > "output file name"
node bin {filename} split
```

The first option (without "split") will synthesize the entire text to a single WAV file written to standard output.

The second option (with "split") will produce separate WAV files for each line of the input, named according to the text.