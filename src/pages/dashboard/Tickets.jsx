import React, { useState, useEffect } from 'react';
import ReusableTable from '../../components/table/ReusableTable';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import "../../style/Style.css";
import { Card } from 'react-bootstrap';

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

  const [projects, setProjects] = useState(() => {
    const stored = localStorage.getItem('ticketTimers');
    if (stored) {
      return JSON.parse(stored);
    }

    return [
      {
        id: 'TKT001',
        assignedDateTime: '2025-07-20 10:00 AM',
        endTimestamp: Date.now() + 2 * 60 * 60 * 1000,
        agent: 'Alice',
        qm: 'John Doe'
      },
      {
        id: 'TKT002',
        assignedDateTime: '2025-07-19 2:30 PM',
        endTimestamp: Date.now() + 3 * 60 * 60 * 1000,
        agent: 'Alice',
        qm: 'John Doe'
      },
      {
        id: 'TKT003',
        assignedDateTime: '2025-07-18 4:45 PM',
        endTimestamp: Date.now() + 30 * 60 * 1000,
        agent: 'Alice',
        qm: 'John Doe'
      },
       {
        id: 'TKT003',
        assignedDateTime: '2025-07-18 4:45 PM',
        endTimestamp: Date.now() + 30 * 60 * 1000,
        agent: 'Snehitha',
        qm: 'John Doe'
      },
      
    ];
  });

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

  const handleDateRangeClick = () => {
    setShowDateRange(!showDateRange);
  };

  const columns = [
    { label: 'S. No', key: 'sno', render: (_, index) => index + 1 },
    { label: 'Ticket ID', key: 'id' },
    { label: 'Assigned Date & Time', key: 'assignedDateTime' },
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
        if (totalSeconds <= 300 && totalSeconds > 0) color = 'orange'; // less than 5 min
        if (totalSeconds === 0) color = 'red';

        return (
          <span style={{ color, fontWeight: 'bold' }}>
            {timeStr}
          </span>
        );
      }
    },
    ...(user?.role !== 1 ? [{ label: 'Name of CM', key: 'qm' }] : []),

    { label: 'Name of AM', key: 'agent' }
  ];

  return (
    <div className="p-4">
      <Card>
        <h1 className="mb-3 fs-1" style={{ fontSize: "16px" }}><strong>Tickets List</strong></h1>
        <small className="mb-3" style={{ fontSize: "16px" }}><strong>Count: {projects.length}</strong></small>

        {/* Filter Buttons */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3 gap-2">
        {user?.role !== 1 && (
            <div className="d-flex gap-3 mt-4 flex-wrap align-items-center" style={{ display: "flex" }}>
              {/* Region Multi-Select Dropdown */}
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

              {/* Date Range Button */}
              <button className="btn btn-outline-secondary" onClick={handleDateRangeClick}>
                Select Date Range
              </button>

              {/* Date Range Pickers */}
              {showDateRange && (
                <div className="d-flex gap-2 align-items-center">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                    className="form-control"
                  />
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="End Date"
                    className="form-control"
                  />
                </div>
              )}
            </div>
          )}

          <div className="d-flex gap-2 mb-5 mt-3" style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary">Download Report</button>
          </div>
        </div>

        <ReusableTable columns={columns} data={projects} />
      </Card>
    </div>
  );
};

export default Tickets;
