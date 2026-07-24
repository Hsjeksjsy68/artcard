import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { PricePoint } from '../types';
import { formatCurrency } from '../lib/utils';
import { format, parseISO } from 'date-fns';

interface PriceChartProps {
  data: PricePoint[];
}

export function PriceChart({ data }: PriceChartProps) {
  const isPositive = data.length > 1 && data[data.length - 1].price >= data[0].price;
  const strokeColor = isPositive ? '#000000' : '#ef4444'; // Black or red

  return (
    <div className="h-[250px] w-full mt-4 font-sans font-black">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="0" stroke="#e5e5e5" vertical={false} strokeWidth={2} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(tick) => format(parseISO(tick), 'MMM d').toUpperCase()}
            stroke="#a3a3a3" 
            fontSize={10}
            tickMargin={12}
            minTickGap={30}
            axisLine={{ stroke: '#000000', strokeWidth: 2 }}
            tickLine={{ stroke: '#000000', strokeWidth: 2 }}
          />
          <YAxis 
            stroke="#a3a3a3" 
            fontSize={10}
            tickFormatter={(value) => `৳${value}`}
            axisLine={{ stroke: '#000000', strokeWidth: 2 }}
            tickLine={{ stroke: '#000000', strokeWidth: 2 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderColor: '#000', borderWidth: '2px', borderRadius: '0px', color: '#000', padding: '12px' }}
            itemStyle={{ color: strokeColor, fontWeight: '900', fontSize: '16px' }}
            labelStyle={{ color: '#737373', marginBottom: '8px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '900' }}
            formatter={(value: number) => [formatCurrency(value), 'PRICE']}
            labelFormatter={(label) => format(parseISO(label as string), 'MMM d, yyyy').toUpperCase()}
          />
          <Line 
            type="stepAfter" 
            dataKey="price" 
            stroke={strokeColor} 
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 6, fill: strokeColor, stroke: '#fff', strokeWidth: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
