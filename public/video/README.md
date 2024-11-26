# Readme

эти видео - альтернатива webGL и 3d-Viewer
контекст:
- https://rotato.app/blog/transparent-videos-for-the-web
- https://www.youtube.com/watch?v=Xg6aYfuvRHk

что в папке:
- original.webm - исходник с прозрачностью
- vp9.webm - сконвертированное видео с прозрачным фоном для Chromium
- hevc.mov - сконвертированное видео с прозрачным фоном для Safari

как конвертировать файлы:
- поставить ffmpeg https://www.ffmpeg.org/
- в папке с видео создать подпапку /out
  `mkdir out`
- разбить видео (например, original.webm) на кадры
  `ffmpeg -vcodec libvpx-vp9 -i original.webm -pix_fmt rgba out/image_%04d.png`
- склеить их назад с кодеком AppleProRes4444
  (можно поиграться с настройками framerate и bits_per_mb)
  `ffmpeg -framerate 36 -f image2 -i out/image_0%03d.png -c:v prores_ks -profile:v 4  -vendor apl0 -bits_per_mb 8000  -pix_fmt yuva444p10le AppleProRes4444.mov`
- конвертировать видео для Chrome с кодеком vp9
  `ffmpeg -i "AppleProRes4444.mov" -c:v libvpx-vp9 vp9.webm`
- конвертировать видео для Safari
  для этого на macOS через правую кнопку мыши на файле AppleProRes4444.mov 
  вызвать контекстное меню:
  - 'Закодировать выбранные видеофайлы'
  - Настройки: [HEVC 1080p]
  - [x] Сохранить прозрачность
- переименовать новый файл AppleProRes4444-1.mov -> hevc.mov

