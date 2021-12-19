# toki-suli
 Whistled Toki Pona Synthesizer

Based on the [Whistler](https://github.com/conlang-software-dev/whistler) library for writing whistling synthesizers.

The name is a reference to the fact that natural whistle languages develop to support communication over Big distances--e.g., between mountain peaks or across a savanna.

The whistled phonology is mainly based on a combination of Silbo Gomero and Kusköy (whistled Turkish).

## Usage

```
npm i
npm run build
node bin {"text to sythesize" or filename} > "output file name"
node bin {filename} split
```

The first option (without "split") will synthesize the entire text to a single WAV file written to standard output.

The second option (with "split") will produce separate WAV files for each line of the input, named according to the text.

## Samples

* The `poem` folder contains a synthesized WAV file of "tawa anpa nasa", a poem from the LCC6 Conlang Relay.
* The `lexicon` folder contains synthesize WAV files of 123 individual Toki Pona words for easy comparison.

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
    - Continuous - amplitude drops and rises smoothly, with no silence.
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

Spreading 9 consonants across 4 loci rather than 3 allows maximizing contrasts to make reliable perception easier. As it is, the /n/ and /l/ phonemes are potentially confusable at utterance boundaries without additional allophonic features added, but since the Classic Word List has no minimal pairs between word-initial or word-final /n/ and /l/, that's not a serious issue.

The /t/ vs. /s/ phonemes, being distinguished only by the frequency height difference between Acute and Sharp loci, are also potentially confusable. (This is less of an issue for /l/ vs. /j/, as the longer high-amplitude period of Continuous consonants makes the target frequencies easier to distinguish.) Making bespoke adjustments to the transition and break timings of /s/, however, to better reflect the continuant nature of normally-spoken sibilants vs. stops, manages to make them easily distinguishable except at utterance boundaries. So, as long as you don't start a sentence with "telo" or "selo", it's not a problem--and that's still *much* better than any natural whistle language does at maintaining base-language distinctions! If this turns out to be a problem anyway, it can be resolved by altering the shape of the attack curve approaching the amplitude cutoff for /s/--but as with /n/ vs. /l/, I didn't want to complicate the machine-readable acoustic model, or the instructions for human pronunciation if I didn't absolutely have to.

To assist in word boundary identification, the synthesizer also applies initial stress, with a 30% increase is volume and 50% increase in length for initial vowels in multi-syllable words.

The only possible consonant clusters, including across word boundaries, are /n/- or /m/- initial (the latter coming from assimilation of /n/ to /m/ before a /p/ or another /m/). In order to ensure that the boundary between consonants is clear, these are handled by a transition to the closest edge of the vowel space with zero dwell time between the individual consonant motions. /n/-assimilation ensures that the formant line never had to cross *through* the vowel space between adjacent consonants, so we don't get the possible confusion of introducing unintended epenthetic vowels.

Adjacent vowels across word boundaries are handled by a rapid but smooth frequency transition; in the synthesizer model, this transition is currently set at 10 milliseconds, but it is not easily confusable with any consonants, so you can take as long as you want when trying to whistle yourself. 