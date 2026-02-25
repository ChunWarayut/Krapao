import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction, Category, UserStats } from '@/types';
import { format } from 'date-fns';

export async function generateBudgetReport(
    transactions: Transaction[],
    categories: Category[],
    stats: UserStats
) {
    const doc = new jsPDF();
    const themeColor = [5, 150, 105]; // Emerald 600

    // Header
    doc.setFillColor(themeColor[0], themeColor[1], themeColor[2]);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('KRAPAO Budget Report', 20, 25);

    doc.setFontSize(10);
    doc.text(`Generated on ${format(new Date(), 'PPP')}`, 20, 32);

    // Summary Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Monthly Summary', 20, 55);

    autoTable(doc, {
        startY: 60,
        head: [['Description', 'Amount']],
        body: [
            ['Monthly Income', `$${stats.monthlyIncome.toLocaleString()}`],
            ['Monthly Expense', `$${stats.monthlyExpense.toLocaleString()}`],
            ['Net Savings', `$${(stats.monthlyIncome - stats.monthlyExpense).toLocaleString()}`],
            ['Health Score', `${stats.healthScore}/100`],
        ],
        theme: 'striped',
        headStyles: { fillColor: themeColor as [number, number, number] },
    });

    // Transactions Section
    doc.setFontSize(16);
    doc.text('Recent Transactions', 20, (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15);

    const tableData = transactions.map(t => [
        format(new Date(t.date), 'MMM d, yyyy'),
        categories.find(c => c.id === t.categoryId)?.name || 'Other',
        t.note || '-',
        t.type.toUpperCase(),
        `${t.type === 'income' ? '+' : '-'}$${t.amount.toLocaleString()}`
    ]);

    autoTable(doc, {
        startY: (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20,
        head: [['Date', 'Category', 'Note', 'Type', 'Amount']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: themeColor as [number, number, number] },
    });

    doc.save(`krapao-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}
