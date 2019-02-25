module.exports = {
    locales: {
        '/': {
            description: 'Arduino alapú moduláris mérőeszközök keretrendszere',
        },
        '/en/': {
            description: 'The proposal for standardized modular ecosystem for Arduino based measurement solutions',
        }
    },
    title: 'LogB',
    evergreen: true,
    head: [
        ['link', { rel: 'icon', href: 'favicon.ico' }]
    ],
    themeConfig: {
        locales: {
            // The key is the path for the locale to be nested under.
            // As a special case, the default locale can use '/' as its path.
            '/': {
                selectText: 'Nyelvek',
                // label for this locale in the language dropdown
                label: 'Magyar',
                // text for the edit-on-github link
                editLinkText: 'Módosítsd ezt az oldalt a GitHubon',
                // config for Service Worker 
                serviceWorker: {
                    updatePopup: {
                        message: "Új tartalom elérehtő",
                        buttonText: "Frissítés"
                    }
                },
                lastUpdated: 'Frissítve',
                sidebar: 'true',
                nav: [
                    {
                        text: 'Oldalak',
                        items: [
                            { text: 'A LogB státusza', link: '/state/' },
                            { text: 'Kövessd a LogB-t', link: '/follow-us/' },
                            { text: 'Kapcsolat', link: '/contact-us/' },
                            { text: 'LogB Cloud', link: 'https://cloud.logb.hu' },

                        ]
                    }
                ],
            },
            '/en/': {
                label: 'English',
                lastUpdated: true,
                nav: [
                    { text: 'Státusz', link: '/state/' },
                    {
                        text: 'Pages',
                        items: [
                            { text: 'The state of LogB', link: '/state' },
                            { text: 'Contact us', link: '/contact-us/' },
                            { text: 'Follow us', link: '/follow-us/' },
                            { text: 'LogB Cloud', link: 'https://cloud.logb.hu' },
                        ]
                    }
                ],
            }
        },
        displayAllHeaders: true,
        repo: 'LogB',
        docsRepo: 'LogB/logb.hu',
        docsDir: 'docs',
        editLinks: true,
    }
}