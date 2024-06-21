'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { PurchaseOrder, Item, ParentItem } from '../interfaces';

interface PurchaseOrderFormProps {
  purchaseOrder?: PurchaseOrder;
  mode: 'create' | 'edit';
}

const validationSchema = Yup.object().shape({
  id: Yup.number().required('Purchase Order is required'),
  vendor_name: Yup.string().required('Vendor name is required'),
  order_date: Yup.string().required('Order date is required'),
  expected_delivery_date: Yup.string().required('Expected delivery date is required'),
  purchase_order_line_items: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().required('Purchase Order Line Item is required'),
      item_id: Yup.number().required('Item is required').positive(),
      quantity: Yup.number().required('Quantity is required').positive().integer(),
      unit_cost: Yup.number().required('Unit cost is required').positive(),
    })
  ).required()
});

const fetchItems = async (): Promise<Item[]> => {
  const res = await fetch('http://localhost:3100/api/parent-items');
  const data = await res.json();
  const items = data.flatMap((parent: { items: Item[] }) => parent.items);  
  return [{ id: 0, name: 'Select an item', sku: '', price: 0 }, ...items];
};

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ purchaseOrder, mode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchItems().then(setItems);
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<PurchaseOrder>({
    defaultValues: {
      vendor_name: purchaseOrder?.vendor_name || '',
      order_date: purchaseOrder?.order_date.substring(0, 10) || '',
      expected_delivery_date: purchaseOrder?.expected_delivery_date.substring(0, 10) || '',
      purchase_order_line_items: purchaseOrder?.purchase_order_line_items.map(lineItem => ({
        item_id: lineItem.item_id,
        quantity: lineItem.quantity,
        unit_cost: lineItem.unit_cost,
      })) || [{ id: 0, item_id: 0, quantity: 0, unit_cost: 0 }]
    },
    resolver: yupResolver(validationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'purchase_order_line_items'
  });

  const onSubmit = async (data: Omit<PurchaseOrder, 'id'>) => {
    const url = mode === 'create' 
      ? 'http://localhost:3100/api/purchase-orders' 
      : `http://localhost:3100/api/purchase-orders/${purchaseOrder?.id}`;
    const method = mode === 'create' ? 'POST' : 'PATCH';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    router.push('/purchase-orders');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Vendor Name</label>
        <Controller
          name="vendor_name"
          control={control}
          render={({ field }) => <input {...field} />}
        />
        {errors.vendor_name && <p>{errors.vendor_name.message}</p>}
      </div>
      <div>
        <label>Order Date</label>
        <Controller
          name="order_date"
          control={control}
          render={({ field }) => <input type="date" {...field} />}
        />
        {errors.order_date && <p>{errors.order_date.message}</p>}
      </div>
      <div>
        <label>Expected Delivery Date</label>
        <Controller
          name="expected_delivery_date"
          control={control}
          render={({ field }) => <input type="date" {...field} />}
        />
        {errors.expected_delivery_date && <p>{errors.expected_delivery_date.message}</p>}
      </div>
      <div>
        <h3>Line Items</h3>
        {fields.map((field, index) => (
          <div key={field.id}>
            <label>Item</label>
            <Controller
              name={`purchase_order_line_items.${index}.item_id`}
              control={control}
              defaultValue={field.item_id}
              render={({ field: selectField }) => (
                <select {...selectField}>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              )}
            />
            {errors.purchase_order_line_items?.[index]?.item_id && <p>{errors.purchase_order_line_items?.[index]?.item_id?.message}</p>}
            <label>Quantity</label>
            <Controller
              name={`purchase_order_line_items.${index}.quantity`}
              control={control}
              render={({ field }) => <input type="number" {...field} />}
            />
            {errors.purchase_order_line_items?.[index]?.quantity && <p>{errors.purchase_order_line_items?.[index]?.quantity?.message}</p>}
            <label>Unit Cost</label>
            <Controller
              name={`purchase_order_line_items.${index}.unit_cost`}
              control={control}
              render={({ field }) => <input type="number" {...field} />}
            />
            {errors.purchase_order_line_items?.[index]?.unit_cost && <p>{errors.purchase_order_line_items?.[index]?.unit_cost?.message}</p>}
            <button type="button" onClick={() => remove(index)}>Remove Line Item</button>
          </div>
        ))}
        <button type="button" onClick={() => append({ id: 0, item_id: 0, quantity: 0, unit_cost: 0 })}>Add Line Item</button>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PurchaseOrderForm;