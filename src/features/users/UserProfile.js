import React from 'react';
import User from './User';
import { useGetUsersQuery } from "./userApiSlice";
import PulseLoader from 'react-spinners/PulseLoader'

const UserProfile = () => {
    const {
        data: userProfile,
        isLoading: isProfileLoading,
        isError: isProfileError,
        error: profileError
    } = useGetUsersQuery(null, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let content;

    if (isProfileLoading) {
        content = <PulseLoader color={"#405de6"} />;
    } else if (isProfileError) {
        content = <p className="errmsg">{profileError?.data?.message}</p>;
    } else if (userProfile) {
        const { entities } = userProfile;
        const userId = userProfile.ids[0];
        const user = entities[userId];

        if (user) {
            content = (
                <User
                    user={user}
                />
            );
        }
    }

    return content;
}

export default UserProfile;
