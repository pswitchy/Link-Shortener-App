import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Sector // Import PieChart components
} from 'recharts';

// Helper function for Pie chart active shape (optional enhancement)
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector // Outer ring for highlight
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} clicks`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const AnalyticsCharts = ({ analyticsData }) => {
  const {
    totalClicks = 0,
    clicksOverTime = [], // Expected format: [{ date: 'YYYY-MM-DD', count: N }, ...]
    deviceBreakdown = [], // Expected format: [{ name: 'Device', count: N }, ...]
    browserBreakdown = [], // Expected format: [{ name: 'Browser', count: N }, ...]
    osBreakdown = [] // Expected format: [{ name: 'OS', count: N }, ...]
  } = analyticsData || {};

  // Colors for Pie charts
  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

   // State for active pie slice index (optional interaction)
  const [activeIndexDevice, setActiveIndexDevice] = React.useState(0);
  const [activeIndexBrowser, setActiveIndexBrowser] = React.useState(0);
  const [activeIndexOS, setActiveIndexOS] = React.useState(0);

  const onPieEnter = React.useCallback(
        (_, index, setter) => {
        setter(index);
        },
        []
   );

   // Prepare data for charts (ensure count is numeric)
   const formattedClicksOverTime = clicksOverTime.map(d => ({ ...d, count: Number(d.count) }));
   const formattedDeviceData = deviceBreakdown.map(d => ({ ...d, count: Number(d.count), value: Number(d.count) })); // 'value' needed for Pie
   const formattedBrowserData = browserBreakdown.map(d => ({ ...d, count: Number(d.count), value: Number(d.count) }));
   const formattedOSData = osBreakdown.map(d => ({ ...d, count: Number(d.count), value: Number(d.count) }));

  return (
    <div className="space-y-8">
      <h4 className="text-md font-semibold text-gray-800 border-b pb-2">Link Analytics (Total Clicks: {totalClicks})</h4>

      {/* Clicks Over Time Chart */}
      {formattedClicksOverTime.length > 0 && (
         <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Clicks Over Time</h5>
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedClicksOverTime} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="count" name="Clicks" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
            </ResponsiveContainer>
         </div>
      )}

      {/* Breakdown Charts (Device, Browser, OS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Device Breakdown Pie Chart */}
        {formattedDeviceData.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2 text-center">Device Types</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  activeIndex={activeIndexDevice}
                  activeShape={renderActiveShape}
                  data={formattedDeviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value" // Use 'value' which we mapped
                  onMouseEnter={(_, index) => onPieEnter(_, index, setActiveIndexDevice)}
                >
                  {formattedDeviceData.map((entry, index) => (
                    <Cell key={`cell-device-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                 <Tooltip formatter={(value, name) => [`${value} clicks`, name]}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Browser Breakdown Pie Chart */}
        {formattedBrowserData.length > 0 && (
           <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2 text-center">Browsers</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                 activeIndex={activeIndexBrowser}
                 activeShape={renderActiveShape}
                  data={formattedBrowserData}
                   cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  fill="#00C49F"
                  dataKey="value"
                   onMouseEnter={(_, index) => onPieEnter(_, index, setActiveIndexBrowser)}
                >
                  {formattedBrowserData.map((entry, index) => (
                    <Cell key={`cell-browser-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                 <Tooltip formatter={(value, name) => [`${value} clicks`, name]}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

         {/* OS Breakdown Pie Chart */}
         {formattedOSData.length > 0 && (
           <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2 text-center">Operating Systems</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                 activeIndex={activeIndexOS}
                 activeShape={renderActiveShape}
                  data={formattedOSData}
                   cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  fill="#FFBB28"
                  dataKey="value"
                  onMouseEnter={(_, index) => onPieEnter(_, index, setActiveIndexOS)}
                >
                  {formattedOSData.map((entry, index) => (
                    <Cell key={`cell-os-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                 <Tooltip formatter={(value, name) => [`${value} clicks`, name]}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

       {/* Show message if no analytics data available yet */}
       {totalClicks === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No click data available for this link yet.</p>
       )}
    </div>
  );
};

export default AnalyticsCharts;