import { TextModel, AcousticModel } from "whistle-synthesis";

/*
p: Grave, Interrupted
t: Acute, Interrupted
k: Sharp, Interrupted
w: Grave, Continuous
l: Acute, Continuous
j: Sharp, Continuous
m: Grave, Gradual
n: Acute, Gradual
s: Sharp, Gradual
*/

const amodel: AcousticModel = {
  wordBoundary: ' ',
  classes: {
    VI: ['i','I'],
    VA: ['a','A'],
    VO: ['o','O'],
    V: ['VI', 'VA', 'VO'],
    CN: ['t', 'k', 'l', 'j', 's', 'n'],
    MP: ['p', 'w', 'm'],
    C: ['CN', 'MP'],
    ANY: ['V', 'C'],
  },
  constants: {
    SEG_LEN: 270, // milliseconds
    G_TRANS: 95, 
    IA_TRANS: 50,
    IS_TRANS: 85,
    C_TRANS: 170,

    H: 2600,
    M: 2100,
    L: 1750,
    
    NORM_A: 0.7,
    LOUD_A: 1.0,

    SHARP_H: 3700,
    SHARP_L: 3300,
    ACUTE_H: 2700,
    ACUTE_L: 2500,
    GRAVE_H: 1900,
    GRAVE_L: 1200,
  },
  namedPronunciations: {
    IA_SILENCE: [{ a: { type: 'constant', y: 0}, run: 170 }],
    IS_SILENCE: [{ a: { type: 'constant', y: 0}, run: 100 }],
    G_SILENCE: [{ a: { type: 'constant', y: 0}, run: 80 }],
    C_SILENCE: [{ a: { type: 'constant', y: 0}, run: 30 }],
    
    S_SILENCE: [{ a: { type: 'constant', y: 0}, run: 500 }],
    
    HV: [{ f: { type: 'constant', y: 'H' } }],
    MV: [{ f: { type: 'constant', y: 'M' } }],
    LV: [{ f: { type: 'constant', y: 'L' } }],
    
    S_A: [{ a: { type: 'constant', y: 'LOUD_A'} }],
    S_R: [{ run: 'SEG_LEN * 1.5' }],
    STR: ['S_A', 'S_R'],

    L_A: [{ a: { type: 'constant', y: 'NORM_A' } }],
    L_R: [{ run: 'SEG_LEN' }],
    LAX: ['L_A', 'L_R'],

    SHARP: [{ f: { type: 'constant', y: '(SHARP_L + SHARP_H) / 2' } }],
    ACUTE: [{ f: { type: 'constant', y: '(ACUTE_L + ACUTE_H) / 2' } }],
    GRAVE: [{ f: { type: 'constant', y: '(GRAVE_L + GRAVE_H) / 2' } }],

    C_ONSET: [{
      f: { type: 'transition', curve: 'sine', sy: 'M', ey: 'lf', sclip: '3*pi/4' },
      a: { type: 'contour', y: 0, a: 'NORM_A' },
      run: 'C_TRANS/3'
    }],

    IA2i: [{
      f: { type: 'transition', curve: 'convex', ey: 'H' },
      run: 'IA_TRANS',
    }],
    IA2a: [{
      f: { type: 'transition', curve: 'convex', ey: 'M' },
      run: 'IA_TRANS',
    }],
    IA2o: [{
      f: { type: 'transition', curve: 'convex', ey: 'L' },
      run: 'IA_TRANS',
    }],

    IS2i: [{
      f: { type: 'transition', curve: 'convex', ey: 'H' },
      run: 'IS_TRANS',
    }],
    IS2a: [{
      f: { type: 'transition', curve: 'convex', ey: 'M' },
      run: 'IS_TRANS',
    }],
    IS2o: [{
      f: { type: 'transition', curve: 'convex', ey: 'L' },
      run: 'IS_TRANS',
    }],

    C2i: [{
      f: { type: 'transition', curve: 'sine', ey: 'H' },
      a: { type: 'transition', curve: 'sine', sy: 0, ey: 'la' },
      run: 'C_TRANS',
    }],
    C2a: [{
      f: { type: 'transition', curve: 'sine', ey: 'M' },
      a: { type: 'transition', curve: 'sine', sy: 0, ey: 'la' },
      run: 'C_TRANS',
    }],
    C2o: [{
      f: { type: 'transition', curve: 'sine', ey: 'L' },
      a: { type: 'transition', curve: 'sine', sy: 0, ey: 'la' },
      run: 'C_TRANS',
    }],

    G2i: [{
      f: { type: 'transition', curve: 'sine', ey: 'H' },
      a: { type: 'transition', curve: 'sine', sy: 0, ey: 'la' },
      run: 'G_TRANS',
    }],
    G2a: [{
      f: { type: 'transition', curve: 'sine', ey: 'M' },
      a: { type: 'transition', curve: 'sine', sy: 0, ey: 'la' },
      run: 'G_TRANS',
    }],
    G2o: [{
      f: { type: 'transition', curve: 'sine', ey: 'L' },
      a: { type: 'transition', curve: 'sine', sy: 0, ey: 'la' },
      run: 'G_TRANS',
    }],

    v2p: [{
      f: { type: 'transition', curve: 'concave', ey: 'lr(lf, L, H, GRAVE_L, GRAVE_H)' },
      run: 'IA_TRANS',
    }],
    n2p: [{
      f: { type: 'transition', curve: 'sine', ey: 'GRAVE_H' },
      a: { type: 'transition', curve: 'sine', ey: 'NORM_A' },
      run: 'G_TRANS',
    },{
      f: { type: 'transition', curve: 'concave', ey: 'GRAVE_L' },
      run: 'IA_TRANS',
    }],

    v2t: [{
      f: { type: 'transition', curve: 'concave', ey: 'lr(lf, L, H, ACUTE_L, ACUTE_H)' },
      run: 'IA_TRANS',
    }],
    n2t: [{
      f: { type: 'transition', curve: 'sine', ey: 'ACUTE_L' },
      a: { type: 'transition', curve: 'sine', ey: 'NORM_A' },
      run: 'G_TRANS',
    },{
      f: { type: 'transition', curve: 'concave', ey: 'ACUTE_H' },
      run: 'IA_TRANS',
    }],

    v2k: [{
      f: { type: 'transition', curve: 'concave', ey: 'lr(lf, L, H, SHARP_L, SHARP_H)' },
      run: 'IS_TRANS',
    }],
    n2k: [{
      f: { type: 'transition', curve: 'sine', ey: 'ACUTE_L' },
      a: { type: 'transition', curve: 'sine', ey: 'NORM_A' },
      run: 'G_TRANS',
    },{
      f: { type: 'transition', curve: 'concave', ey: 'SHARP_H' },
      run: 'IS_TRANS',
    }],

    v2w: [{
      f: { type: 'transition', curve: 'sine', ey: 'lr(lf, L, H, GRAVE_L, GRAVE_H)' },
      a: { type: 'transition', curve: 'sine', ey: 0 },
      run: 'C_TRANS',
    }],
    n2w: [{
      f: { type: 'transition', curve: 'sine', ey: 'GRAVE_H' },
      a: { type: 'transition', curve: 'sine', ey: 'NORM_A' },
      run: 'G_TRANS',
    },{
      f: { type: 'transition', curve: 'sine', ey: 'GRAVE_L' },
      a: { type: 'transition', curve: 'sine', ey: 0 },
      run: 'C_TRANS',
    }],

    v2l: [{
      f: { type: 'transition', curve: 'sine', ey: 'lr(lf, L, H, ACUTE_L, ACUTE_H)' },
      a: { type: 'transition', curve: 'sine', ey: 0 },
      run: 'C_TRANS',
    }],
    n2l: [{
      f: { type: 'transition', curve: 'sine', ey: 'ACUTE_L' },
      a: { type: 'transition', curve: 'sine', ey: 'NORM_A' },
      run: 'G_TRANS',
    },{
      f: { type: 'transition', curve: 'sine', ey: 'ACUTE_H' },
      a: { type: 'transition', curve: 'sine', ey: 0 },
      run: 'C_TRANS',
    }],

    v2j: [{
      f: { type: 'transition', curve: 'sine', ey: 'lr(lf, L, H, SHARP_L, SHARP_H)' },
      a: { type: 'transition', curve: 'sine', ey: 0 },
      run: 'C_TRANS',
    }],
    n2j: [{
      f: { type: 'transition', curve: 'sine', ey: 'SHARP_L' },
      a: { type: 'transition', curve: 'sine', ey: 'NORM_A' },
      run: 'G_TRANS',
    },{
      f: { type: 'transition', curve: 'sine', ey: 'SHARP_H' },
      a: { type: 'transition', curve: 'sine', ey: 0 },
      run: 'C_TRANS',
    }],
    
    v2m: [{
      f: { type: 'transition', curve: 'sine', ey: 'lr(lf, L, H, GRAVE_L, GRAVE_H)' },
      a: { type: 'transition', curve: 'sine', ey: 0 },
      run: 'G_TRANS',
    }],
    n2m: [{
      f: { type: 'transition', curve: 'sine', ey: 'GRAVE_H' },
      a: { type: 'transition', curve: 'sine', ey: 'NORM_A' },
      run: 'G_TRANS',
    },{
      f: { type: 'transition', curve: 'sine', ey: 'GRAVE_L' },
      a: { type: 'transition', curve: 'sine', ey: 0 },
      run: 'G_TRANS',
    }],

    v2n: [{
      f: { type: 'transition', curve: 'sine', ey: 'lr(lf, L, H, ACUTE_L, ACUTE_H)' },
      a: { type: 'transition', curve: 'sine', ey: 0 },
      run: 'G_TRANS',
    }],
    n2n: [{
      f: { type: 'transition', curve: 'sine', ey: 'ACUTE_L' },
      a: { type: 'transition', curve: 'sine', ey: 'NORM_A' },
      run: 'G_TRANS',
    },{
      f: { type: 'transition', curve: 'sine', ey: 'ACUTE_H' },
      a: { type: 'transition', curve: 'sine', ey: 0 },
      run: 'G_TRANS',
    }],

    v2s: [{
      f: { type: 'transition', curve: 'sine', ey: 'lr(lf, L, H, SHARP_L, SHARP_H)' },
      a: { type: 'transition', curve: 'sine', ey: 0 },
      run: 'G_TRANS',
    }],
    n2s: [{
      f: { type: 'transition', curve: 'sine', ey: 'SHARP_L' },
      a: { type: 'transition', curve: 'sine', ey: 'NORM_A' },
      run: 'G_TRANS',
    },{
      f: { type: 'transition', curve: 'sine', ey: 'SHARP_H' },
      a: { type: 'transition', curve: 'sine', ey: 0 },
      run: 'G_TRANS',
    }],
  },
  graphemes: {
    /* VOWELS */
    i: {
      elsewhere: ['HV', 'LAX'],
      contexts: [{
        con: ['V', 'ANY'],
        pron: [{
          f: { type: "transition", curve: "sine", ey: 'H' },
          a: { type: "transition", curve: "sine", ey: 'NORM_A' },
          run: 10
        }, 'LAX'],
      }, {
        con: ['C', ''],
        pron: ['HV', 'LAX', 'S_SILENCE'],
      }],
    },
    I: {
      elsewhere: ['HV', 'STR'],
      contexts: [{
        con: ['V', 'ANY'],
        pron: [{
          f: { type: "transition", curve: "sine", ey: 'H' },
          a: { type: "transition", curve: "sine", ey: 'LOUD_A' },
          run: 10
        }, 'STR'],
      }, {
        con: ['C', ''],
        pron: ['HV', 'STR', 'S_SILENCE'],
      }],
    },
    a: {
      elsewhere: ['MV', 'LAX'],
      contexts: [{
        con: ['V', 'ANY'],
        pron: [{
          f: { type: "transition", curve: "sine", ey: 'M' },
          a: { type: "transition", curve: "sine", ey: 'NORM_A' },
          run: 10
        }, 'LAX'],
      }, {
        con: ['C', ''],
        pron: ['MV', 'LAX', 'S_SILENCE'],
      }],
    },
    A: {
      elsewhere: ['MV', 'STR'],
      contexts: [{
        con: ['V', 'ANY'],
        pron: [{
          f: { type: "transition", curve: "sine", ey: 'M' },
          a: { type: "transition", curve: "sine", ey: 'LOUD_A' },
          run: 10
        }, 'STR'],
      }, {
        con: ['C', ''],
        pron: ['MV', 'STR', 'S_SILENCE'],
      }],
    },
    o: {
      elsewhere: ['LV', 'LAX'],
      contexts: [{
        con: ['V', 'ANY'],
        pron: [{
          f: { type: "transition", curve: "sine", ey: 'L' },
          a: { type: "transition", curve: "sine", ey: 'NORM_A' },
          run: 10
        }, 'LAX'],
      }, {
        con: ['C', ''],
        pron: ['LV', 'LAX', 'S_SILENCE'],
      }],
    },
    O: {
      elsewhere: ['LV', 'STR'],
      contexts: [{
        con: ['V', 'ANY'],
        pron: [{
          f: { type: "transition", curve: "sine", ey: 'L' },
          a: { type: "transition", curve: "sine", ey: 'LOUD_A' },
          run: 10
        }, 'STR'],
      }, {
        con: ['C', ''],
        pron: ['LV', 'STR', 'S_SILENCE'],
      }],
    },

    /* CONSONANTS */
    p: { // Interrupted, Grave
      contexts: [
        { con: ['V', 'i'], pron: ['v2p', 'IA_SILENCE', 'L_A', 'IA2i'] },
        { con: ['V', 'I'], pron: ['v2p', 'IA_SILENCE', 'S_A', 'IA2i'] },
        { con: ['V', 'a'], pron: ['v2p', 'IA_SILENCE', 'L_A', 'IA2a'] },
        { con: ['V', 'A'], pron: ['v2p', 'IA_SILENCE', 'S_A', 'IA2a'] },
        { con: ['V', 'o'], pron: ['v2p', 'IA_SILENCE', 'L_A', 'IA2o'] },
        { con: ['V', 'O'], pron: ['v2p', 'IA_SILENCE', 'S_A', 'IA2o'] },
        { con: ['n', 'i'], pron: ['n2p', 'IA_SILENCE', 'L_A', 'IA2i'] },
        { con: ['n', 'I'], pron: ['n2p', 'IA_SILENCE', 'S_A', 'IA2i'] },
        { con: ['n', 'a'], pron: ['n2p', 'IA_SILENCE', 'L_A', 'IA2a'] },
        { con: ['n', 'A'], pron: ['n2p', 'IA_SILENCE', 'S_A', 'IA2a'] },
        { con: ['n', 'o'], pron: ['n2p', 'IA_SILENCE', 'L_A', 'IA2o'] },
        { con: ['n', 'O'], pron: ['n2p', 'IA_SILENCE', 'S_A', 'IA2o'] },
        { con: ['', 'i'], pron: ['L_A', 'GRAVE', 'IA2i'] },
        { con: ['', 'I'], pron: ['S_A', 'GRAVE', 'IA2i'] },
        { con: ['', 'a'], pron: ['L_A', 'GRAVE', 'IA2a'] },
        { con: ['', 'A'], pron: ['S_A', 'GRAVE', 'IA2a'] },
        { con: ['', 'o'], pron: ['L_A', 'GRAVE', 'IA2o'] },
        { con: ['', 'O'], pron: ['S_A', 'GRAVE', 'IA2o'] },
      ],
    },
    t: { // Interrupted, Acute
      contexts: [
        { con: ['V', 'i'], pron: ['v2t', 'IA_SILENCE', 'L_A', 'IA2i'] },
        { con: ['V', 'I'], pron: ['v2t', 'IA_SILENCE', 'S_A', 'IA2i'] },
        { con: ['V', 'a'], pron: ['v2t', 'IA_SILENCE', 'L_A', 'IA2a'] },
        { con: ['V', 'A'], pron: ['v2t', 'IA_SILENCE', 'S_A', 'IA2a'] },
        { con: ['V', 'o'], pron: ['v2t', 'IA_SILENCE', 'L_A', 'IA2o'] },
        { con: ['V', 'O'], pron: ['v2t', 'IA_SILENCE', 'S_A', 'IA2o'] },
        { con: ['n', 'i'], pron: ['n2t', 'IA_SILENCE', 'L_A', 'IA2i'] },
        { con: ['n', 'I'], pron: ['n2t', 'IA_SILENCE', 'S_A', 'IA2i'] },
        { con: ['n', 'a'], pron: ['n2t', 'IA_SILENCE', 'L_A', 'IA2a'] },
        { con: ['n', 'A'], pron: ['n2t', 'IA_SILENCE', 'S_A', 'IA2a'] },
        { con: ['n', 'o'], pron: ['n2t', 'IA_SILENCE', 'L_A', 'IA2o'] },
        { con: ['n', 'O'], pron: ['n2t', 'IA_SILENCE', 'S_A', 'IA2o'] },
        { con: ['', 'i'], pron: ['L_A', 'ACUTE', 'IA2i'] },
        { con: ['', 'I'], pron: ['S_A', 'ACUTE', 'IA2i'] },
        { con: ['', 'a'], pron: ['L_A', 'ACUTE', 'IA2a'] },
        { con: ['', 'A'], pron: ['S_A', 'ACUTE', 'IA2a'] },
        { con: ['', 'o'], pron: ['L_A', 'ACUTE', 'IA2o'] },
        { con: ['', 'O'], pron: ['S_A', 'ACUTE', 'IA2o'] },
      ],
    },
    k: { // Interrupted, Sharp
      contexts: [
        { con: ['V', 'i'], pron: ['v2k', 'IS_SILENCE', 'L_A', 'IS2i'] },
        { con: ['V', 'I'], pron: ['v2k', 'IS_SILENCE', 'S_A', 'IS2i'] },
        { con: ['V', 'a'], pron: ['v2k', 'IS_SILENCE', 'L_A', 'IS2a'] },
        { con: ['V', 'A'], pron: ['v2k', 'IS_SILENCE', 'S_A', 'IS2a'] },
        { con: ['V', 'o'], pron: ['v2k', 'IS_SILENCE', 'L_A', 'IS2o'] },
        { con: ['V', 'O'], pron: ['v2k', 'IS_SILENCE', 'S_A', 'IS2o'] },
        { con: ['n', 'i'], pron: ['n2k', 'IS_SILENCE', 'L_A', 'IS2i'] },
        { con: ['n', 'I'], pron: ['n2k', 'IS_SILENCE', 'S_A', 'IS2i'] },
        { con: ['n', 'a'], pron: ['n2k', 'IS_SILENCE', 'L_A', 'IS2a'] },
        { con: ['n', 'A'], pron: ['n2k', 'IS_SILENCE', 'S_A', 'IS2a'] },
        { con: ['n', 'o'], pron: ['n2k', 'IS_SILENCE', 'L_A', 'IS2o'] },
        { con: ['n', 'O'], pron: ['n2k', 'IS_SILENCE', 'S_A', 'IS2o'] },
        { con: ['', 'i'], pron: ['L_A', 'SHARP', 'IS2i'] },
        { con: ['', 'I'], pron: ['S_A', 'SHARP', 'IS2i'] },
        { con: ['', 'a'], pron: ['L_A', 'SHARP', 'IS2a'] },
        { con: ['', 'A'], pron: ['S_A', 'SHARP', 'IS2a'] },
        { con: ['', 'o'], pron: ['L_A', 'SHARP', 'IS2o'] },
        { con: ['', 'O'], pron: ['S_A', 'SHARP', 'IS2o'] },
      ],
    },
    w: { // Continuous, Grave
      contexts: [
        { con: ['V', 'i'], pron: ['v2w', 'C_SILENCE', 'L_A', 'C2i'] },
        { con: ['V', 'I'], pron: ['v2w', 'C_SILENCE', 'S_A', 'C2i'] },
        { con: ['V', 'a'], pron: ['v2w', 'C_SILENCE', 'L_A', 'C2a'] },
        { con: ['V', 'A'], pron: ['v2w', 'C_SILENCE', 'S_A', 'C2a'] },
        { con: ['V', 'o'], pron: ['v2w', 'C_SILENCE', 'L_A', 'C2o'] },
        { con: ['V', 'O'], pron: ['v2w', 'C_SILENCE', 'S_A', 'C2o'] },
        { con: ['n', 'i'], pron: ['n2w', 'C_SILENCE', 'L_A', 'C2i'] },
        { con: ['n', 'I'], pron: ['n2w', 'C_SILENCE', 'S_A', 'C2i'] },
        { con: ['n', 'a'], pron: ['n2w', 'C_SILENCE', 'L_A', 'C2a'] },
        { con: ['n', 'A'], pron: ['n2w', 'C_SILENCE', 'S_A', 'C2a'] },
        { con: ['n', 'o'], pron: ['n2w', 'C_SILENCE', 'L_A', 'C2o'] },
        { con: ['n', 'O'], pron: ['n2w', 'C_SILENCE', 'S_A', 'C2o'] },
        { con: ['', 'i'], pron: ['GRAVE', 'C_ONSET', 'L_A', 'C2i'] },
        { con: ['', 'I'], pron: ['GRAVE', 'C_ONSET', 'S_A', 'C2i'] },
        { con: ['', 'a'], pron: ['GRAVE', 'C_ONSET', 'L_A', 'C2a'] },
        { con: ['', 'A'], pron: ['GRAVE', 'C_ONSET', 'S_A', 'C2a'] },
        { con: ['', 'o'], pron: ['GRAVE', 'C_ONSET', 'L_A', 'C2o'] },
        { con: ['', 'O'], pron: ['GRAVE', 'C_ONSET', 'S_A', 'C2o'] },
      ],
    },
    l: { // Continuous, Acute
      contexts: [
        { con: ['V', 'i'], pron: ['v2l', 'C_SILENCE', 'L_A', 'C2i'] },
        { con: ['V', 'I'], pron: ['v2l', 'C_SILENCE', 'S_A', 'C2i'] },
        { con: ['V', 'a'], pron: ['v2l', 'C_SILENCE', 'L_A', 'C2a'] },
        { con: ['V', 'A'], pron: ['v2l', 'C_SILENCE', 'S_A', 'C2a'] },
        { con: ['V', 'o'], pron: ['v2l', 'C_SILENCE', 'L_A', 'C2o'] },
        { con: ['V', 'O'], pron: ['v2l', 'C_SILENCE', 'S_A', 'C2o'] },
        { con: ['n', 'i'], pron: ['n2l', 'C_SILENCE', 'L_A', 'C2i'] },
        { con: ['n', 'I'], pron: ['n2l', 'C_SILENCE', 'S_A', 'C2i'] },
        { con: ['n', 'a'], pron: ['n2l', 'C_SILENCE', 'L_A', 'C2a'] },
        { con: ['n', 'A'], pron: ['n2l', 'C_SILENCE', 'S_A', 'C2a'] },
        { con: ['n', 'o'], pron: ['n2l', 'C_SILENCE', 'L_A', 'C2o'] },
        { con: ['n', 'O'], pron: ['n2l', 'C_SILENCE', 'S_A', 'C2o'] },
        { con: ['', 'i'], pron: ['ACUTE', 'C_ONSET', 'L_A', 'C2i'] },
        { con: ['', 'I'], pron: ['ACUTE', 'C_ONSET', 'S_A', 'C2i'] },
        { con: ['', 'a'], pron: ['ACUTE', 'C_ONSET', 'L_A', 'C2a'] },
        { con: ['', 'A'], pron: ['ACUTE', 'C_ONSET', 'S_A', 'C2a'] },
        { con: ['', 'o'], pron: ['ACUTE', 'C_ONSET', 'L_A', 'C2o'] },
        { con: ['', 'O'], pron: ['ACUTE', 'C_ONSET', 'S_A', 'C2o'] },
      ],
    },
    j: { // Continuous, Sharp
      contexts: [
        { con: ['V', 'i'], pron: ['v2j', 'C_SILENCE', 'L_A', 'C2i'] },
        { con: ['V', 'I'], pron: ['v2j', 'C_SILENCE', 'S_A', 'C2i'] },
        { con: ['V', 'a'], pron: ['v2j', 'C_SILENCE', 'L_A', 'C2a'] },
        { con: ['V', 'A'], pron: ['v2j', 'C_SILENCE', 'S_A', 'C2a'] },
        { con: ['V', 'o'], pron: ['v2j', 'C_SILENCE', 'L_A', 'C2o'] },
        { con: ['V', 'O'], pron: ['v2j', 'C_SILENCE', 'S_A', 'C2o'] },
        { con: ['n', 'i'], pron: ['n2j', 'C_SILENCE', 'L_A', 'C2i'] },
        { con: ['n', 'I'], pron: ['n2j', 'C_SILENCE', 'S_A', 'C2i'] },
        { con: ['n', 'a'], pron: ['n2j', 'C_SILENCE', 'L_A', 'C2a'] },
        { con: ['n', 'A'], pron: ['n2j', 'C_SILENCE', 'S_A', 'C2a'] },
        { con: ['n', 'o'], pron: ['n2j', 'C_SILENCE', 'L_A', 'C2o'] },
        { con: ['n', 'O'], pron: ['n2j', 'C_SILENCE', 'S_A', 'C2o'] },
        { con: ['', 'i'], pron: ['SHARP', 'C_ONSET', 'L_A', 'C2i'] },
        { con: ['', 'I'], pron: ['SHARP', 'C_ONSET', 'S_A', 'C2i'] },
        { con: ['', 'a'], pron: ['SHARP', 'C_ONSET', 'L_A', 'C2a'] },
        { con: ['', 'A'], pron: ['SHARP', 'C_ONSET', 'S_A', 'C2a'] },
        { con: ['', 'o'], pron: ['SHARP', 'C_ONSET', 'L_A', 'C2o'] },
        { con: ['', 'O'], pron: ['SHARP', 'C_ONSET', 'S_A', 'C2o'] },
      ],
    },
    m: { // Gradual, Grave
      contexts: [
        { con: ['V', 'i'], pron: ['v2m', 'G_SILENCE', 'L_A', 'G2i'] },
        { con: ['V', 'I'], pron: ['v2m', 'G_SILENCE', 'S_A', 'G2i'] },
        { con: ['V', 'a'], pron: ['v2m', 'G_SILENCE', 'L_A', 'G2a'] },
        { con: ['V', 'A'], pron: ['v2m', 'G_SILENCE', 'S_A', 'G2a'] },
        { con: ['V', 'o'], pron: ['v2m', 'G_SILENCE', 'L_A', 'G2o'] },
        { con: ['V', 'O'], pron: ['v2m', 'G_SILENCE', 'S_A', 'G2o'] },
        { con: ['n', 'i'], pron: ['n2m', 'G_SILENCE', 'L_A', 'G2i'] },
        { con: ['n', 'I'], pron: ['n2m', 'G_SILENCE', 'S_A', 'G2i'] },
        { con: ['n', 'a'], pron: ['n2m', 'G_SILENCE', 'L_A', 'G2a'] },
        { con: ['n', 'A'], pron: ['n2m', 'G_SILENCE', 'S_A', 'G2a'] },
        { con: ['n', 'o'], pron: ['n2m', 'G_SILENCE', 'L_A', 'G2o'] },
        { con: ['n', 'O'], pron: ['n2m', 'G_SILENCE', 'S_A', 'G2o'] },
        { con: ['', 'i'], pron: ['L_A', 'GRAVE', 'G2i'] },
        { con: ['', 'I'], pron: ['S_A', 'GRAVE', 'G2i'] },
        { con: ['', 'a'], pron: ['L_A', 'GRAVE', 'G2a'] },
        { con: ['', 'A'], pron: ['S_A', 'GRAVE', 'G2a'] },
        { con: ['', 'o'], pron: ['L_A', 'GRAVE', 'G2o'] },
        { con: ['', 'O'], pron: ['S_A', 'GRAVE', 'G2o'] },
      ],
    },
    n: { // Gradual, Acute
      contexts: [
        { con: ['V', 'i'], pron: ['v2n', 'G_SILENCE', 'L_A', 'G2i'] },
        { con: ['V', 'I'], pron: ['v2n', 'G_SILENCE', 'S_A', 'G2i'] },
        { con: ['V', 'a'], pron: ['v2n', 'G_SILENCE', 'L_A', 'G2a'] },
        { con: ['V', 'A'], pron: ['v2n', 'G_SILENCE', 'S_A', 'G2a'] },
        { con: ['V', 'o'], pron: ['v2n', 'G_SILENCE', 'L_A', 'G2o'] },
        { con: ['V', 'O'], pron: ['v2n', 'G_SILENCE', 'S_A', 'G2o'] },
        { con: ['n', 'i'], pron: ['n2n', 'G_SILENCE', 'L_A', 'C2i'] },
        { con: ['n', 'I'], pron: ['n2n', 'G_SILENCE', 'S_A', 'C2i'] },
        { con: ['n', 'a'], pron: ['n2n', 'G_SILENCE', 'L_A', 'C2a'] },
        { con: ['n', 'A'], pron: ['n2n', 'G_SILENCE', 'S_A', 'C2a'] },
        { con: ['n', 'o'], pron: ['n2n', 'G_SILENCE', 'L_A', 'C2o'] },
        { con: ['n', 'O'], pron: ['n2n', 'G_SILENCE', 'S_A', 'C2o'] },
        { con: ['', 'i'], pron: ['L_A', 'ACUTE', 'G2i'] },
        { con: ['', 'I'], pron: ['S_A', 'ACUTE', 'G2i'] },
        { con: ['', 'a'], pron: ['L_A', 'ACUTE', 'G2a'] },
        { con: ['', 'A'], pron: ['S_A', 'ACUTE', 'G2a'] },
        { con: ['', 'o'], pron: ['L_A', 'ACUTE', 'G2o'] },
        { con: ['', 'O'], pron: ['S_A', 'ACUTE', 'G2o'] },
        { con: ['', 'O'], pron: ['S_A', 'ACUTE', 'G2o'] },
        { con: ['V', 'MP'], pron: ['v2m', 'G_SILENCE', 'L_A'] },
        { con: ['V', 'CN'], pron: ['v2n', 'G_SILENCE', 'L_A'] },
        { con: ['V', ''], pron: ['v2n', 'S_SILENCE'] },
      ],
    },
    s: { // Gradual, Sharp
      contexts: [
        { con: ['V', 'i'], pron: ['v2s', 'G_SILENCE', 'L_A', 'G2i'] },
        { con: ['V', 'I'], pron: ['v2s', 'G_SILENCE', 'S_A', 'G2i'] },
        { con: ['V', 'a'], pron: ['v2s', 'G_SILENCE', 'L_A', 'G2a'] },
        { con: ['V', 'A'], pron: ['v2s', 'G_SILENCE', 'S_A', 'G2a'] },
        { con: ['V', 'o'], pron: ['v2s', 'G_SILENCE', 'L_A', 'G2o'] },
        { con: ['V', 'O'], pron: ['v2s', 'G_SILENCE', 'S_A', 'G2o'] },
        { con: ['n', 'i'], pron: ['n2s', 'G_SILENCE', 'L_A', 'G2i'] },
        { con: ['n', 'I'], pron: ['n2s', 'G_SILENCE', 'S_A', 'G2i'] },
        { con: ['n', 'a'], pron: ['n2s', 'G_SILENCE', 'L_A', 'G2a'] },
        { con: ['n', 'A'], pron: ['n2s', 'G_SILENCE', 'S_A', 'G2a'] },
        { con: ['n', 'o'], pron: ['n2s', 'G_SILENCE', 'L_A', 'G2o'] },
        { con: ['n', 'O'], pron: ['n2s', 'G_SILENCE', 'S_A', 'G2o'] },
        { con: ['', 'i'], pron: ['L_A', 'SHARP', 'G2i'] },
        { con: ['', 'I'], pron: ['S_A', 'SHARP', 'G2i'] },
        { con: ['', 'a'], pron: ['L_A', 'SHARP', 'G2a'] },
        { con: ['', 'A'], pron: ['S_A', 'SHARP', 'G2a'] },
        { con: ['', 'o'], pron: ['L_A', 'SHARP', 'G2o'] },
        { con: ['', 'O'], pron: ['S_A', 'SHARP', 'G2o'] },
      ],
    },
  },
};

export const WasoModel = new TextModel(amodel);