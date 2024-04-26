временный бекенд сделан на гуглотаблицах (Google AppScript)

для поднятия бэка:
- создать новую гуглотаблицу
- открыть Расширения -> AppScript
- скопировать\вставить код из файйла `/backend/googleAppScriptBackend.gs`
- в первой строке указать дефолтную почту для оповещений
- добавить Trigger по [инструкции](https://seoneurons.com/create-contact-us-page/#33-setting-up-a-trigger)
- опубликовать WebApp согласно [инструкции](https://seoneurons.com/create-contact-us-page/#34-deploying-the-script-as-a-web-app)
- скопировать [Идентификатор развертывания] 
- вставить в файл `.env` в переменную `PUBLIC_PROD_GOOGLE_APPSCRIPT_ID` (либо `PUBLIC_DEV_GOOGLE_APPSCRIPT_ID` для локальной разработки и стейджа)
- сбилдить приложение `npm run build` 
- и выложить на хостинг артефакты из папки `/dist`