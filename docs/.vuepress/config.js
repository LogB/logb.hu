module.exports = {
    // locales: {
    //     '/': {
    //         description: 'Arduino alapú moduláris mérőeszközök keretrendszere',
    //     },
    //     '/en/': {
    //         description: 'The proposal for a standardized, modular ecosystem for Arduino based measurement solutions',
    //     }
    // },
    title: 'LogB',
    description: 'Az Arduino alapú moduláris mérőeszközök keretrendszere',
    ga: 'UA-131029131-1',
    head: [
        ['link', { rel: 'icon', href: '/assets/img/favicon.ico' }],
        ['script', { type: 'application/ld+json' }, {
            "@context": "http://schema.org",
            "@type": "Project",
            "brand": "LogB",
            "legalName": "LogB",
            "email": "info@logb.hu",
            "logo": "/assets/img/logo.png"
        }]
    ],
    evergreen: true,
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
                sidebar: true,
                nav: [
                    { text: "Standard", link: '/guide.md' },
                    {
                        text: 'Oldalak',
                        items: [
                            { text: 'A LogB-ról', link: '/about.md' },
                            { text: 'Kövessd a LogB-t', link: '/follow-us.md' },
                            { text: 'Kapcsolat', link: '/contact-us.md' },
                            { text: 'LogB Cloud', link: 'https://cloud.logb.hu' },

                        ]
                    }
                ],
            },
            // '/en/': {
            //     label: 'English',
            //     lastUpdated: true,
            //     nav: [
            //         {
            //             text: 'Pages',
            //             items: [
            //                 { text: 'The status of LogB', link: '/state/' },
            //                 { text: 'Follow LogB', link: '/follow-us/' },
            //                 { text: 'Contact Us', link: '/contact-us/' },
            //                 { text: 'LogB Cloud', link: 'https://cloud.logb.hu' },

            //             ]
            //         }
            //     ],
            // }
        },
        displayAllHeaders: true,
        repo: 'LogB',
        docsRepo: 'LogB/logb.hu',
        docsDir: 'docs',
        editLinks: true,
    }
}