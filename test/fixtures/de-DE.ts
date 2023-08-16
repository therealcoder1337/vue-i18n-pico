export default {
    coolTranslation: 'Tolle Übersetzung!',
    nested: {
        deep: {
            deeper: {
                car: 'Auto',
                blueCar: 'Blaues @:nested.deep.deeper.blueCar',
                redCarQuotedYes: 'Rotes „@nested.deep.deeper.car“, ja'
            },
            translateThis: 'Übersetze dies, denn es hat nicht nur {0}, sondern auch {1}!',
            namedInterp: '{coolParam}, das ist ein Beispiel. {otherParam123}',
            namedInterpMultiple: 'An {userName}: Herzlich willkommen, „{userName}“! Hier sind noch einige Dinge, die wir {2} und {2} durchexerzieren werden, bis du sie verinnerlicht hast. ;)',
            listInterp: 'Teste nur die List interpolation, sie beginnt mit {0}. Die Parameter lauten {0}, {1} und {2}.'
        }
    },
    other: {
        test: 'test!'
    }
};
