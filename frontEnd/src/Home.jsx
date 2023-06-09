import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import OrderKeyParsing from './OrderKeyParsing';

function Home() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [newData, setNewData] = useState({
    id: '',
    shiptoname: '',
    address: '',
    remarks: '',
    area: ''
  });
  const [editData, setEditData] = useState(null);

  const rowsPerPage = 4;
  const paginationRange = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get('http://localhost:8081/')
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };

  const filteredData = data.filter((route) => {
    return (
      route.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.shiptoname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.remarks.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCreateNewData = () => {
    axios
      .post('http://localhost:8081/route', newData)
      .then((res) => {
        fetchData();
        setNewData({
          id: '',
          shiptoname: '',
          address: '',
          remarks: '',
          area: ''
        });
      })
      .catch((err) => console.log(err));
  };

  const handleEditData = (route) => {
    setEditData(route);
    setNewData({
      id: route.id,
      shiptoname: route.shiptoname,
      address: route.address,
      remarks: route.remarks,
      area: route.area
    });
  };

  const handleUpdateData = () => {
    axios
      .put(`http://localhost:8081/route/${newData.id}`, newData)
      .then((res) => {
        fetchData();
        setEditData(null);
        setNewData({
          id: '',
          shiptoname: '',
          address: '',
          remarks: '',
          area: ''
        });
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteData = (id) => {
    axios
      .delete(`http://localhost:8081/route/${id}`)
      .then((res) => {
        fetchData();
      })
      .catch((err) => console.log(err));
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startPage = Math.max(1, currentPage - Math.floor(paginationRange / 2));
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  const range = [...Array(endPage - startPage + 1)].map((_, i) => startPage + i);

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="w-100 p-3">
        <div className="container">
          {/* Navbar */}
          <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
            <div className="navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                {/* Ubah Link berikut */}
                <li className="nav-item">
                  <Link to="/order-key-parsing" className="nav-link">Order Key Parsing</Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Address, Area, Customer, Remarks"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="thead thead-dark">
              <tr>
                <th>ID</th>
                <th>Ship To Name</th>
                <th>Address</th>
                <th>Remarks</th>
                <th>Area</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((route) => (
                <tr key={route.id}>
                  <td>{route.id}</td>
                  <td>{route.shiptoname}</td>
                  <td>{truncateText(route.address, 30)}</td>
                  <td>{truncateText(route.remarks, 30)}</td>
                  <td>{route.area}</td>
                  <td>
                    {editData && editData.id === route.id ? (
                      <>
                        <button className="btn btn-success me-2" onClick={handleUpdateData}>
                          Update
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDeleteData(route.id)}>
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-primary me-2" onClick={() => handleEditData(route)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDeleteData(route.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Ship To Name"
            value={newData.shiptoname}
            onChange={(e) => setNewData({ ...newData, shiptoname: e.target.value })}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Address"
            value={newData.address}
            onChange={(e) => setNewData({ ...newData, address: e.target.value })}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Remarks"
            value={newData.remarks}
            onChange={(e) => setNewData({ ...newData, remarks: e.target.value })}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Area"
            value={newData.area}
            onChange={(e) => setNewData({ ...newData, area: e.target.value })}
          />
          {!editData ? (
            <button className="btn btn-primary" onClick={handleCreateNewData}>
              Add New
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleUpdateData}>
              Update
            </button>
          )}
        </div>
        <div className="pagination d-flex justify-content-center">
          {filteredData.length > rowsPerPage && (
            <ul className="pagination">
              {range.map((page) => (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(page)}>
                    {page}
                  </button>

                </li>
              ))}
            </ul>
          )}
          </div>
<div className="text-center mt-3">
  <p className="text-muted">
    &copy; {new Date().getFullYear()} Budi Ariyanto - E00904 - PT. Kawan Lama Sejahtera
  </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
