import { useMemo } from "react";
import PopupHero from "@/components/PopupHero";
import ProductSlugLayout from "@/components/ProductSlugLayout";
import {
  getPopupProductPaths,
  getPopupProductByHandle,
} from "@/lib/popupSlugUtils";

export async function getStaticPaths() {
  return await getPopupProductPaths();
}

export async function getStaticProps({ params }) {
  const product = await getPopupProductByHandle(params.slug);

  if (!product) return { notFound: true };

  return { props: { product } };
}

export default function PopupSlug({ product }) {
  const portfolioId = useMemo(() => {
    const handle = product?.handle || "unknown";
    return `popup_slug:${handle}`;
  }, [product?.handle]);

  return (
    <>
      <PopupHero />
      <ProductSlugLayout
        product={product}
        portfolioId={portfolioId}
        storeSection="popup"
        breadcrumbLabel="Popup Shop"
        breadcrumbHref="/popup"
        backHref="/popup"
        backLabel="Back to Popup Shop"
      />
    </>
  );
}
