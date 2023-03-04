# Web-based-Technical-Ear-Training

This technical ear training develops the ability of audio engineers to distinguish between changes in loudness and changes in frequency during stimuli.

This training application if for the member of [AIRIS lab](https://airislab.wordpress.com/) and students who register [GCT535 Sound Technology for Multimedia](https://airislab.wordpress.com/class/gsct-classes/gct535-multimedia-sound-technologies/).

## How to use

1. Go to https://rainekie.github.io/Web-based-Technical-Ear-Training/index.html
1. Select condition: 
    - Gain Change : the volume of one of the stimuli will be decreased in either [0dB, -2dB, -4dB, -6dB, -10dB, -20dB].
    - EQ -12dB Change : One of the stimuli wil be modulated using  a [biquadFilter](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode). The frequency to be modulated is one of [125, 250, 500, 1000, 2000, 4000, 8000]Hz, boosted by 12 dB with a Q value of 2.
    - EQ -6dB Change : Almost the same condition as above, however, the boost gain will be 6dB.
1. Click Start button
1. Listen carefully and choose A or B on the bottom radio button.
1. Then click submit, and you can see the answer.

## Program stracture

All program controll and sound modulation are implemented by [HTML 5's web audio api](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).


## Music stimul

All music sources are from [the 'Mixing Secrets' Free Multitrack Download Library](https://cambridge-mt.com/ms/mtk/). These music data are free of charge for educational purposes only. For more detail, please check [this FAQs](https://cambridge-mt.com/ms/mtk-faq/).

### List of music stimuli
- [Classic music] 3D-MARCo Project - 'String Quartet' (by Dr Hyunkook Lee at the University of Huddersfield)
- [Jazz] Maurizio Pagnutti Sextet - 'All The Gin Is Gone'
- [Rock] The Brew - 'What I Want'
- [EDM] Ben Flowers - 'Ecstasy'
- [R&B] Jessica Childress - 'Slow Down'