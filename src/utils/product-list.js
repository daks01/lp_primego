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
        images: {
            'dark side': import('/src/assets/img/shop/RL24/darkside/01.jpg'),
            'light side': import('/src/assets/img/shop/RL24/lightside/01.jpg'),
            white: import('/src/assets/img/shop/RL24/white/01.jpg'),
            black: import('/src/assets/img/shop/RL24/black/01.jpg'),
        },
    },
    EM24: {
        ...defaultOptions,
        name: 'ИМПЕРИУМ',
        altName: 'empire',
        sku: 'EM24',
        color: 'черный / желтый',
        images: {
            black: import('/src/assets/img/shop/EM24/black/01.jpg'),
            classic: import('/src/assets/img/shop/EM24/classic/01.jpg'),
            choco: import('/src/assets/img/shop/EM24/choco/01.jpg'),
            rif: import('/src/assets/img/shop/EM24/rif/01.jpg'),
        },
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