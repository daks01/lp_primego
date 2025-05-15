// https://seoneurons.com/create-contact-us-page/#33-setting-up-a-trigger

function doPost(e) {
  // logger.log(e);

  const lock = LockService.getScriptLock();
  lock.tryLock(3000);

  try {
    const postData = JSON.parse(e?.postData?.contents);

    // ОБРАБОТКА ФОРМЫ ОБРАТНОЙ СВЯЗИ
    if (e.queryString === 'type=contact') {
      addNewQuestion(postData);
    }

    // ОБРАБОТКА НОВОЙ ЗАЯВКИ
    if (e.queryString === 'type=buy') {
      addNewOrder(postData);
    }

    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    const isEmailOverQuotaWarnings = JSON.stringify(error.message).includes('Служба была вызвана слишком много раз за день: email');
    const result = {
      'result': isEmailOverQuotaWarnings ? 'success' : 'error', 
      'error': JSON.stringify(error.message)
    }
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  // ПОЛУЧЕНИЕ ТАБЛИЦЫ НАЛИЧИЯ ТОВАРОВ
  if (e.queryString === 'type=availability') {
    const data = getProductsAvailability();

    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON)
  }
  // ПОЛУЧЕНИЕ КУРСА ВАЛЮТ
  if (e.queryString === 'type=currency') {
    const data = getCurrency();

    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON)
  }
  return ContentService
      .createTextOutput(JSON.stringify({result: 'success'}))
      .setMimeType(ContentService.MimeType.JSON)
}

function getProductsAvailability() {
  const thead = ['Артикул',	'Название',	'Тип',	'Утеплитель', 'Цвета', 'Цена',	'Размер', 'Резерв', 'Длина',	'Ширина',	'dark side', 'light side',	'white',	'black',	'gold',	'classic',	'choco',	'fif'];
  const sheet = getOrCreateSheet("Наличие", thead);
  const data = sheet.getDataRange().getValues();
  //Logger.log(convertProductsToGroup(data));

  return convertProductsToGroup(data);
}

function convertProductsToGroup(data) {
  const headers = data[0];    // ['Артикул',	'Название',	'Тип',	'Утеплитель', 'Цвета', 'Цена',	'Размер', 'Резерв', 'Длина',	'Ширина',	'dark side', 'light side',	'white',	'black',	'gold',	'classic',	'choco',	'fif']
  const rawData = data.slice(1,);
  let groupName;
  let group = {};
  let result = {};

  rawData.forEach((currentRow) => {
    const isNewGroup = currentRow[0];
    const sku = currentRow[0] || group['sku'];
    const name = currentRow[1] || group['name'];
    const type = currentRow[2] || group['type'];
    const insulation = currentRow[3] || group['insulation'];
    const colors = currentRow[4] || group['colors'];
    const price = currentRow[5] || group['price'];
    const size = currentRow[6];
    const length = currentRow[7];
    const width = currentRow[8];
    const reserved = currentRow[9];
    const availableColor1 = currentRow[10];
    const availableColor2 = currentRow[11];
    const availableColor3 = currentRow[12];
    const availableColor4 = currentRow[13];
    const availableColor5 = currentRow[14];
    const availableColor6 = currentRow[15];
    const availableColor7 = currentRow[16];
    const availableColor8 = currentRow[17];
    
    if(isNewGroup) {
      groupName = sku;
      group = {};
    }
    

    /* тут формируется json для API
      EM24:{
        sku: string,
        name: string,
        type: string,
        insulation: array,
        colors: array,
        price: number,
        size колодки: {
          44: {
            availability: {
              gold: number,
              black: number,
            },
            reserve: array,
            length: number,
            width: number,
          }
        },
      }
    */
    group = {
      ...sku && {'sku' : sku},
      ...name && {'name' : name},
      ...type && {'type' : type},
      ...insulation && {'insulation' : insulation.toString().split(',').map(s => s.trim())},
      ...colors && {'colors' : colors.toString().split(',').map(s => s.trim())},
      ...price && {'price' : price},
      ...{
        'size' : {
          ...{
            [size] : {
              available: {
                ...availableColor1 && { [headers[10]]: availableColor1 },
                ...availableColor2 && { [headers[11]]: availableColor2 },
                ...availableColor3 && { [headers[12]]: availableColor3 },
                ...availableColor4 && { [headers[13]]: availableColor4 },
                ...availableColor5 && { [headers[14]]: availableColor5 },
                ...availableColor6 && { [headers[15]]: availableColor6 },
                ...availableColor7 && { [headers[16]]: availableColor7 },
                ...availableColor8 && { [headers[17]]: availableColor8 },
              },
              ...reserved && {
                'reserved' : reserved.toString().split(',').map(s => s.trim()),
              },
              length,
              width,
              size,
            }
          },
          ...group['size'],
        },
      },
    };

    result[groupName] = group;
  });

  return result;
}

function getCurrency(){
  const url = 'http://www.cbr.ru/scripts/XML_daily.asp';
  const responseXml = UrlFetchApp.fetch(url).getContentText();
  const document = XmlService.parse(responseXml);
  const root = document.getRootElement();
  const result = {};

  root.getChildren('Valute').forEach((child) =>{
    const key = child.getChild('CharCode').getText();
    const value = child.getChild('Value').getText();

    result[key] = value;
  });
 
  return result;
}

function addNewQuestion(postData) {
  const SHEET_NAME = "Обратная связь";
  const thead = ['статус','дата','имя','email','текст', 'откуда'];
  const sheet = getOrCreateSheet(SHEET_NAME, thead);
  const {name, email, message} = postData;

  // Store data in Google Sheet
  sheet.appendRow(['новая', getTimestamp(), ...Object.values(postData)]);

  // Send email
  MailApp.sendEmail({
    to: getAdminEmail(), 
    cc: getEmailsCC(),
    name: 'Сайт Primego',
    noReply: true,
    subject: `[Primego][Help]. ${name} просит помочь с заказом`,
    htmlBody: `
      <b>${name}</b> [<a href="mailto:${email}">${email}</a>] пишет:<br>
      <b>${message}</b> <br>
      <hr/>
      Посмотреть в <a href="${getSheetUrl(SHEET_NAME)}">GoogleDocs</a> <br>
    `,
  });

  logEmailQuota();
}

function addNewOrder(postData) {
  const SHEET_NAME = "Заказы";
  const thead = ['статус', 'дата', 'имя', 'фамилия', 'email', 'телефон', 'адрес', 'доставка', 'итого', 'заказ'];
  const sheet = getOrCreateSheet(SHEET_NAME, thead);
  const itemsPropMap = {
      name: 'Название',
      sku: 'Модель',
      type: 'Коллекция',
      fur_tongue: 'Меховой язык',
      fur_edge: 'Меховой кант',
      color: 'Цвет',
      size: 'Размер',
      price: 'Цена',
  };
  const {name, surname, email, phone, address, items, totalPrice, usd} = postData;
  const { items: i, usd: u, ...cleanedPostData } = postData;
  const dataArrWithoutItems = Object.values(cleanedPostData);
  const getArrWithItems = () => {
    const result = [];
    for (var key in items) {
      const item = items[key];
      const stringWithItemProps = Object.keys(item).map((property) => {
        // ignore property
        if (property === 'id' || property === 'img') { 
          return;
        }
        return [itemsPropMap[property] || property, item[property]].join(': ');
      }).join('\n')

      result.push(stringWithItemProps);
    }
    if (usd !== "") {
      result.push(`Курс доллара: ${usd}`);
    }
    return result;
  };
  
  // Store buyer data in Google Sheet
  sheet.appendRow(['новая', getTimestamp(), ...dataArrWithoutItems, ...getArrWithItems()]);

  // Send email
  MailApp.sendEmail({
    to: getAdminEmail(), 
    cc: getEmailsCC(),
    name: 'Сайт Primego',
    noReply: true,
    subject: `[Primego][Buy]. ${name} ${surname} оформил заказ`,
    htmlBody: `
      <b>Покупатель</b>: ${name} ${surname} [<a href="mailto:${email}">${email}</a>]<br>
      <b>Телефон</b>: <a href="tel:${phone}">${phone}</a><br>
      <b>Адрес доставки</b>: ${address}</a><br>
      <b>Товаров</b>: ${Object.keys(items).length} <br>
      <b>Итого</b>: ${totalPrice} <br>
      <hr/>
      Посмотреть подробности заказа в <a href="${getSheetUrl(SHEET_NAME)}">GoogleDocs</a> <br>
    `,
  });

  logEmailQuota();
}

function getSheetUrl(postData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  return sheet.getUrl()+ '#gid=' + sheet.getSheetByName(postData).getSheetId();
}

function getTimestamp() {
  return Utilities.formatDate(new Date(), "GMT+03", "yyyy-MM-dd HH:mm");
}

function getAdminEmail() {
  const emailsSheet = getOrCreateSheet('Оповещения', ['почты']);
  const result = emailsSheet.getDataRange().getValues().at(1).flat(1).toString();
  return result;
}

function getEmailsCC() {
  const emailsSheet = getOrCreateSheet('Оповещения', ['почты']);
  const result = emailsSheet.getDataRange().getValues().slice(2,).flat(1).toString();
  return result;
}

function logEmailQuota() {
  const emailQuotaRemaining = MailApp.getRemainingDailyQuota();
  logger.log("Доступно оповещений по почте на сегодня: " + emailQuotaRemaining);
}

function getOrCreateSheet(name, titlesArr) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name) 
              || SpreadsheetApp.getActiveSpreadsheet().insertSheet(name);

  if (isSheetEmpty(sheet)) {
    sheet.appendRow(titlesArr);
  }

  return sheet;
}
const logger = {
  log:(val)=>{
    const logsSheet = getOrCreateSheet('Logs', ['date', 'console.log()']);

    logsSheet.appendRow([new Date(), `${JSON.stringify(val)}`]);
  }
};

function isSheetEmpty(sheet) {
  return sheet.getDataRange().getValues().join("") === "";
}