export default {
    coolTranslation: 'Cool translation!',
    onlyInEnglish: 'This translation exists only for locale en-US',
    nested: {
        deep: {
            deeper: {
                car: 'Car',
                blueCar: 'Blue @:nested.deep.deeper.blueCar',
                redCarQuotedYes: 'Red „@nested.deep.deeper.car“, yes'
            },
            translateThis: 'Translate this, since it not only has {0}, but also {1}!',
            namedInterp: '{coolParam}, this is an example. {otherParam123}',
            namedInterpMultiple: 'At {userName}: Welcome, "{userName}"! Here are a few things we will be practising {2} and {2}, until you get the hang of them. ;)',
            listInterp: 'Just testing list interpolation, it begins with {0}. The parameters are {0}, {1} and {2}.'
        }
    }
};
