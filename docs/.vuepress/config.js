module.exports = {
    title: 'LogB',
    description: 'Arduino alapú moduláris mérőeszközök keretrendszere.',
    serviceWorker: true,
    evergreen: true,
    head: [
        ['link', { rel: 'icon', href: './favicon.ico' }]
      ],
    themeConfig: {
        serviceWorker: {
            updatePopup: true
        },
        displayAllHeaders: true,
        repo: 'LogB'
    }
}