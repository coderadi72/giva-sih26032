import React from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line 
} from 'recharts';

// Colors for standard use
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function CultivationDonut({ data, hi }) {
  if (!data) return null;
  return (
    <div className="chart-card kpi-card">
      <h3 style={{fontSize: '16px', marginBottom: '15px'}}>{hi ? "किसान - खेती श्रेणी" : "Farmers - Cultivation Category"}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => new Intl.NumberFormat('en-IN').format(value)} />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function LandOwnershipDonut({ data, hi }) {
  if (!data) return null;
  return (
    <div className="chart-card kpi-card">
      <h3 style={{fontSize: '16px', marginBottom: '15px'}}>{hi ? "किसानों की संख्या (भूमि स्वामित्व)" : "No. of Farmers (Land Ownership Category)"}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={0} // Makes it a pie chart as requested by second screenshot
              outerRadius={100}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => new Intl.NumberFormat('en-IN').format(value)} />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function MspPayablePaidBar({ data, hi }) {
  if (!data) return null;
  return (
    <div className="chart-card kpi-card">
      <h3 style={{fontSize: '16px', marginBottom: '15px'}}>{hi ? "MSP देय बनाम MSP भुगतान" : "MSP Payable vs MSP Paid"}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(val) => (val >= 100000 ? (val/100000).toFixed(1) + 'L' : val)}/>
            <Tooltip formatter={(value) => new Intl.NumberFormat('en-IN').format(value)} />
            <Legend />
            <Bar dataKey="payable" name={hi ? "MSP देय" : "MSP Payable"} fill="#3b82f6" />
            <Bar dataKey="paid" name={hi ? "MSP भुगतान" : "MSP Paid"} fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AvgTimeMspBar({ data, hi }) {
  if (!data) return null;
  return (
    <div className="chart-card kpi-card">
      <h3 style={{fontSize: '16px', marginBottom: '15px'}}>{hi ? "MSP भुगतान के लिए औसत समय" : "Average Time Taken for MSP Payment"}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="days" name={hi ? "दिनों में औसत समय" : "Average Day of MSP Payment"} fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function StateProcurementBar({ data, hi }) {
  if (!data) return null;
  return (
    <div className="chart-card kpi-card">
      <h3 style={{fontSize: '16px', marginBottom: '15px'}}>{hi ? "राज्य-वार उपार्जन" : "State-wise Procurement"}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(val) => (val >= 100000 ? (val/100000).toFixed(1) + 'L' : val)} />
            <Tooltip formatter={(value) => new Intl.NumberFormat('en-IN').format(value)} />
            <Legend />
            <Bar dataKey="quantity" name={hi ? "मात्रा (MTs)" : "Quantity (in MTs)"} fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CmrStatusBar({ data, hi }) {
  if (!data) return null;
  return (
    <div className="chart-card kpi-card" style={{gridColumn: '1 / -1'}}>
      <h3 style={{fontSize: '16px', marginBottom: '15px'}}>{hi ? "राज्य-वार CMR स्थिति" : "State-wise CMR Status"}</h3>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(val) => (val >= 100000 ? (val/100000).toFixed(1) + 'L' : val)} />
            <Tooltip formatter={(value) => new Intl.NumberFormat('en-IN').format(value)} />
            <Legend />
            <Bar dataKey="procured" name={hi ? "धान उपार्जित" : "Paddy Procured"} fill="#3b82f6" />
            <Bar dataKey="dispatched" name={hi ? "धान डिस्पैच" : "Paddy Dispatched"} fill="#10b981" />
            <Bar dataKey="due" name={hi ? "CMR देय" : "CMR Due"} fill="#f59e0b" />
            <Bar dataKey="received" name={hi ? "CMR प्राप्त" : "CMR Received"} fill="#ef4444" />
            <Bar dataKey="yetToReceive" name={hi ? "CMR प्राप्त होना बाकी" : "CMR Yet to be Received"} fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ProcurementTrendLine({ data, hi }) {
  if (!data) return null;
  return (
    <div className="chart-card kpi-card" style={{gridColumn: '1 / -1'}}>
      <h3 style={{fontSize: '16px', marginBottom: '15px'}}>{hi ? "उपार्जन मात्रा का रुझान" : "Procurement Quantity - This Day"}</h3>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="25-26" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="24-25" stroke="#06b6d4" strokeWidth={2} />
            <Line type="monotone" dataKey="23-24" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="22-23" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
