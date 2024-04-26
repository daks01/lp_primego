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
  const sheet = getOrCreateSheet("Наличие");
  const data = sheet.getDataRange().getValues();
  return convertToGroup(data);
}

function convertToGroup(data) {
  const headers = data[0]
  const rawData = data.slice(1,)
  let currentGroup;
  let result = {}

  rawData.forEach(currentRow => {
    const group = currentRow[0]
    const object = {}

    if(group) {
      currentGroup = group
      result[currentGroup] = []
    } 

    for (let i = 1; i < headers.length; i++) {
      object[headers[i]] = currentRow[i]
    }
    result[currentGroup].push(object)
  });

  return result;
}

function addNewQuestion(postData) {
  const SHEET_NAME = "Обратная связь";
  const sheet = getOrCreateSheet(SHEET_NAME);
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
  const sheet = getOrCreateSheet(SHEET_NAME);
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
  const emailsSheet = getOrCreateSheet('Оповещения');
  const result = emailsSheet.getDataRange().getValues().flat(1).toString();
  return result;
}

function logEmailQuota() {
  const emailQuotaRemaining = MailApp.getRemainingDailyQuota();
  logger.log("Доступно оповещений по почте на сегодня: " + emailQuotaRemaining);
}

function getOrCreateSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name) 
         || SpreadsheetApp.getActiveSpreadsheet().insertSheet(name);
}
const logger = {
  log:(val)=>{
    const logsSheet = getOrCreateSheet('Logs');

    logsSheet.appendRow([new Date(), `${JSON.stringify(val)}`]);
  }
};
