import React, { useState, useEffect } from 'react';
import ReusableTable from '../../components/table/ReusableTable';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import "../../style/Style.css";
import { Card } from 'react-bootstrap';
import { Download } from 'lucide-react';

const Tickets = () => {
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const regionOptions = [
    { value: 'EMEA', label: 'EMEA' },
    { value: 'UCAN', label: 'UCAN' },
    { value: 'APAC', label: 'APAC' },
    { value: 'LATAM', label: 'LATAM' }
  ];

  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCM, setSelectedCM] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [projects, setProjects] = useState([
    {
      id: 'TKT001',
      assignedDateTime: '2025-07-20 10:00 AM',
      endTimestamp: Date.now() + 2 * 60 * 60 * 1000,
      agent: 'Alice',
      qm: 'John Doe',
      region: 'EMEA'
    },
    {
      id: 'TKT002',
      assignedDateTime: '2025-07-19 2:30 PM',
      endTimestamp: Date.now() + 25 * 60 * 1000,
      agent: 'Alice',
      qm: 'John Doe',
      region: 'EMEA'
    },
    {
      id: 'TKT005',
      assignedDateTime: '2025-07-18 4:45 PM',
      endTimestamp: Date.now() + 9 * 60 * 1000,
      agent: 'Alice',
      qm: 'John Doe',
      region: 'EMEA'
    }
  ]);

  useEffect(() => {
    localStorage.setItem('ticketTimers', JSON.stringify(projects));
  }, [projects]);

  const [timers, setTimers] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};

      projects.forEach((proj) => {
        const diff = proj.endTimestamp - Date.now();
        const totalSeconds = Math.max(0, Math.floor(diff / 1000));
        const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');

        newTimers[proj.id] = `${hrs}:${mins}:${secs}`;
      });

      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [projects]);

  const columns = [
    {
      label: 'S. No',
      key: 'sno',
      render: (_, index) => index + 1
    },
    {
      label: 'Ticket ID',
      key: 'id',
      render: (row) => {
        const timeStr = timers[row.id] || '00:00:00';
        const [h, m, s] = timeStr.split(':').map(Number);
        const totalSeconds = h * 3600 + m * 60 + s;

        let badgeClass = 'bg-success';
        if (totalSeconds <= 1800 && totalSeconds > 600) badgeClass = 'bg-warning text-dark';
        if (totalSeconds <= 600) badgeClass = 'bg-danger';

        return (
          <span className={`badge ${badgeClass}`} style={{ fontSize: '0.9rem' }}>
            {row.id}
          </span>
        );
      }
    },
    {
      label: 'Assigned Date & Time',
      key: 'assignedDateTime'
    },
    {
      label: (
        <div>
          End Time <br />
          <small style={{ fontWeight: 'normal' }}>(As per SLA - Reverse Countdown)</small>
        </div>
      ),
      key: 'endTime',
      render: (row) => {
        const timeStr = timers[row.id] || '00:00:00';
        const [h, m, s] = timeStr.split(':').map(Number);
        const totalSeconds = h * 3600 + m * 60 + s;

        let color = 'green';
        if (totalSeconds <= 1800 && totalSeconds > 600) color = 'orange';
        if (totalSeconds <= 600) color = 'red';

        return <span style={{ color, fontWeight: 'bold' }}>{timeStr}</span>;
      }
    },
    ...(user?.role !== 'cm' ? [{ label: 'Name of CM', key: 'qm' }] : []),
    {
      label: 'Name of AM',
      key: 'agent'
    },
    {
      label: 'Region',
      key: 'region'
    },
    ...(user?.role === 'cm'
      ? [
          {
            label: 'Status',
            key: 'status',
            render: () => (
              <Select
                options={[
                  { value: 'Interim', label: 'Interim' },
                  { value: 'Solution Provided', label: 'Solution Provided' }
                ]}
                classNamePrefix="react-select"
                placeholder="Select Status"
                isClearable
                styles={{
                  container: (base) => ({
                    ...base,
                    minWidth: 180
                  }),
                  menu: (provided) => ({ ...provided, zIndex: 9999 })
                }}
              />
            )
          },
          {
            label: 'Actions',
            key: 'actions',
            render: () => (
              <div className="d-flex gap-2" style={{display:"flex"}}>
                <button className="btn btn-sm btn-success">Start</button>
                <button className="btn btn-sm btn-danger">End</button>
              </div>
            )
          }
        ]
      : [])
  ];

  return (
    <div className="p-4">
      <Card>
  <div className="d-flex justify-content-between align-items-center mb-3" style={{display:"flex",justifyContent:"space-between"}}>
  <h1 className="fs-1 mb-0" style={{ fontSize: "16px" }}>
    <strong>Tickets List</strong>
  </h1>

  <button
    className="btn btn-success"
    style={{ fontSize: "16px", padding: "6px 12px" }}
  >
    <strong>Count: {projects.length}</strong>
  </button>
</div>


        {/* Filter Section */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3 gap-2">
          <div className="d-flex gap-3 mt-4 flex-wrap align-items-center" style={{ display: "flex" }}>
            <div style={{ minWidth: 200 }}>
              <Select
                isMulti
                options={regionOptions}
                value={selectedRegions}
                onChange={setSelectedRegions}
                placeholder="Select Region(s)"
                classNamePrefix="react-select"
              />
            </div>

            {user?.role !== "cm" && (
              <>
                <div style={{ minWidth: 200 }}>
                  <Select
                    isClearable
                    isMulti
                    options={[
                      { value: 'John Doe', label: 'John Doe' },
                      { value: 'Jane Smith', label: 'Jane Smith' },
                      { value: 'Rahul Kumar', label: 'Rahul Kumar' }
                    ]}
                    placeholder="Select CM"
                    value={selectedCM}
                    onChange={setSelectedCM}
                  />
                </div>

                <div style={{ minWidth: 200 }}>
                  <Select
                    isClearable
                    isMulti
                    options={projects.map((proj) => ({ value: proj.id, label: proj.id }))}
                    placeholder="Select Ticket ID"
                    value={selectedTicketId}
                    onChange={setSelectedTicketId}
                  />
                </div>
              </>
            )}
          </div>

          {/* Date Range Filters */}
          <div className="d-flex gap-4 py-3 px-2" style={{ display: "flex" }}>
            <div className="form-group pe-3">
              <label htmlFor="fromDate" className="mb-1"><strong>From Date</strong></label>
              <input
                type="date"
                id="fromDate"
                className="form-control p-2"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </div>
            <div className="form-group pe-3">
              <label htmlFor="toDate" className="mb-1"><strong>To Date</strong></label>
              <input
                type="date"
                id="toDate"
                className="form-control p-2"
                min={startDate ? startDate.toISOString().split('T')[0] : ''}
                max={new Date().toISOString().split('T')[0]}
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="d-flex gap-2 mb-5 mt-3" style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="d-flex align-items-center gap-2"
            style={{
              background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              display: "flex"
            }}
          >
            <Download size={16} />
            Download Report
          </button>
        </div>

        <ReusableTable columns={columns} data={projects} />
      </Card>
    </div>
  );
};

export default Tickets;
