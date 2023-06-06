interface Variant {
  id: number;
  name: string;
  sku: string;
}

interface Item {
  id: number;
  name: string;
  variants: Variant[];
}

async function getData(): Promise<Item[]> {
  const res = await fetch('http://localhost:3100/api/items');
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function Index() {
  const data = await getData()

  return (
    <>
      <h1 className="text-2xl">Items</h1>
      <table className="border-collapse table-auto w-full text-sm">
        <thead>
        <tr>
          <th
            className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">Item
          </th>
          <th
            className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">Variants
          </th>
        </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800">
        {data.map((item: any) => (
          <tr key={item.id}>
            <td
              className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{item.name}</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              <ul>
                {item.variants.map((variant: any) => (
                  <li key={variant.id}>{variant.name} ({variant.sku})</li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
  );
}
