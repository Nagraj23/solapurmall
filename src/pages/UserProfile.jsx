// // imports
// import React, { useEffect, useState, useContext } from "react";
// import { AuthContext } from '../components/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { MdAccountCircle, MdEdit, MdStore, MdWork, MdCheck } from 'react-icons/md';
// import { FaSpinner } from 'react-icons/fa';
// import axios from 'axios';
// import api from '../utils/api';

// import libs (same as yours)
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdAccountCircle, MdEdit, MdStore, MdWork, MdCheck, MdModeEdit } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import api from '../utils/api';

const UserProfile = () => {
  const { authToken, isAuthenticated, logout, user: authContextUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userFirms, setUserFirms] = useState([]);
  const [userJobs, setUserJobs] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchAll = async () => {
      try {
        const response = await axios.get(`${api}/api/users/profile/${authContextUser?.id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserData(response.data);

        setUpdatedUserData(response.data);
        console.log(updatedUserData,"uer bro ")

        const firmRes = await axios.get(`${api}/api/firms`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const filteredFirms = firmRes.data.filter(
          (firm) => firm.user.id === updatedUserData.id
        );
        setUserFirms(filteredFirms);
        console.log(firmRes)
        console.log(userFirms,"user firms bro ")

      } catch (err) {
        console.error("Error fetching user data or firms:", err);
        setError("Failed to fetch data. Please try again.");
        if (err.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [authToken, isAuthenticated, authContextUser, logout, navigate]);

  const handleSave = async () => {
    setError("");
    setSuccessMsg("");
    try {
      const response = await axios.put(
        `${api}/api/users/update/${userData.id}`,
        updatedUserData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setUserData(response.data);
      setEditMode(false);
      setSuccessMsg("✅ Profile updated successfully.");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("❌ Update failed. Please try again.");
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData((u) => ({ ...u, [name]: value }));
  };

  const handleEditFirm = (firmId) => {
    navigate(`/edit-firm/${firmId}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error && !successMsg) return <div className="p-8 text-center text-red-600 font-semibold text-lg">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MdAccountCircle className="w-7 h-7" />
            Profile
          </h1>
          <button
            onClick={() => {
              setEditMode(!editMode);
              setSuccessMsg("");
              setError("");
              if (editMode) setUpdatedUserData(userData);
            }}
            className="flex items-center gap-2 bg-white text-blue-600 font-semibold px-4 py-2 rounded-md hover:bg-blue-100 transition"
          >
            <MdEdit className="w-5 h-5" />
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        {successMsg && <div className="bg-green-100 text-green-800 p-4 text-center">{successMsg}</div>}
        {error && <div className="bg-red-100 text-red-800 p-4 text-center">{error}</div>}

        <div className="flex border-b border-gray-200 bg-gray-50 text-gray-600">
          <Tab label="Personal Info" icon={<MdAccountCircle />} active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <Tab label="Firms" icon={<MdStore />} active={activeTab === "firms"} onClick={() => setActiveTab("firms")} />
          <Tab label="Jobs" icon={<MdWork />} active={activeTab === "jobs"} onClick={() => setActiveTab("jobs")} />
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <ProfileForm data={updatedUserData} editMode={editMode} onChange={onChange} />
          )}

          {activeTab === "firms" && (
            <ListPanel title="Your Firms" items={userFirms} fields={["firmName", "city", "isActive"]} emptyMessage="No firms found." onEdit={handleEditFirm} />
          )}

          {activeTab === "jobs" && (
            <ListPanel title="Your Jobs" items={userJobs} fields={["jobTitle", "location", "status"]} emptyMessage="No jobs posted." />
          )}

          {editMode && (
            <div className="mt-6 flex justify-end">
              <button onClick={handleSave} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2">
                <MdCheck className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Tab = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-5 py-3 text-md font-medium -mb-px border-b-2 ${
      active ? "border-blue-600 text-blue-700 bg-white" : "border-transparent hover:text-blue-700"
    }`}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </button>
);

const ProfileForm = ({ data, editMode, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {["firstName", "lastName", "email", "mobileNumber", "division", "userRole"].map((field) => (
      <Field
        key={field}
        name={field}
        label={field.replace(/([A-Z])/g, " $1").trim()}
        value={data[field]}
        editable={editMode && field !== "email" && field !== "userRole"}
        onChange={onChange}
      />
    ))}
  </div>
);

const Field = ({ name, label, value, editable, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-gray-700 font-medium mb-1">
      {label}
    </label>
    {editable ? (
      <input
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
        type={name === "email" ? "email" : "text"}
      />
    ) : (
      <div className="px-4 py-2 bg-gray-100 rounded-md">{value || "N/A"}</div>
    )}
  </div>
);

const ListPanel = ({ title, items, fields, emptyMessage, onEdit }) => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4 flex items-center justify-between">
      <span>{title}</span>
    </h3>
    {items.length === 0 ? (
      <div className="bg-gray-50 text-gray-600 italic text-center p-6 rounded-lg border">{emptyMessage}</div>
    ) : (
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              {fields.map((f) => (
                <th key={f} className="px-6 py-3 font-semibold">{f}</th>
              ))}
              {onEdit && <th className="px-6 py-3 font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx} className="border-t">
                {fields.map((f) => (
                  <td key={f} className="px-6 py-4">
                    {f === "isActive" || f === "status" ? (
                      it[f] ? <span className="text-green-600 font-medium">Active</span> : <span className="text-red-600 font-medium">Inactive</span>
                    ) : (
                      it[f] || "N/A"
                    )}
                  </td>
                ))}
                {onEdit && (
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onEdit(it._id)}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <MdModeEdit className="inline" /> Edit
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-white">
    <FaSpinner className="animate-spin text-blue-600 text-4xl" />
  </div>
);

export default UserProfile;
