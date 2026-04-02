import ProductDetails from "@/components/modules/dashboard/Projects/ProductDetails";
import { getSingleProduct } from "@/services/Product";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const product = await getSingleProduct(id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductDetails product={product} />;
};

export default Page;
