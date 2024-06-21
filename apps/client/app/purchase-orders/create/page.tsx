import PurchaseOrderForm from "../../components/PurchaseOrderForm";

const CreatePurchaseOrderPage = async () => {
  return (
    <div>
      <h1 className="text-2xl">Create Purchase Order</h1>
      <PurchaseOrderForm mode="create" />
    </div>
  );
};

export default CreatePurchaseOrderPage;