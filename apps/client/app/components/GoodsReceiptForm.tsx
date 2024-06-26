'use client';

import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { GoodsReceipt, Item, PurchaseOrder } from '../interfaces';
import { Mode } from '../utils/enums';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface GoodsReceiptFormProps {
    goodsReceipt?: GoodsReceipt;
    items: Item[];
    purchaseOrders: PurchaseOrder[];
    mode: Mode.CREATE | Mode.EDIT;
}

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
    purchase_order_id: Yup.number().required('Purchase Order ID is required').positive('Please select a valid purchase order'),
    received_at: Yup.string().required('Received Date is required'),
    line_items: Yup.array().of(
        Yup.object().shape({
            item_id: Yup.number().required('Item is required').positive('Please select a valid item'),
            quantity_received: Yup.number().required('Quantity Received is required').positive().integer(),
        })
    ).required('Line items are required'),
});

const GoodsReceiptForm: React.FC<GoodsReceiptFormProps> = ({ goodsReceipt, items, purchaseOrders, mode }) => {
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    const router = useRouter();

    // Initialize the form with react-hook-form
    const { control, handleSubmit, formState: { errors } } = useForm<GoodsReceipt>({
        defaultValues: {
            purchase_order_id: goodsReceipt?.purchase_order_id || 0,
            received_at: goodsReceipt?.received_at.substring(0, 10) || '',
            line_items: goodsReceipt?.line_items.map(lineItem => ({
                id: lineItem.id,
                item_id: lineItem.item_id,
                quantity_received: lineItem.quantity_received,
            })) || [{id: 0, item_id: 0, quantity_received: 0 }]
        },
        resolver: yupResolver(validationSchema) as any,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'line_items'
    });

    // On form submission, either call the api that will create a Goods Receipt or the api that will update a Goods Receipt
    const onSubmit = async (data: Omit<GoodsReceipt, 'id'>) => {
        const url = mode === Mode.CREATE
            ? `${API_BASE_URL}/goods-receipts`
            : `${API_BASE_URL}/goods-receipts/${goodsReceipt?.id}`;
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
                router.push('/goods-receipts');
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
                <label className="block text-accent-content">Purchase Order ID</label>
                <Controller
                    name="purchase_order_id"
                    control={control}
                    render={({ field }) => (
                        <select {...field} className="mt-1 block w-full border border-accent rounded-md shadow-sm">
                            <option value="">Select a purchase order</option>
                            {purchaseOrders.map(po => (
                                <option key={po.id} value={po.id}>{po.vendor_name} - {po.id}</option>
                            ))}
                        </select>
                    )}
                />
                {errors.purchase_order_id && <p className="text-red-500 text-xs">{errors.purchase_order_id.message}</p>}
            </div>
            <div className="mb-4">
                <label className="block text-accent-content">Received Date</label>
                <Controller
                    name="received_at"
                    control={control}
                    render={({ field }) => <input type="date" {...field} className="mt-1 block w-full border border-accent rounded-md shadow-sm" />}
                />
                {errors.received_at && <p className="text-red-500 text-xs">{errors.received_at.message}</p>}
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
                        <label className="block text-accent-content">Quantity Received</label>
                        <Controller
                            name={`line_items.${index}.quantity_received`}
                            control={control}
                            render={({ field }) => <input type="number" {...field} className="mt-1 block w-full border border-accent rounded-md shadow-sm" />}
                        />
                        {errors.line_items?.[index]?.quantity_received && <p className="text-red-500 text-xs">{errors.line_items?.[index]?.quantity_received?.message}</p>}
                        <button type="button" onClick={() => remove(index)} className="mt-2 text-red-500">Remove Line Item</button>
                    </div>
                ))}
                <button type="button" onClick={() => append({ id: 0, item_id: 0, quantity_received: 0 })} className="mt-4 text-blue-500">Add Line Item</button>
            </div>
            <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm">Submit</button>
        </form>
    );
};

export default GoodsReceiptForm;
