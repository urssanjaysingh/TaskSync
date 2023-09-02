import React, { useState, useEffect } from "react";
import { useCreateTaskMutation } from "./taskApiSlice";
import PulseLoader from 'react-spinners/PulseLoader';
import { useNavigate } from "react-router-dom";
import { useGetAllUsersQuery } from '../users/userApiSlice';
import Cookies from 'js-cookie';
import useTitle from "../../hooks/useTitle";

// Define the enum options for the status field
const statusOptions = ['Todo', 'In Progress', 'Completed'];

const CreateTaskPage = () => {
    useTitle('Create Task')
    
    const userId = Cookies.get('userId');

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedTo, setAssignedTo] = useState(""); // Store user's ID, not username
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState([]);
    const [createTask, { isLoading }] = useCreateTaskMutation();
    const [localSuccessMessage, setLocalSuccessMessage] = useState("");

    const navigate = useNavigate();

    // Fetch all users using the useGetAllUsersQuery
    const { data: users = [] } = useGetAllUsersQuery();

    useEffect(() => {
        // Set the default assignedTo value to the first user in the list (if available)
        if (users.length > 0 && !assignedTo) {
            setAssignedTo(users[0].id);
        }
    }, [users, assignedTo]);

    const handleCreateTask = () => {
        if (title.trim() === "") {
            return; // Don't create a task with an empty title
        }

        createTask({
            title,
            description,
            assigned_to: assignedTo,
            due_date: dueDate,
            status,
        })
            .unwrap()
            .then((response) => {
                setLocalSuccessMessage("Task created successfully!");

                // Clear the success message after a delay (e.g., 3 seconds)
                setTimeout(() => {
                    setLocalSuccessMessage("");

                    // Clear the form fields
                    setTitle("");
                    setDescription("");
                    setAssignedTo("");
                    setDueDate("");
                    setStatus("");

                    // Navigate after another delay (e.g., 2 seconds)
                    setTimeout(() => {
                        navigate("/dash/task/all");
                    }, 1000); // Adjust the delay time as needed
                }, 1000);
            })
            .catch((error) => {
                console.error("Error:", error);
                // Handle error
            });
    };

    return (
        <main className="dash__main">
            <div className="create-task-form" style={{ width: "400px" }}>
                <div className="form-container">
                    <h1 className="text-center" style={{ color: "black" }}>Create Task</h1>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Task Title"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Task Description"
                            rows={2}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <select
                            className="form-control"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            required
                        >
                            <option key="" value="">Select a User</option>
                            {users
                                .filter((user) => user._id !== userId) // Exclude the current user
                                .map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.username}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <input
                            type="date"
                            className="form-control"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <div style={{ color: "#262626" }}>
                            {statusOptions.map((option) => (
                                <label key={option} className="mr-2">
                                    <input
                                        type="checkbox"
                                        value={option}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            if (checked) {
                                                setStatus([...status, option]);
                                            } else {
                                                setStatus(status.filter((item) => item !== option));
                                            }
                                        }}
                                        style={{
                                            borderRadius: "3px", // Rounded corners
                                            border: "1px solid #ccc", // Border color
                                            marginRight: "5px", // Adjust spacing between checkbox and text
                                            cursor: "pointer", // Show pointer cursor on hover
                                        }}
                                    />
                                    {option}
                                    <span className="space"></span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {localSuccessMessage && (
                        <p style={{ color: "green", fontWeight: "bold" }} className="text-center">
                            {localSuccessMessage}
                        </p>
                    )}
                    <div className="button-container">
                        {isLoading ? (
                            <PulseLoader color={"#405de6"} /> 
                        ) : (
                        <div>
                            <button className="btn btn-primary" onClick={handleCreateTask} disabled={isLoading}>
                                Create Task
                            </button>
                            <span className="space"></span>
                            <button className="btn btn-secondary ml-2" onClick={() => {
                                // Clear the form fields when the "Clear" button is clicked
                                setTitle("");
                                setDescription("");
                                setAssignedTo("");
                                setDueDate("");
                                setStatus("");
                            }}>
                                Clear
                            </button>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CreateTaskPage;
