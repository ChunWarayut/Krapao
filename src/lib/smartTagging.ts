
export function identifyCategory(input: string, categories: any[]) {
    const text = input.toLowerCase();

    // Mapping of keywords to base category IDs (suffix)
    const keywords: Record<string, string[]> = {
        'cat-1': ['food', 'lunch', 'dinner', 'breakfast', 'starbucks', 'kfc', 'mcdonald', 'rice', 'meal', 'ข้าว', 'อาหาร'],
        'cat-2': ['bus', 'taxi', 'grab', 'uber', 'bolt', 'bts', 'mrt', 'train', 'gas', 'oil', 'น้ำมัน', 'รถ'],
        'cat-3': ['shopping', 'mall', 'shopee', 'lazada', 'amazon', 'zara', 'clothes', 'เสื้อ'],
        'cat-5': ['electric', 'water', 'internet', 'wifi', 'rent', 'bill', 'ไฟ', 'น้ำ', 'เน็ต'],
        'cat-6': ['salary', 'bonus', 'paycheck', 'เงินเดือน'],
        'cat-7': ['freelance', 'gig', 'project', 'งาน'],
    };

    for (const [baseId, tags] of Object.entries(keywords)) {
        if (tags.some(tag => text.includes(tag))) {
            // Find category that ends with the baseId (handles prefixed IDs)
            return categories.find(c => c.id === baseId || c.id.endsWith(`-${baseId}`));
        }
    }

    return null;
}

export function parseQuickEntry(input: string, categories: any[]) {
    // Matches "Lunch 50" or "50 Lunch" or "Lunch 50.50"
    const amountMatch = input.match(/(\d+(\.\d{1,2})?)/);
    if (!amountMatch) return null;

    const amount = parseFloat(amountMatch[0]);
    const note = input.replace(amountMatch[0], '').trim();
    const category = identifyCategory(note, categories);

    return {
        amount,
        note,
        category
    };
}
