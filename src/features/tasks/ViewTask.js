import React, { useState, useEffect } from 'react';
import {
    useGetAllTasksQuery,
    useToggleTaskStatusMutation,
    useDeleteTaskMutation,
} from './taskApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import PulseLoader from 'react-spinners/PulseLoader';
import Cookies from 'js-cookie';
import useTitle from '../../hooks/useTitle';

const ViewTask = () => {
    useTitle('All Tasks')
    
    const userId = Cookies.get('userId');

    const { data: allTasks, isLoading, isError, error } = useGetAllTasksQuery(null, {
        pollingInterval: 500,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    const [userTasks, setUserTasks] = useState([]);

    useEffect(() => {
        if (allTasks) {
            // Sort tasks by createdAt timestamp in descending order
            const sortedTasks = allTasks.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            console.log(sortedTasks);
            setUserTasks(sortedTasks);
        }
    }, [allTasks]);

    const [toggleTaskStatus] = useToggleTaskStatusMutation();
    const [deleteTask] = useDeleteTaskMutation();

    const [currentStatus, setCurrentStatus] = useState({});

    useEffect(() => {
        if (allTasks) {
            // Create a map of task IDs to their current statuses
            const statusMap = {};
            allTasks.forEach((task) => {
                statusMap[task._id] = task.status;
            });
            setCurrentStatus(statusMap);
        }
    }, [allTasks]);

    const handleToggleStatus = async (taskId, currentStatus) => {
        console.log('Toggling status for taskId:', taskId);
        console.log('Current status:', currentStatus);

        try {
            let newStatus = '';

            // Determine the next status based on the current status
            switch (currentStatus) {
                case 'Todo':
                    newStatus = 'In Progress';
                    break;
                case 'In Progress':
                    newStatus = 'Completed';
                    break;
                case 'Completed':
                    newStatus = 'Todo';
                    break;
                default:
                    // Handle any unexpected statuses here
                    break;
            }

            // Call the toggleTaskStatus mutation function with the new status
            const response = await toggleTaskStatus({ taskId, newStatus });

            // If successful, the response contains the updated task data
            console.log('Task status toggled successfully:', response.data);
        } catch (error) {
            // Handle errors, e.g., network errors, validation errors, etc.
            console.error('Error toggling task status:', error);

            if (error.response && error.response.status === 400) {
                // Handle bad request error (e.g., display an error message)
                console.error('Bad Request:', error.response.data);
            }
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            // Call the deleteTask mutation with the taskId
            await deleteTask(taskId);

            // Update the local state to remove the deleted task
            const updatedTasks = userTasks.filter((task) => task._id !== taskId);
            setUserTasks(updatedTasks);

            console.log('Task deleted successfully');
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <main className="dash__main">
            <div className="view-task">
                <div className="task-list">
                    {isLoading && (
                        <div className="loading-container">
                            <PulseLoader color={"#405de6"} />
                        </div>
                    )}
                    {isError && (
                        <div className="error-message">
                            An error occurred: {error.message}
                        </div>
                    )}
                    {userTasks.map((task) => (
                        <div className={`task ${task.status}`} key={task._id}>
                            <div className="task-title">{task.title}</div>
                            <div className="task-description">{task.description}</div>
                            <div className="task-status">
                                {task.status === 'Todo' ? (
                                    <FontAwesomeIcon icon={faCircle} className="status-icon" />
                                ) : (
                                    <FontAwesomeIcon icon={faCheckCircle} className="status-icon" />
                                )}
                                {task.status}
                            </div>
                            {task.assigned_to._id === userId && (
                                <button
                                    className="toggle-status-button"
                                    onClick={() => handleToggleStatus(task._id, task.status[0])}
                                >
                                    Toggle Status
                                </button>
                            )}
                            <div className="task-details">
                                <p>Assigned to: {task.assigned_to.username}</p>
                                <p>Created by: {task.created_by.username}</p>
                                <p>Due Date: {new Date(task.due_date).toLocaleDateString()}</p>
                            </div>
                            {task.created_by._id === userId && (
                                <div className="button-container">
                                    <button
                                        className="delete-task-button"
                                        onClick={() => handleDeleteTask(task._id)}
                                    >
                                        Delete Task
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ViewTask;
