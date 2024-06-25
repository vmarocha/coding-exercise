'use client';

import React, { useCallback } from 'react';
import { Tooltip } from '@nextui-org/react';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface MatchTooltipProps {
  goodsReceiptMatch: boolean;
  supplierInvoiceMatch: boolean;
  reasons: string[];
}

const MatchTooltip: React.FC<MatchTooltipProps> = ({ goodsReceiptMatch, supplierInvoiceMatch, reasons }) => {
const getMatchIcon = useCallback((match: boolean) => match ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />, []);
const getTooltipContent = useCallback((reasons: string[]) => {
    if (reasons.length === 0) return "Match successful!";
    return reasons.join(", ");
}, []);
  

  return (
    <Tooltip
      content={
        <div className="px-2 py-1 bg-gray-800 text-white rounded-md shadow-lg">
          <div className="text-xs">{getTooltipContent(reasons)}</div>
        </div>
      }
    >
      <span className="flex items-center space-x-1">
        {getMatchIcon(goodsReceiptMatch)} {getMatchIcon(supplierInvoiceMatch)}
      </span>
    </Tooltip>
  );
};

export default MatchTooltip;
