import PurchaseOrderForm from "../../components/PurchaseOrderForm";
import { fetchParentItems } from '../../utils/api';

const CreatePurchaseOrderPage = async () => {
  const items = await fetchParentItems();

  return (
    <div>
      <h1 className="text-2xl">Create Purchase Order</h1>
      <PurchaseOrderForm items={items} mode="create" />
    </div>
  );
};

export default CreatePurchaseOrderPage;