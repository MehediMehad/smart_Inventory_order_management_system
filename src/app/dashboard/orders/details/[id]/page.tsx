export const dynamic = "force-dynamic";

import OrderDetails from "@/components/modules/dashboard/Orders/OrderDetails";
import { getSingleOrder } from "@/services/Order";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const order = await getSingleOrder(id);

  return <OrderDetails order={order} />;
};

export default Page;
