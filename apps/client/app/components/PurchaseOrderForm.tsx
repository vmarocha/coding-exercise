// This is the only client component so far in the application due to the need for interactivity
'use client'

import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { PurchaseOrder, Item } from '../interfaces';

// This component is passed in the Purchase Order and whether we are creating or editing
interface PurchaseOrderFormProps {
  purchaseOrder?: PurchaseOrder;
  items: Item[];
  mode: 'create' | 'edit';
}

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  id: Yup.number().required('Purchase Order is required'),
  vendor_name: Yup.string().required('Vendor name is required'),
  order_date: Yup.string().required('Order date is required'),
  expected_delivery_date: Yup.string().required('Expected delivery date is required').test(
    'is-greater',
    'Expected delivery date must be after the order date',
    function (value) {
      const { order_date } = this.parent;
      return new Date(order_date) < new Date(value);
    }
  ),
  purchase_order_line_items: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().required('Purchase Order Line Item is required'),
      item_id: Yup.number().required('Item is required').positive(),
      quantity: Yup.number().required('Quantity is required').positive().integer(),
      unit_cost: Yup.number().required('Unit cost is required').positive(),
    })
  ).required(),
  total_quantity: Yup.number().notRequired(),
  total_cost: Yup.number().notRequired(),
});

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ purchaseOrder, items, mode }) => {
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  // Initialize the form with react-hook-form
  const { control, handleSubmit, formState: { errors } } = useForm<PurchaseOrder>({
    defaultValues: {
      id: purchaseOrder?.id || 0,
      vendor_name: purchaseOrder?.vendor_name || '',
      order_date: purchaseOrder?.order_date.substring(0, 10) || '',
      expected_delivery_date: purchaseOrder?.expected_delivery_date.substring(0, 10) || '',
      purchase_order_line_items: purchaseOrder?.purchase_order_line_items.map(lineItem => ({
        id: lineItem.id || 0,
        item_id: lineItem.item_id,
        quantity: lineItem.quantity,
        unit_cost: lineItem.unit_cost,
      })) || [{ id: 0, item_id: 0, quantity: 0, unit_cost: 0 }]
    },
    resolver: yupResolver(validationSchema) as any, // Casting to any to get rid of TypeScript error that is not actually an issue
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'purchase_order_line_items'
  });

  // On form submission, either call the api that will create a Purchase Order or the api that will update a Purchase Order
  const onSubmit = async (data: Omit<PurchaseOrder, 'id'>) => {
    const url = mode === 'create'
      ? 'http://localhost:3100/api/purchase-orders'
      : `http://localhost:3100/api/purchase-orders/${purchaseOrder?.id}`;
    const method = mode === 'create' ? 'POST' : 'PATCH';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setServerErrors(errorData.message || ['An error occurred']);
      } else {
        // Navigate to the list page and reload to ensure server-side rendering takes place
        window.location.href = '/purchase-orders';
      }
    } catch (error) {
      setServerErrors(['An error occurred']);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto p-4 bg-base-100 shadow-md rounded-lg">
      {serverErrors.length > 0 && (
        <div className="mb-4 text-red-600">
          {serverErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-accent-content">Vendor Name</label>
        <Controller
          name="vendor_name"
          control={control}
          render={({ field }) => <input {...field} className="mt-1 block w-full border border-accent rounded-md shadow-sm" />}
        />
        {errors.vendor_name && <p className="text-red-500 text-xs">{errors.vendor_name.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-accent-content">Order Date</label>
        <Controller
          name="order_date"
          control={control}
          render={({ field }) => <input type="date" {...field} className="mt-1 block w-full border border-accent rounded-md shadow-sm" />}
        />
        {errors.order_date && <p className="text-red-500 text-xs">{errors.order_date.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-accent-content">Expected Delivery Date</label>
        <Controller
          name="expected_delivery_date"
          control={control}
          render={({ field }) => <input type="date" {...field} className="mt-1 block w-full border border-accent rounded-md shadow-sm" />}
        />
        {errors.expected_delivery_date && <p className="text-red-500 text-xs">{errors.expected_delivery_date.message}</p>}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-accent-content">Line Items</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-2">
            <label className="block text-accent-content">Item</label>
            <Controller
              name={`purchase_order_line_items.${index}.item_id`}
              control={control}
              defaultValue={field.item_id}
              render={({ field: selectField }) => (
                <select {...selectField} className="mt-1 block w-full border border-accent rounded-md shadow-sm">
                  <option value="">Select an item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              )}
            />
            {errors.purchase_order_line_items?.[index]?.item_id && <p className="text-red-500 text-xs">{errors.purchase_order_line_items?.[index]?.item_id?.message}</p>}
            <label className="block text-accent-content">Quantity</label>
            <Controller
              name={`purchase_order_line_items.${index}.quantity`}
              control={control}
              render={({ field }) => <input type="number" {...field} className="mt-1 block w-full border border-accent rounded-md shadow-sm" />}
            />
            {errors.purchase_order_line_items?.[index]?.quantity && <p className="text-red-500 text-xs">{errors.purchase_order_line_items?.[index]?.quantity?.message}</p>}
            <label className="block text-accent-content">Unit Cost</label>
            <Controller
              name={`purchase_order_line_items.${index}.unit_cost`}
              control={control}
              render={({ field }) => <input type="number" {...field} className="mt-1 block w-full border border-accent rounded-md shadow-sm" />}
            />
            {errors.purchase_order_line_items?.[index]?.unit_cost && <p className="text-red-500 text-xs">{errors.purchase_order_line_items?.[index]?.unit_cost?.message}</p>}
            <button type="button" onClick={() => remove(index)} className="mt-2 text-red-500">Remove Line Item</button>
          </div>
        ))}
        <button type="button" onClick={() => append({ id: 0, item_id: 0, quantity: 0, unit_cost: 0 })} className="mt-4 text-blue-500">Add Line Item</button>
      </div>
      <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm">Submit</button>
    </form>
  );
};

export default PurchaseOrderForm;