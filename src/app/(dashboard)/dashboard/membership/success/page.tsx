import { Suspense } from "react";
import { SuccessContent } from "./content";

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
