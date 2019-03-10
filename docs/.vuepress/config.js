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
    serviceWorker: true,
    head: [
        ['link', { rel: 'icon', href: '/assets/img/favicon.ico' }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
    ],
    evergreen: true,
    themeConfig: {
        lastUpdated: 'Frissítve',
        displayAllHeaders: true,
        repo: 'LogB',
        docsRepo: 'LogB/logb.hu',
        docsDir: 'docs',
        editLinks: true,
        editLinkText: 'Módosítsd ezt az oldalt a GitHub-on',
        serviceWorker: {
            updatePopup: {
                message: "Új tartalom elérehtő",
                buttonText: "Frissítés"
            }
        },
        nav: [
            { text: "Fejlesztői útmutató", link: '/guide.md' },
            {
                text: 'további oldalak',
                items: [
                    { text: 'A LogB, célja, állapota', link: '/about.md' },
                    { text: 'Kövessd a LogB-t!', link: '/follow-us.md' },
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
}