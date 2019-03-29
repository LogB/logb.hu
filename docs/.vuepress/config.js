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
        nav: [
            { text: "Fejlesztői útmutató", link: '/guide.md' },
            {
                text: 'További oldalak',
                items: [
                    { text: 'A LogB-ről', link: '/about.md' },
                    { text: 'A LogB állapota', link: '/status.md' },
                    { text: 'Kövessd a LogB-t!', link: '/follow-us.md' },
                    { text: 'Kapcsolat', link: '/contact.md' },
                    { text: 'LogB App', link: 'https://app.logb.hu' },

                ]
            }
        ],
    },
    plugins: [
        ['@vuepress/back-to-top'],
        ['@vuepress/pwa', {
            serviceWorker: true,
            updatePopup: {
                message: "Új tartalom elérehtő",
                buttonText: "Frissítés"
            }
        }],
        [
            '@vuepress/google-analytics',
            {
                'ga': 'UA-131029131-1'
            }
        ],
        [
            'flowchart'
        ]
    ]
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
    //                 { text: 'LogB App', link: 'https://app.logb.hu' },

    //             ]
    //         }
    //     ],
    // }
}
