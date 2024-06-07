// https://seoneurons.com/create-contact-us-page/#33-setting-up-a-trigger
const MAILTO = 'email@domain.com';

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
  return ContentService
      .createTextOutput(JSON.stringify({result: 'success'}))
      .setMimeType(ContentService.MimeType.JSON)
}

function getProductsAvailability() {
  const thead = ['Артикул',	'Название',	'Тип', 'Цвет',	'Цена',	'Наличие',	'Резерв',	'Размер колодки',	'Длина',	'Ширина',	'Размер на ярлычке',	'Новый размер'];
  const sheet = getOrCreateSheet("Наличие", thead);
  const data = sheet.getDataRange().getValues();
  Logger.log(convertProductsToGroup(data));

  return convertProductsToGroup(data);
}

function convertProductsToGroup(data) {
  const headers = data[0];    // ['Артикул',	'Название',	'Тип', 'Цвет',	'Цена',	'Наличие',	'Резерв',	'Размер колодки',	'Длина',	'Ширина',	'Размер на ярлычке',	'Новый размер']
  const rawData = data.slice(1,);
  let groupName;
  let group = {};
  let result = {};


  /* return
    EM24:{
      sku: string,
      name: string,
      type: string,
      color: array
      price: number,
      size колодки: {
        44: {
          availability: number,
          reserve: number,
          length: number,
          width: number,
          tagSize: number,
          newSize: number,
        }
      },
    }
  */
  rawData.forEach((currentRow) => {
    const isNewGroup = currentRow[0];
    const sku = currentRow[0] || group['sku'];
    const name = currentRow[1] || group['name'];
    const type = currentRow[2] || group['type'];
    const color = currentRow[3] || group['color'];
    const price = currentRow[4] || group['price'];
    const availability = currentRow[5];
    const reserve = currentRow[6];
    const size = currentRow[7];
    const length = currentRow[8];
    const width = currentRow[9];
    const tagSize = currentRow[10];
    const newSize = currentRow[11];
    
    if(isNewGroup) {
      groupName = sku;
      group = {};
    }
    
    group = {
      ...sku && {'sku' : sku},
      ...name && {'name' : name},
      ...type && {'type' : type},
      ...color && {'color' : color.toString().split(',').map(s => s.trim())},
      ...price && {'price' : price},
      ...{
        'size' : {
          ...{
            [size] : {
              availability,
              reserve,
              length,
              width,
              size,
              tagSize,
              newSize,
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

function addNewQuestion(postData) {
  const SHEET_NAME = "Обратная связь";
  const thead = ['статус','дата','имя','email','текст', 'откуда'];
  const sheet = getOrCreateSheet(SHEET_NAME, thead);
  const {name, email, message} = postData;

  // Store data in Google Sheet
  sheet.appendRow(['новая', getTimestamp(), ...Object.values(postData)]);

  // Send email
  MailApp.sendEmail({
    to: MAILTO, 
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
  const thead = ['статус','дата','имя','email','телефон','адрес','итого','заказ'];
  const sheet = getOrCreateSheet(SHEET_NAME, thead);
  const itemsPropMap = {
      name: 'Название',
      sku: 'Модель',
      type: 'Коллекция',
      fur_tongue: 'Меховой язык',
      fur_edge: 'Меховой кант',
      lace: 'Шнурок',
      color: 'Цвет',
      size: 'Размер',
      price: 'Цена',
  };
  const {name, email, phone, address, items, totalPrice} = postData;
  const { items: _, ...postDataWithoutItems } = postData;
  const dataArrWithoutItems = Object.values(postDataWithoutItems);
  const getArrWithItems = () => {
    const result = [];
    for (var key in items) {
      const item = items[key];
      const stringWithItemProps = Object.keys(item).map((property) => {
        if (property === 'id' || property === 'img') { return }
        return [itemsPropMap[property] || property, item[property]].join(': ');
      }).join('\n')

      result.push(stringWithItemProps);
    }
    return result;
  };
  
  // Store buyer data in Google Sheet
  sheet.appendRow(['новая', getTimestamp(), ...dataArrWithoutItems, ...getArrWithItems()]);

  // Send email
  MailApp.sendEmail({
    to: MAILTO, 
    cc: getEmailsCC(),
    name: 'Сайт Primego',
    noReply: true,
    subject: `[Primego][Buy]. ${name} оформил заказ`,
    htmlBody: `
      <b>Покупатель</b>: ${name} [<a href="mailto:${email}">${email}</a>]<br>
      <b>Телфон</b>: <a href="tel:${phone}">${phone}</a><br>
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
  return Utilities.formatDate(new Date(), "IST", "yyyy-MM-dd HH:mm");
}

function getEmailsCC() {
  const emailsSheet = getOrCreateSheet('Оповещения', ['почты']);
  const result = emailsSheet.getDataRange().getValues().slice(1,).flat(1).toString();
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