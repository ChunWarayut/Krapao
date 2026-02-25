import { DEFAULT_CATEGORIES } from '@/data/defaultCategories';

export function identifyCategory(input: string) {
    const text = input.toLowerCase();

    // Mapping of keywords to category IDs
    const keywords: Record<string, string[]> = {
        'cat-1': ['food', 'lunch', 'dinner', 'breakfast', 'starbucks', 'kfc', 'mcdonald', 'rice', 'meal', 'ข้าว', 'อาหาร'],
        'cat-2': ['bus', 'taxi', 'grab', 'uber', 'bolt', 'bts', 'mrt', 'train', 'gas', 'oil', 'น้ำมัน', 'รถ'],
        'cat-3': ['shopping', 'mall', 'shopee', 'lazada', 'amazon', 'zara', 'clothes', 'เสื้อ'],
        'cat-5': ['electric', 'water', 'internet', 'wifi', 'rent', 'bill', 'ไฟ', 'น้ำ', 'เน็ต'],
        'cat-6': ['salary', 'bonus', 'paycheck', 'เงินเดือน'],
        'cat-7': ['freelance', 'gig', 'project', 'งาน'],
    };

    for (const [catId, tags] of Object.entries(keywords)) {
        if (tags.some(tag => text.includes(tag))) {
            return DEFAULT_CATEGORIES.find(c => c.id === catId);
        }
    }

    return null;
}

export function parseQuickEntry(input: string) {
    // Matches "Lunch 50" or "50 Lunch" or "Lunch 50.50"
    const amountMatch = input.match(/(\d+(\.\d{1,2})?)/);
    if (!amountMatch) return null;

    const amount = parseFloat(amountMatch[0]);
    const note = input.replace(amountMatch[0], '').trim();
    const category = identifyCategory(note);

    return {
        amount,
        note,
        category
    };
}
