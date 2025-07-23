import React, { useState } from 'react';
import ReusableTable from '../../components/table/ReusableTable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "../../style/Style.css";
import { Card } from 'react-bootstrap';

const Tickets = () => {
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
console.log(user?.role);

  const handleDateRangeClick = () => {
    setShowDateRange(!showDateRange);
  };

  const columns = [
    { label: 'S. No', key: 'sno', render: (_, index) => index + 1 },
    { label: 'Ticket ID', key: 'id' },
    { label: 'Assigned Date & Time', key: 'assignedDateTime' },
    { label: 'End Time (As per SLA - Reverse Countdown)', key: 'endTime' },
    // { label: 'Name of QM', key: 'agent' },
     ...(user?.role !== 'cm' ? [{ label: 'Name of CM (assigned by)', key: 'qm' }] : []),
     { label: 'Name of AM', key: 'agent' },
    // {
    //   label: 'Status',
    //   key: 'status',
    //   render: (row) => (
    //     <select className="form-select form-select-sm w-auto mx-auto" defaultValue={row.status}>
    //       <option value="Intern">Intern</option>
    //       <option value="Solution Provided">Solution Provided</option>
    //       <option value="No Action Required">No Action Required</option>
    //       <option value="Need More Information">Need More Information</option>
    //     </select>
    //   )
    // },
    // {
    //   label: 'Action',
    //   key: 'action',
    //   render: () => (
    //     <div className="d-flex justify-content-center align-items-center gap-2" style={{display:"flex"}}>
    //       <button className="btn btn-danger btn-sm">Start</button>
    //       <button className="btn btn-warning btn-sm">Pause</button>
    //       <button className="btn btn-success btn-sm">End</button>
    //     </div>
    //   )
    // }
  ];

  const filteredProjects = [
    {
      id: 'TKT001',
      assignedDateTime: '2025-07-20 10:00 AM',
      endTime: '00:25:00',
      agent: 'Alice',
      qm: 'John Doe',
      status: 'Intern'
    },
    {
      id: 'TKT002',
      assignedDateTime: '2025-07-19 2:30 PM',
      endTime: '00:15:30',
       agent: 'Alice',
       qm: 'John Doe',
      status: 'Solution Provided'
    },
    {
      id: 'TKT003',
      assignedDateTime: '2025-07-18 4:45 PM',
      endTime: '00:00:00',
       agent: 'Alice',
         qm: 'John Doe',
      status: 'No Action Required'
    }
  ];

  return (
    <div className="p-4">
      <Card>
      <h1 className="mb-3 fs-1" style={{fontSize:"16px"}}><strong> Tickets List</strong></h1>
       <small className="mb-3" style={{fontSize:"16px"}}><strong>Count : 3</strong></small>

      {/* Button Section */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-3 gap-2">
        {/* Left Buttons */}
   {/* Left Buttons */}
{user?.role !== "cm" && (
  <div className="d-flex gap-2" style={{ display: "flex" }}>
    <button className="btn btn-outline-secondary">Region</button>
    <button className="btn btn-outline-secondary" onClick={handleDateRangeClick}>
      Select Date Range
    </button>

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


        {/* Right Buttons */}
        <div className="d-flex gap-2 mb-5 mt-3" style={{display:"flex",justifyContent:"flex-end"}}>
          {/* <button className="btn btn-secondary">Upload Jira Report</button> */}
          <button className="btn btn-primary">Download Report</button>
        </div>
      </div>

      {/* Table */}
      <ReusableTable columns={columns} data={filteredProjects} />
      </Card>
    </div>
  );
};

export default Tickets;
