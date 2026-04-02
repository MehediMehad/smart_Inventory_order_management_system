import ProductEditForm from "@/components/modules/dashboard/Projects/ProductEditForm";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ProductEditForm productId={id} />;
};

export default Page;
