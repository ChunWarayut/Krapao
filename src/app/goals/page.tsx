import type { Metadata } from 'next';
import GoalsClient from './GoalsClient';

export const metadata: Metadata = {
    title: "เป้าหมายการออม",
    description: "วางแผนและติดตามความคืบหน้าการออมเงินเพื่อบรรลุเป้าหมายทางการเงินของคุณอย่างมีประสิทธิภาพ",
};

export default function GoalsPage() {
    return <GoalsClient />;
}
