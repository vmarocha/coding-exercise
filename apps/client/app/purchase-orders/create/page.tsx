import PurchaseOrderForm from "../../components/PurchaseOrderForm";
import { fetchParentItems } from '../../utils/api';
import { Mode } from '../../utils/enums';

const CreatePurchaseOrderPage = async () => {
  const items = await fetchParentItems();

  return (
    <div>
      <h1 className="text-2xl">Create Purchase Order</h1>
      <PurchaseOrderForm items={items} mode={Mode.CREATE} />
    </div>
  );
};

export default CreatePurchaseOrderPage;