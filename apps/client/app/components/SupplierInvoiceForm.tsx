'use client';

import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { SupplierInvoice, Item, PurchaseOrder } from '../interfaces';
import { Mode } from '../utils/enums';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface SupplierInvoiceFormProps {
  supplierInvoice?: SupplierInvoice;
  items: Item[];
  purchaseOrders: PurchaseOrder[];
  mode: Mode.CREATE | Mode.EDIT;
}

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  purchase_order_id: Yup.number().required('Purchase Order ID is required'),
  invoice_date: Yup.string().required('Invoice Date is required'),
  line_items: Yup.array().of(
    Yup.object().shape({
      item_id: Yup.number().required('Item is required').positive(),
      quantity_invoiced: Yup.number().required('Quantity Invoiced is required').positive().integer(),
      unit_cost: Yup.number().required('Unit Cost is required').positive(),
    })
  ).required('Line items are required'),
});

const SupplierInvoiceForm: React.FC<SupplierInvoiceFormProps> = ({ supplierInvoice, items, purchaseOrders, mode }) => {
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  // Initialize the form with react-hook-form
  const { control, handleSubmit, formState: { errors } } = useForm<SupplierInvoice>({
    defaultValues: {
      purchase_order_id: supplierInvoice?.purchase_order_id || 0,
      invoice_date: supplierInvoice?.invoice_date.substring(0, 10) || '',
      line_items: supplierInvoice?.line_items.map(lineItem => ({
        id: lineItem.id,
        item_id: lineItem.item_id,
        quantity_invoiced: lineItem.quantity_invoiced,
        unit_cost: lineItem.unit_cost,
      })) || [{ id: 0, item_id: 0, quantity_invoiced: 0, unit_cost: 0 }]
    },
    resolver: yupResolver(validationSchema) as any,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'line_items'
  });

  // On form submission, either call the api that will create a Supplier Invoice or the api that will update a Supplier Invoice
  const onSubmit = async (data: Omit<SupplierInvoice, 'id'>) => {
    const url = mode === Mode.CREATE
      ? `${API_BASE_URL}/supplier-invoices`
      : `${API_BASE_URL}/supplier-invoices/${supplierInvoice?.id}`;
    const method = mode === Mode.CREATE ? 'POST' : 'PATCH';

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
        window.location.href = '/supplier-invoices';
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
        <label className="block text-accent-content">Purchase Order</label>
        <Controller
          name="purchase_order_id"
          control={control}
          render={({ field }) => (
            <select {...field} className="mt-1 block w-full border border-accent rounded-md shadow-sm">
              <option value="">Select a purchase order</option>
              {purchaseOrders.map((po) => (
                <option key={po.id} value={po.id}>{po.vendor_name} - {po.id}</option>
              ))}
            </select>
          )}
        />
        {errors.purchase_order_id && <p className="text-red-500 text-xs">{errors.purchase_order_id.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-accent-content">Invoice Date</label>
        <Controller
          name="invoice_date"
          control={control}
          render={({ field }) => <input type="date" {...field} className="mt-1 block w-full border border-accent rounded-md shadow-sm" />}
        />
        {errors.invoice_date && <p className="text-red-500 text-xs">{errors.invoice_date.message}</p>}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-accent-content">Line Items</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-2">
            <label className="block text-accent-content">Item</label>
            <Controller
              name={`line_items.${index}.item_id`}
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
            {errors.line_items?.[index]?.item_id && <p className="text-red-500 text-xs">{errors.line_items?.[index]?.item_id?.message}</p>}
            <label className="block text-accent-content">Quantity Invoiced</label>
            <Controller
              name={`line_items.${index}.quantity_invoiced`}
              control={control}
              render={({ field }) => <input type="number" {...field} className="mt-1 block w-full border border-accent rounded-md shadow-sm" />}
            />
            {errors.line_items?.[index]?.quantity_invoiced && <p className="text-red-500 text-xs">{errors.line_items?.[index]?.quantity_invoiced?.message}</p>}
            <label className="block text-accent-content">Unit Cost</label>
            <Controller
              name={`line_items.${index}.unit_cost`}
              control={control}
              render={({ field }) => <input type="number" {...field} className="mt-1 block w-full border border-accent rounded-md shadow-sm" />}
            />
            {errors.line_items?.[index]?.unit_cost && <p className="text-red-500 text-xs">{errors.line_items?.[index]?.unit_cost?.message}</p>}
            <button type="button" onClick={() => remove(index)} className="mt-2 text-red-500">Remove Line Item</button>
          </div>
        ))}
        <button type="button" onClick={() => append({ id: 0, item_id: 0, quantity_invoiced: 0, unit_cost: 0 })} className="mt-4 text-blue-500">Add Line Item</button>
      </div>
      <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm">Submit</button>
    </form>
  );
};

export default SupplierInvoiceForm;
