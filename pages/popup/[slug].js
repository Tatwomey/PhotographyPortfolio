import { useEffect, useMemo } from "react";
import ProductSlugLayout from "@/components/ProductSlugLayout";
import {
  getPopupProductPaths,
  getPopupProductByHandle,
} from "@/lib/popupSlugUtils";

function pushDataLayer(payload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export async function getStaticPaths() {
  return await getPopupProductPaths(); // returns { paths, fallback }
}

export async function getStaticProps({ params }) {
  const product = await getPopupProductByHandle(params.slug);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: { product },
  };
}

export default function PopupSlug({ product }) {
  const portfolioId = useMemo(() => {
    const handle = product?.handle || "unknown";
    return `popup_slug:${handle}`;
  }, [product?.handle]);

  useEffect(() => {
    if (!product) return;

    pushDataLayer({
      event: "product_view",
      portfolio_id: portfolioId,
      product_id: product.handle || null,
      product_title: product.title || null,
    });
  }, [product, portfolioId]);

  return <ProductSlugLayout product={product} portfolioId={portfolioId} />;
}
