import { MemberDetailContent } from "./content";

export function generateStaticParams() {
  return [{ id: "1" }];
}

export default function MemberDetailPage() {
  return <MemberDetailContent />;
}
