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


  const [globalMetrics, setGlobalMetrics] = useState({
    totalTickets: 0,
    assignedTickets: 0,
    closedTickets: 0,
  });


  
  const handleRegionChange = (selectedOptions) => {
    setSelectedRegions(selectedOptions || []);
    setPage(1); // Reset page to 1
  };
  const handleCmChange = (selectedOptions) => {
    setSelectedCM(selectedOptions || []);
    setPage(1); // Reset page to 1
  };
  const handleTicketIdChange = (selectedOptions) => {
    setSelectedTicketId(selectedOptions || []);
    setPage(1); // Reset page to 1
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
    setPage(1); // Reset page to 1
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
    setPage(1); // Reset page to 1
  };


  const regionOptions = [
    { value: 'EMEA', label: 'EMEA' },
    { value: 'UCAN', label: 'UCAN' },
    { value: 'APAC', label: 'APAC' },
    { value: 'LATAM', label: 'LATAM' }
  ];

  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCM, setSelectedCM] = useState([]); // was null
const [selectedTicketId, setSelectedTicketId] = useState([]); // was null


  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);




  
  useEffect(() => {
    const fetchTickets = async () => {
      const cmRegionList = selectedRegions.map((r) => r.value).join(',');
      const cmNameList = selectedCM.map((c) => c.value).join(',');
      const ticketKeyList = selectedTicketId.map((t) => t.value).join(',');
      const createdFrom = startDate ? startDate.toISOString().split('T')[0] : '';
      const createdTo = endDate ? endDate.toISOString().split('T')[0] : '';

      try {
        const res = await fetch(
          `http://localhost:5000/api/getNetflixTickets?email=saiteja.kunapureddy@mediamint.com&role=0&page=${page}&limit=25&cmRegionList=${cmRegionList}&cmNameList=${cmNameList}&ticketKeyList=${ticketKeyList}&createdFrom=${createdFrom}&createdTo=${createdTo}`
        );
        const json = await res.json();
        if (json.success) {
            setProjects(json.data);s
            setTotalPages(json.totalPages);
            
            // Set the global metrics ONLY if it's the first page and no other filters are active.
            const isFirstLoad = page === 1 && !cmRegionList && !cmNameList && !ticketKeyList && !createdFrom && !createdTo;
            if (isFirstLoad) {
                setGlobalMetrics(json.metrics || { totalTickets: 0, assignedTickets: 0, closedTickets: 0 });
            }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchTickets();
  }, [selectedRegions, selectedCM, selectedTicketId, startDate, endDate, page]); // This hook reacts to all changes






// useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const params = new URLSearchParams({
//           role: user.role,
//           email: user.emailId,
//           page,
//           limit: 25
//         });

//         const cmRegionList = selectedRegions.map((r) => r.value).join(',');
//         const cmNameList = selectedCM.map((c) => c.value).join(',');
//         const ticketKeyList = selectedTicketId.map((t) => t.value).join(',');
//         const createdFrom = startDate ? startDate.toISOString() : '';
//         const createdTo = endDate ? endDate.toISOString() : '';

//         // if (selectedRegions.length) {
//         //   params.append('cmRegionList', selectedRegions.map(r => r.value).join(','));
//         // }
//         // if (selectedCM?.length) {
//         //   params.append('cmNameList', selectedCM.map(c => c.value).join(','));
//         // }
//         // if (selectedTicketId?.length) {
//         //   params.append('ticketIDList', selectedTicketId.map(t => t.value).join(','));
//         // }
//         // if (startDate && endDate) {
//         //   params.append('createdFrom', startDate.toISOString());
//         //   params.append('createdTo', endDate.toISOString());
//         // }
//         // any other filters similarly
//         // const response = await fetch(`http://localhost:5000/api/getNetflixTickets/?page=${page}&email=djavvaji@netflixcontractors.com`);
//         // const response = await fetch(`http://localhost:5000/api/getNetflixTickets/?role=0&email=apanneerselvam@netflixcontractors.com&page=${page}`);
//         // const response = await fetch(`http://localhost:5000/api/getNetflixTickets/?role=0&email=apanneerselvam@netflixcontractors.com&page=1`);

//         const response = await fetch(
//           `http://localhost:5000/api/getNetflixTickets?email=djavvaji@netflixcontractors.com&role=1&page=${page}&limit=25&cmRegionList=${cmRegionList}&cmNameList=${cmNameList}&ticketKeyList=${ticketKeyList}&createdFrom=${createdFrom}&createdTo=${createdTo}`
//         );
//         const { success, data, totalPages: tp, metrics: fetchedMetrics } = await response.json();

//         if (success) {
//           setProjects(data);
//           setTotalPages(tp);
//           setMetrics(fetchedMetrics || { totalTickets: 0, assignedTickets: 0, closedTickets: 0 });

//         }
//       } catch (err) {
//         console.error("Error fetching tickets:", err);
//       }
//     };
//     fetchTickets();
//   }, [page,selectedRegions, selectedCM, selectedTicketId, startDate, endDate]);
  // page, selectedRegions, selectedCM, selectedTicketId, startDate, endDate, user

  // useEffect(() => {
  //   const cmRegionList = selectedRegions.map((r) => r.value).join(',');
  //   const cmNameList = selectedCM.map((c) => c.value).join(',');
  //   const ticketKeys = selectedTicketId.map((t) => t.value).join(',');
  //   const createdFrom = startDate ? startDate.toISOString() : '';
  //   const createdTo = endDate ? endDate.toISOString() : '';
    
  
  //   const fetchTickets = async () => {
  //     try {
  //       const res = await fetch(
  //         `http://localhost:5000/api/getNetflixTickets?email=djavvaji@netflixcontractors.com&role=1&page=${page}&limit=25&cmRegionList=${cmRegionList}&cmNameList=${cmNameList}&ticketKeys=${ticketKeys}&createdFrom=${createdFrom}&createdTo=${createdTo}`
  //       );
  //       const json = await res.json();
  //       if (json.success) {
  //         setProjects(json.data);
  //         setTotalPages(json.totalPages);
  //         setMetrics(json.metrics || {});
  //       } else {
  //         console.error('API error:', json.error);
  //       }
  //     } catch (err) {
  //       console.error('Fetch error:', err);
  //     }
  //   };
  
  //   fetchTickets();
  // }, [selectedRegions, selectedCM, selectedTicketId, startDate, endDate, page]);
  
//   useEffect(() => {
//     // This function will run whenever any filter or the page number changes.
//     const fetchFilteredTickets = async () => {
//       try {
//         // 1. Build the query parameters from your state
//         const cmRegionList = selectedRegions.map((r) => r.value).join(',');
//         const cmNameList = selectedCM.map((c) => c.value).join(',');
//         const ticketKeyList = selectedTicketId.map((t) => t.value).join(',');
//         const createdFrom = startDate ? startDate.toISOString() : '';
//         const createdTo = endDate ? endDate.toISOString() : '';

//         // 2. Make a single API call with all the current filters and page number
//         const res = await fetch(
//           `http://localhost:5000/api/getNetflixTickets?email=djavvaji@netflixcontractors.com&role=1&page=${page}&limit=25&cmRegionList=${cmRegionList}&cmNameList=${cmNameList}&ticketKeyList=${ticketKeyList}&createdFrom=${createdFrom}&createdTo=${createdTo}`
//         );
//         const json = await res.json();
        
//         // 3. Update your UI state with the results from the API
//         if (json.success) {
//           setProjects(json.data);
//           setTotalPages(json.totalPages);
//           setMetrics(json.metrics || {});
//         } else {
//           console.error('API error:', json.error);
//         }
//       } catch (err) {
//         console.error('Fetch error:', err);
//       }
//     };

//     fetchFilteredTickets(); // Execute the fetch
//  }, [selectedRegions, selectedCM, selectedTicketId, startDate, endDate, page]); // The dependency array

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

        newTimers[proj.ticketKey] = `${hrs}:${mins}:${secs}`;
      });

      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [projects]);

  // const totalTickets = projects.length;
  // const assignedCount = projects.filter(p => p.status === 'Assigned').length;
  // const closedCount = projects.filter(p => p.status === 'Closed').length;
  const [assignedCount, setAssignedCount] = useState(0);
const [closedCount, setClosedCount] = useState(0);
const [totalCount, setTotalCount] = useState(0);

const [metrics, setMetrics] = useState({
  totalTickets: 0,
  assignedTickets: 0,
  closedTickets: 0
});



useEffect(() => {
  setTotalCount(projects.length);
  setAssignedCount(projects.filter(item => item.status === "Assigned").length);
  setClosedCount(projects.filter(item => item.status === "Closed").length);
}, [projects]);

const [dropdownData, setDropdownData] = useState([]);
useEffect(() => {
  const fetchDropdownData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dropdown");
      const json = await res.json();
      if (json.success) {
        setDropdownData(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch dropdown data", err);
    }
  };

  fetchDropdownData();
}, []);

  const columns = [
    // {
    //   label: 'S. No',
    //   key: 'sno',
    //   render: (_, index) => index + 1
    // },
    {
      label: 'Ticket ID',
      key: 'ticketKey',  // match your data field
      render: (row) => {
        const timeStr = timers[row.id] || '00:00:00';
        const [h, m, s] = timeStr.split(':').map(Number);
        const totalSeconds = h * 3600 + m * 60 + s;
    
        let badgeClass = 'bg-success';
        if (totalSeconds <= 1800 && totalSeconds > 600) badgeClass = 'bg-warning text-dark';
        if (totalSeconds <= 600) badgeClass = 'bg-danger';
    
    
        return (
          <span className={`badge ${badgeClass}`} style={{ fontSize: '0.9rem' }}>
           {row.ticketKey}
          </span>
        );
      }
    },
    {
      label: 'Assigned Date & Time',
      key: 'created'
    },
    {
      label: (
        <div>
          End Time <br />
          <small style={{ fontWeight: 'normal' }}>(As per SLA - Reverse Countdown)</small>
        </div>
      ),
      key: 'SLA',
      render: (row) => {
        const timeStr = timers[row.ticketKey] || '00:00:00';
        const [h, m, s] = timeStr.split(':').map(Number);
        const totalSeconds = h * 3600 + m * 60 + s;

        let color = 'green';
        if (totalSeconds <= 2700 && totalSeconds > 1800) color = 'orange';
        if (totalSeconds <= 1800) color = 'red';


        return <span style={{ color, fontWeight: 'bold' }}>{timeStr}</span>;
      }
    },
    ...(user?.role !== 'cm' ? [{ label: 'Name of CM', key: 'CM_name' }] : []),
    {
      label: 'Name of AM',
      key: 'AM_name'
    },
    {
      label: 'Region',
      key: 'cm_region'
    },
    {
      label: 'Status',
      key: 'Status',
      render: (row) => {
        const isCM = user?.role === 'cm';
    
        return (
          <Select
            options={[
              { value: 'Interim', label: 'Interim' },
              { value: 'Solution Provided', label: 'Solution Provided' },
              { value: 'Need More Information', label: 'Need More Information' },
              { value: 'Closed', label: 'Closed' },
              {value:'Sent to VAO', label:'Sent to VAO'}
            ]}
            value={row.status ? { label: row.status, value: row.status } : null}

            isDisabled={!isCM}
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
            onChange={async (selectedOption) => {
              if (isCM && selectedOption?.value) {
                try {
                  const response = await fetch(
                    `http://localhost:5000/api/updateTicketByKey/${row.ticketKey}`,
                    {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ status: selectedOption.value })
                    }
                  );
    
                  const result = await response.json();
                  if (result.success) {
                    console.log('✅ Status updated:', selectedOption.value);
    
                    // Optionally: Refresh data
                    setProjects((prev) =>
                      prev.map((p) =>
                        p.ticketKey === row.ticketKey
                          ? { ...p, status: selectedOption.value }
                          : p
                      )
                    );
                  } else {
                    console.error('❌ Failed to update status:', result.error);
                  }
                } catch (err) {
                  console.error('⛔ Error updating status:', err);
                }
              }
            }}
          />
        );
      }
    }
,    
    ...(user?.role === 'cm'
      ? [
        
          {
            label: 'Actions',
            key: 'actions',
            render: () => (
              <div className="d-flex gap-2" style={{ display: "flex" }}>
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="fs-1 mb-0" style={{ fontSize: "16px" }}>
            <strong>Tickets List</strong>
          </h1>
          {/* <button className="btn btn-success" style={{ fontSize: "16px", padding: "6px 12px" }}>
            <strong>Count: {projects.length}</strong>
          </button> */}
        </div>

        {/* Count Cards */}
        <div className="d-flex flex-wrap gap-3 mb-4" style={{display:"flex"}}>
          <div className="card text-white bg-warning p-3" style={{ minWidth: 180,display:"flex" }}>
            <h6>Total Tickets :</h6>
            <h4 style={{fontWeight:"bold",fontSize:"1.2rem"}}> {globalMetrics.totalTickets}</h4>
          </div>
          <div className="card text-white bg-danger p-3" style={{ minWidth: 180,display:"flex" }}>
            <h6>Assigned Tickets :</h6>
            <h4 style={{fontWeight:"bold",fontSize:"1.2rem"}}>  {globalMetrics.assignedTickets}</h4>
          </div>
          <div className="card text-white bg-success p-3" style={{ minWidth: 180,display:"flex" }}>
          <h6>Closed Tickets :</h6>
            <h4 style={{fontWeight:"bold",fontSize:"1.2rem"}}> {globalMetrics.closedTickets}</h4>
          </div>
        </div>

        {/* Filter Section */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3 gap-2">
          <div className="d-flex gap-3 mt-4 flex-wrap align-items-center" style={{display:"flex"}}>
          {user?.role !== 'cm' && (
            <div style={{ minWidth: 200 }}>
              <Select
                isMulti 
                options={regionOptions}
                value={selectedRegions}
                onChange={handleRegionChange}
                placeholder="Select Region(s)"
                classNamePrefix="react-select"
              />
              
            </div>
              )}
            {user?.role !== "cm" && (
              <>
                <div style={{ minWidth: 200 }}>
                  <Select
                    isClearable
                    isMulti
                    options={Array.from(
                      new Set(dropdownData.map(item => item.ticketname))
                    ).map(name => ({ value: name, label: name }))}
                    placeholder="Select CM"
                    value={selectedCM}
                    onChange={handleCmChange}
                  />
                </div>

                <div style={{ minWidth: 200 }}>
                  <Select
                    isClearable
                    isMulti
                    options={dropdownData.map(item => ({
                      value: item.ticketkey,
                      label: item.ticketkey
                    }))}
                    placeholder="Select Ticket ID"
                    value={selectedTicketId}
                    onChange={handleTicketIdChange}
                  />
                </div>
                  <div className="form-group pe-3 flex">
              <label htmlFor="fromDate" className="mb-1 " style={{display:"flex",alignItems:"center"}}><strong>From Date : </strong></label>
              <input
                type="date"
                id="fromDate"
                className="form-control p-2 ms-1"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                 onChange={(e) => handleStartDateChange(e.target.value ? new Date(e.target.value) : null)}
                max={new Date().toISOString().split('T')[0]}

                
              />
            </div>
            <div className="form-group pe-3 flex">
              <label htmlFor="toDate" className="mb-1" style={{display:"flex",alignItems:"center"}}><strong>To Date : </strong></label>
              <input
                type="date"
                id="toDate"
                className="form-control p-2 ms-1"
                min={startDate ? startDate.toISOString().split('T')[0] : ''}
                max={new Date().toISOString().split('T')[0]}
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleEndDateChange(e.target.value ? new Date(e.target.value) : null)}
              />
            </div>
              </>
            )}
          </div>

          {/* Date Range Filters */}
          <div className="flex gap-4 py-3 px-2">
          
          </div>
        </div>

        {/* Download Button */}
        <div className="d-flex gap-2 mb-5 mt-3" style={{ justifyContent: "flex-end",display:"flex" }}>
          <button
            className="d-flex align-items-center gap-2"
            style={{
              background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              display:"flex"
            }}
          >
            <Download size={16} />
            Download Report
          </button>
        </div>

        <ReusableTable columns={columns} data={projects} />
        <div className="d-flex justify-content-between align-items-center mt-4">
  {/* <button
    className="btn btn-outline-primary"
    onClick={() => setPage((p) => Math.max(p - 1, 1))}
    disabled={page === 1}
  >
    Prev
  </button>
  
  <span className="mx-3">
    Page <strong>{page}</strong> of <strong>{totalPages}</strong>
  </span>

  <button
    className="btn btn-outline-primary"
    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={page === totalPages}
  >
    Next
  </button> */}

<button className="btn btn-outline-primary" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>Prev</button>
<span className="mx-3"> Page <strong>{page}</strong> of <strong>{totalPages}</strong> </span>
<button className="btn btn-outline-primary" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next</button>
</div>

      </Card> 
    </div>
  );
};

export default Tickets;
