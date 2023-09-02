import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const tasksAdapter = createEntityAdapter({});

const initialState = tasksAdapter.getInitialState();

export const taskApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createTask: builder.mutation({
            query: (taskData) => ({
                url: "/task/create", // Updated endpoint
                method: "POST",
                body: taskData,
            }),
            transformResponse: (responseData) => responseData,
            invalidatesTags: [{ type: "Task", id: "LIST" }],
        }),
        getTask: builder.query({
            query: (taskId) => `/task/${taskId}`, // Updated endpoint
        }),
        getAllTasks: builder.query({
            query: () => "/task/all", // Updated endpoint
            transformResponse: (responseData) => responseData,
        }),
        updateTask: builder.mutation({
            query: ({ taskId, taskData }) => ({
                url: `/task/${taskId}`, // Updated endpoint
                method: "PUT",
                body: taskData,
            }),
            transformResponse: (responseData) => responseData,
            invalidatesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }],
        }),
        deleteTask: builder.mutation({
            query: (taskId) => ({
                url: `/task/${taskId}`, // Updated endpoint
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }],
        }),
        toggleTaskStatus: builder.mutation({
            query: ({ taskId, newStatus }) => ({
                url: `/task/${taskId}/toggle-status`, // Adjust the endpoint as needed
                method: "PUT", // Assuming you use a PUT request to update the status
                body: { status: newStatus }, // Send the new status as the request body
            }),
            // You can include a transformResponse function if needed
            // invalidatesTags can be used to specify which data tags should be invalidated after the mutation
            // This depends on how your cache is structured
        }),
    }),
});

export const {
    useCreateTaskMutation,
    useGetTaskQuery,
    useGetAllTasksQuery,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useToggleTaskStatusMutation,
} = taskApiSlice;

// Selectors
export const selectTasksResult = taskApiSlice.endpoints.getAllTasks.select();

const selectTasksData = createSelector(
    selectTasksResult,
    (tasksResult) => tasksResult?.data
);

export const {
    selectAll: selectAllTasks,
    selectById: selectTaskById,
} = tasksAdapter.getSelectors((state) => selectTasksData(state) ?? initialState);
