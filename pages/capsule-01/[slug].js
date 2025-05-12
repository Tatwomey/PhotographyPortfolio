import ProductSlugLayout from '@/components/ProductSlugLayout';
import {
  getPopupProductPaths,
  getPopupProductByHandle,
} from '@/lib/popupSlugUtils';

export async function getStaticPaths() {
  return await getPopupProductPaths(); // returns { paths, fallback }
}

export async function getStaticProps({ params }) {
  const product = await getPopupProductByHandle(params.slug);

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: { product },
  };
}

export default function PopupSlug({ product }) {
  return <ProductSlugLayout product={product} />;
}
