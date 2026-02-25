import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Krapao (กระเป๋า) - Digital Wallet',
        short_name: 'Krapao',
        description: 'Your Digital Wallet that Actually Helps You Save - บุคลิกภาพทางการเงินที่จัดการง่ายและเป็นส่วนตัว',
        start_url: '/',
        display: 'standalone',
        background_color: '#0B1120',
        theme_color: '#10b981',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
