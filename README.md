# toki-suli
 Whistled Toki Pona Synthesizer

Based on the [Whistler](https://github.com/conlang-software-dev/whistler) library for writing whistling synthesizers.

The name is a reference to the fact that natural whistle languages develop to support communication over Big distances--e.g., between mountain peaks or across a savanna.

The whistled phonology is mainly based on a combination of Silbo Gomero and Kusköy (whistled Turkish).

## Usage

First, install the package with
```
npm i
npm run build
```

You can then run
* `node bin [-m waso|suli] -i {"text to sythesize" or filename} > "output file name"`
or
* `node bin [-m waso|suli] -i {"text to sythesize" or filename} --split`

The first option (without "--split") will synthesize the entire text to a single WAV file written to standard output.

The second option (with "--split") will produce separate WAV files for each line of the input, named according to the text.

The `-m` option specifies which acoustic model to use for synthesis. The default is `suli`, which uses the consonant and vowel mappings described below. The other option, `waso`, uses the scheme described in [this Reddit post](https://www.reddit.com/r/tokipona/comments/guixew/toki_waso/).

## Samples

* The `poem` folder contains synthesized WAV files of "tawa anpa nasa", a poem from the LCC6 Conlang Relay.
* The `lexicon` folder contains synthesizes WAV files of 123 individual Toki Pona words for easy comparison.
* The `contexts` folder contains synthesized WAV files of CV and VCV psuedo-words that demonstrate all combinations of consonants and vowels (except for terminal /n/s and /n/-clusters) to make it easy to compare phones without having to search for minimal pairs in the actual lexicon. 

## Model Description

Toki Pona's five vowels are mapped to 3 whistled vowels as follows:

* high: i & e
* mid: a
* low: o & u

The i vs. e and o vs. u contrasts have no minimal pairs in the Toki Pona Classic Word List, so these mergers don't produce any lexical confusion.

Consonants are mapped onto 4 frequency loci (places of articulation) and 3 manners of articulation:

* **Loci**
    - Sharp - formant motion upwards to a target well above the vowel space
    - Acute - formant motion upwards, not necessarily leaving the vowel space if starting from /a/ or /o,u/
    - Mid - no formant motion, just amplitude modulation within the vowel space
    - Grave - formant motion downward
* **Manners**
    - Interrupted - sound cuts off and restarts abruptly, with a distinct silent period.
    - Continuous - amplitude drops and rises smoothly, with no silence. At utterance boundaries, an additional partial curve section is added opposite the zero-amplitude peak to increase contrast with Gradual consonants.
    - Gradual - amplitude drops and rises smoothly, with silence.

The actual consonant mappings are as follows:

* Sharp
    * **t**: Interrupted
    * **j**: Continuous

* Acute
    * **s**: Interrupted
    * **l**: Continuous
    * **n**: Gradual (except when it assimilates to /m/ before /m/ or /p/)

* Mid
    * **k**: Interrupted
    * **w**: Continuous

* Grave
    * **p**: Interrupted
    * **m**: Gradual

Spreading 9 consonants across 4 loci rather than 3 allows maximizing contrasts to make reliable perception easier.

The /t/ vs. /s/ phonemes, being distinguished only by the frequency height difference between Acute and Sharp loci, are also potentially confusable. (This is less of an issue for /l/ vs. /j/, as the longer high-amplitude period of Continuous consonants makes the target frequencies easier to distinguish.) Making bespoke adjustments to the transition and break timings of /s/, however, to better reflect the continuant nature of normally-spoken sibilants vs. stops, manages to make them easily distinguishable except at utterance boundaries. So, as long as you don't start a sentence with "telo" or "selo", it's not a problem--and that's still *much* better than any natural whistle language does at maintaining base-language distinctions! If this turns out to be a problem anyway, it can be resolved by altering the shape of the attack curve approaching the amplitude cutoff for /s/--but I didn't want to complicate the machine-readable acoustic model, or the instructions for human pronunciation if I didn't absolutely have to.

To assist in word boundary identification, the synthesizer also applies initial stress, with a 30% increase is volume and 50% increase in length for initial vowels in multi-syllable words.

The only possible consonant clusters, including across word boundaries, are /n/- or /m/- initial (the latter coming from assimilation of /n/ to /m/ before a /p/ or another /m/). In order to ensure that the boundary between consonants is clear, these are handled by a transition to the closest edge of the vowel space with zero dwell time between the individual consonant motions. /n/-assimilation ensures that the formant line never had to cross *through* the vowel space between adjacent consonants, so we don't get the possible confusion of introducing unintended epenthetic vowels.

Adjacent vowels across word boundaries are handled by a rapid but smooth frequency transition; in the synthesizer model, this transition is currently set at 10 milliseconds, but it is not easily confusable with any consonants, so you can take as long as you want when trying to whistle yourself.

## Model Comparison

The `waso` model eliminates the Mid consonant locus and thus distributes additional consonants to the Sharp and Grave loci, and maximizes usage of manner distinctions. This results in 3 pairs of consonants which are distinguished entirely by Sharp vs. Acute locus, rather than just 2. To address this, the Sharp Interrupted consonant (/k/ in `waso`) thus has modified attack and silence timings compared to Acute and Grave consonants, just as /s/ (the **Acute** Interrupted consonant) has bespoke modifications in `suli`.

3 pairs of consonants are distinguished only by Continuous vs. Gradual manner in `waso`, compared to 1 such pair in `suli`. Without the utterance-boundary modifications to Continuous consonants realizations, C and G consonants are confusable at utterance boundaries, and earlier versions of the `suli` model did not include those allophonic modifications because the issue only affected /n/ vs. /l/, for which there are no minimal pairs in the Classic Word List. The `waso` model, however, would have had three times as much confusion between C and G consonants, making the allophonic variation necessary; to ensure a fair comparison between the models, this was thus added to `suli` as well.

Since the `waso` model puts /w/ at the Grave locus rather than the missing Mid, /n/-assimilation occurs before /w/ and well as /m/ and /p/, in contrast to the `suli` model. This gives `waso` a larger proportion of low frequencies compared to `suli`, although moving /k/ from Mid to Sharp partially offsets that.

Both models use the same realization of stress.