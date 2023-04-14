import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const VoteChart = ({ data }) => {
  const adjustedData = data.map((item) => ({
    ...item,
    optionIndex: item.optionIndex + 1,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <BarChart
        width={600}
        height={300}
        data={adjustedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="optionIndex" label={{ value: 'Team', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Number of votes', angle: -90, position: 'insideLeft', offset: 10 }} />
        <Tooltip />
        <Legend payload={[]} />
        <Bar dataKey="totalTokens" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default VoteChart;
