import React, { useState } from 'react';
import IndiaMap from './IndiaMap';
import { nationalData, getStateData } from './mockData';
import { ArrowLeft } from 'lucide-react';
import { 
  CultivationDonut, 
  LandOwnershipDonut, 
  MspPayablePaidBar, 
  AvgTimeMspBar, 
  StateProcurementBar, 
  CmrStatusBar, 
  ProcurementTrendLine 
} from './DashboardCharts';

function KpiCard({ icon, title, mainLabel, mainValue, subLabel, subValue, colorClass }) {
  return (
    <div className={`kpi-card ${colorClass}`}>
      <span>{icon}</span>
      <b>{title}</b>
      <div>
        <small>{mainLabel}</small>
        <strong>{mainValue}</strong>
      </div>
      <div>
        <small>{subLabel}</small>
        <strong>{subValue}</strong>
      </div>
    </div>
  );
}

export default function ProcurementDashboard({ hi }) {
  const [selectedState, setSelectedState] = useState(null);

  const data = selectedState ? getStateData(selectedState) : nationalData;

  const title = selectedState 
    ? (hi ? `${selectedState} उपार्जन डैशबोर्ड` : `${selectedState} Procurement Dashboard`)
    : (hi ? "राष्ट्रीय उपार्जन डैशबोर्ड" : "National Procurement Dashboard");

  return (
    <section className="portal-graphics">
      <div className="graphics-heading">
        <div>
          <span className="eyebrow">{hi ? "लाइव सरकारी आंकड़े" : "LIVE GOVERNMENT VIEW"}</span>
          <h2>{title}</h2>
        </div>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            {selectedState && (
            <button 
                className="outline" 
                onClick={() => setSelectedState(null)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
                <ArrowLeft size={16} /> {hi ? "राष्ट्रीय दृश्य पर वापस" : "Back to National View"}
            </button>
            )}
            <span className="refresh-chip">{hi ? "अंतिम अपडेट: आज 08:00" : "Last refreshed: Today 08:00"}</span>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Left side: Season Info */}
        <div className="season-info">
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            <span style={{ color: 'var(--orange)', fontSize: '14px', textTransform: 'uppercase', fontWeight: 'bold' }}>
              {hi ? "वर्तमान सीजन" : "Current Season"}
            </span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: 'var(--white)' }}>
               {selectedState ? data.season : "KMS (2025-2026) Paddy - Rabi"}
            </h3>
            <p style={{ margin: '0', fontSize: '14px', color: 'var(--white)' }}>
               {selectedState ? data.dateRange : "01-Sep-2025 to 31-Aug-2026"}
            </p>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <div className="status-legend" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#4ade80' }}></i> {hi ? "उपार्जन चालू" : "Procuring"}</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#94a3b8' }}></i> {hi ? "रिपोर्टिंग" : "Reporting"}</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f87171' }}></i> {hi ? "बंद" : "Not Reporting"}</div>
            </div>
          </div>
        </div>

        {/* Right side: Map or empty space */}
        <div className="map-container">
          {!selectedState ? (
             <>
               <h4 style={{position: 'absolute', top: '10px', left: '20px', margin: 0, color: '#475569'}}>{hi ? "भारत का नक्शा" : "India Map"}</h4>
               <IndiaMap onStateClick={setSelectedState} hi={hi} />
             </>
          ) : (
             <div style={{ textAlign: 'center', color: '#64748b' }}>
                <h2 style={{fontSize: '24px', margin: '0 0 10px 0'}}>{selectedState}</h2>
                <p>{hi ? "राज्य-विशिष्ट डेटा नीचे प्रदर्शित किया गया है" : "State-specific data is displayed below"}</p>
             </div>
          )}
        </div>
      </div>

      <div className="kpi-grid">
        <KpiCard 
          colorClass="kpi-light-orange" icon="♙" 
          title={hi ? "किसानों की संख्या" : "Number of Farmers"}
          mainLabel={hi ? "पंजीकृत" : "Registered"} mainValue={data.registeredFarmers}
          subLabel={hi ? "लेनदेन" : "Transacted"} subValue={data.transactedFarmers} 
        />
        <KpiCard 
          colorClass="kpi-light-green" icon="🌾" 
          title={hi ? "उपार्जन (MTs)" : "Procurement (MTs)"}
          mainLabel={hi ? "अनुमानित" : "Estimate Rice"} mainValue={data.estimateRice}
          subLabel={hi ? "धान उपार्जित" : "Paddy Procured"} subValue={data.paddyProcured} 
        />
        <KpiCard 
          colorClass="kpi-light-blue" icon="₹" 
          title={hi ? "MSP भुगतान (करोड़ में)" : "MSP Payment (Rs. in Cr.)"}
          mainLabel="MSP Payable" mainValue={data.mspPayable}
          subLabel="MSP Paid" subValue={data.mspPaid} 
        />
        <KpiCard 
          colorClass="kpi-light-orange" icon="🌍" 
          title={hi ? "किसान लेनदेन" : "Farmer's Transactions (No.)"}
          mainLabel="Transacted" mainValue={data.transactions}
          subLabel="MSP Paid To" subValue={data.mspPaidTo} 
        />
        <KpiCard 
          colorClass="kpi-light-green" icon="🏢" 
          title={hi ? "उपार्जन केंद्र" : "Procurement Centres (No.)"}
          mainLabel="Planned" mainValue={data.centresPlanned}
          subLabel="Transacted" subValue={data.centresTransacted} 
        />
        <KpiCard 
          colorClass="kpi-light-blue" icon="🏛️" 
          title={hi ? "उपार्जन एजेंसियां" : "Procuring Agencies (No.)"}
          mainLabel="Planned" mainValue={data.agenciesPlanned}
          subLabel="Transacted" subValue={data.agenciesTransacted} 
        />
      </div>

      <div className="chart-grid-two">
         <div className="kpi-card kpi-navy">
            <span style={{marginBottom: '10px'}}>📦</span>
            <b style={{marginBottom: '15px'}}>{hi ? "पूल-वार स्टॉक (MTs)" : "Pool-wise Stock (MTs)"}</b>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 'auto'}}>
                <div>
                    <small style={{display: 'block', color: 'var(--white)'}}>{hi ? "केंद्रीय पूल" : "Central Pool"}</small>
                    <strong style={{fontSize: '18px', color: 'var(--white)'}}>{data.centralPool}</strong>
                </div>
                <div>
                    <small style={{display: 'block', color: 'var(--white)'}}>{hi ? "राज्य पूल" : "State Pool"}</small>
                    <strong style={{fontSize: '18px', color: 'var(--white)'}}>{data.statePool}</strong>
                </div>
            </div>
         </div>
         <div className="kpi-card kpi-green">
            <span style={{marginBottom: '10px'}}>📅</span>
            <b style={{marginBottom: '15px'}}>{hi ? "अंतिम लेनदेन तिथि" : "Last Transacted Date"}</b>
            <div style={{display: 'flex', flexDirection: 'column', gap: '5px', marginTop: 'auto', fontSize: '13px', color: 'var(--white)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '4px'}}>
                    <span>{hi ? "किसान पंजीकरण" : "Farmers Registration"}</span>
                    <span>{data.lastTransactedDate.registration}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '4px', paddingTop: '4px'}}>
                    <span>{hi ? "उपार्जन" : "Procurement"}</span>
                    <span>{data.lastTransactedDate.procurement}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: '4px'}}>
                    <span>{hi ? "MSP भुगतान" : "MSP Payment"}</span>
                    <span>{data.lastTransactedDate.mspPayment}</span>
                </div>
            </div>
         </div>
      </div>

      <div className="interactive-charts-section" style={{marginTop: '30px'}}>
        <h2 style={{fontSize: '20px', color: '#0f172a', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #e2e8f0'}}>
          {hi ? "विश्लेषणात्मक डैशबोर्ड" : "Analytical Dashboard"}
        </h2>
        
        <div className="analytics-grid">
          <CultivationDonut data={data.cultivationData} hi={hi} />
          <LandOwnershipDonut data={data.landOwnershipData} hi={hi} />
        </div>
        
        <div className="analytics-grid">
          <MspPayablePaidBar data={data.mspComparisonData} hi={hi} />
          <AvgTimeMspBar data={data.avgTimeMspData} hi={hi} />
        </div>
        
        <div className="analytics-grid">
          <StateProcurementBar data={data.stateProcurementData} hi={hi} />
        </div>
        
        <div className="analytics-grid full-width">
          <CmrStatusBar data={data.cmrStatusData} hi={hi} />
          <ProcurementTrendLine data={data.procurementTrendData} hi={hi} />
        </div>
      </div>
    </section>
  );
}
