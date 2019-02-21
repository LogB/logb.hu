/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "a4ceebdc1bd851c4be2f248c5e3ff1d9"
  },
  {
    "url": "assets/css/0.styles.7c382ec4.css",
    "revision": "155f4fe4da10b3be1d680d1a274651af"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/2.a50bb230.js",
    "revision": "3b50d49798e4658924884a639570b7dd"
  },
  {
    "url": "assets/js/3.80c8f7ee.js",
    "revision": "40f3e88d8759084f4c61175fe8c16caa"
  },
  {
    "url": "assets/js/4.84a7f26f.js",
    "revision": "c24faa9e9be99fd21b9b7fe0820707fd"
  },
  {
    "url": "assets/js/5.9aa7b228.js",
    "revision": "59c458c0525018c553b3b143a229c581"
  },
  {
    "url": "assets/js/app.deeb5da3.js",
    "revision": "93feaa4ae1d8d2d27e7ad6dca06385d6"
  },
  {
    "url": "icons/android-chrome-192x192.png",
    "revision": "8c0561adbdcc7f10075c38f8a974fb1a"
  },
  {
    "url": "icons/android-chrome-512x512.png",
    "revision": "594764815a7a63a869ce74ebfceac841"
  },
  {
    "url": "index.html",
    "revision": "e4bd92bca7fe79c4009786b9fce0268f"
  },
  {
    "url": "sub/index.html",
    "revision": "8f31ccf64ec0c8b3f9919335c69fb45c"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
