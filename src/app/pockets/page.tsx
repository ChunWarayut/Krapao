import type { Metadata } from 'next';
import PocketsClient from './PocketsClient';

export const metadata: Metadata = {
    title: "กระเป๋าเงิน",
    description: "จัดการกระเป๋าเงินแยกตามวัตถุประสงค์ (Multi-Pocket System) และติดตามยอดเงินคงเหลือแบบ Real-time",
};

export default function PocketsPage() {
    return <PocketsClient />;
}
