import React from 'react';

export default function StructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Krapao (กระเป๋า)",
        "url": "https://krapao.app",
        "description": "Your Digital Wallet that Actually Helps You Save - เว็บแอปพลิเคชันจัดการการเงินแบบ Open Source เน้นความง่ายและความเป็นส่วนตัว",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "author": {
            "@type": "Organization",
            "name": "ChunWarayut"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "THB"
        },
        "featureList": [
            "Expense tracking",
            "Receipt scanning",
            "Financial goal planning",
            "Smart pockets management"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
