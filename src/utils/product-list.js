const defaultOptions = {
    season: 'демисезон',
    typeOfClasp: 'шнуровка',
    upperComposition: '100%&nbsp;кожа',
    liningComposition: '100%&nbsp;хлопок',
    soleComposition: 'Vibram (ЭВА)',
    soleHeight: '2.5&thinsp;см',
    fullnessOfShoes: 'F&thinsp;(6)',
    madeIn: 'Россия',
}

export const productOptMap = {
    RL24: {
        ...defaultOptions,
        name: 'Рояль',
        altName: 'royal',
        sku: 'RL24',
        color: 'черный / белый',
        soleComposition: 'ЭВА',
    },
    EM24: {
        ...defaultOptions,
        name: 'ИМПЕРИУМ',
        altName: 'empire',
        sku: 'EM24',
        color: 'черный / желтый',
    },
};

export const colorMap = {
    'dark side': 'дарк сайд',
    'light side': 'лайт сайд',
    white: 'тотал вайт',
    black: 'тотал блэк',
    gold: 'аурум',
    classic: 'классик',
    black: 'тотал блэк',
    choco: 'шоко',
    rif: 'риф',
};