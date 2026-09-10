import { redirect } from "next/navigation";
export default async function LegacyAdminRoute({ params }: { params: Promise<{ table: string }> }) { const { table } = await params; redirect(`/admin?view=${encodeURIComponent(table)}`); }
