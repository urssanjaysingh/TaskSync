import {
    createSelector,
    createEntityAdapter,
} from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({})

const initialState = usersAdapter.getInitialState()

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/user/profile',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                // Directly use the responseData object to create the user
                const user = {
                    id: responseData.id, // Use the id field from the response
                    ...responseData
                };

                // Use usersAdapter.setOne to add or update the user in the Redux store
                return usersAdapter.setOne(initialState, user);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
        updateUser: builder.mutation({
            query: ({ userId, userData }) => {
                return {
                    url: `/user/update`,
                    method: 'PUT',
                    body: userData,
                };
            },
            transformResponse: (responseData) => {

                // Transform the responseData as needed from your server response
                const transformedData = {
                    id: responseData.id, // Use the appropriate field from the response
                    ...responseData
                };

                return transformedData;
            },
            invalidatesTags: (result, error, { userId }) => {
                return [{ type: 'User', id: userId }];
            },
        }),
        getAllUsers: builder.query({
            query: () => '/user/all', // Adjust the endpoint URL as needed
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError;
            },
            transformResponse: (responseData) => {
                return responseData; // Assuming the response data is an array of users
            },
            providesTags: ['User'],
        }),
    }),
})

export const {
    useGetUsersQuery,
    useUpdateUserMutation,
    useGetAllUsersQuery,
} = userApiSlice

// returns the query result object
export const selectUsersResult = userApiSlice.endpoints.getUsers.select()

// creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult?.data // Use optional chaining
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)
