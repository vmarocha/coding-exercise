export const SummaryCard = ({ title, count, details }: { title: string, count: number, details: string }) => (
    <div className="p-4 bg-accent-content text-base-100 rounded-md shadow-md">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-3xl">{count}</p>
      <p className="text-sm">{details}</p>
    </div>
  );