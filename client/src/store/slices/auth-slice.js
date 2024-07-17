//zustand is a state management tool . States are email,passord confirm password 
export const createAuthSlice = (set) => (
    {
        userInfo: undefined,
        setUserInfo:(userInfo) => set({userInfo}),
    }
)