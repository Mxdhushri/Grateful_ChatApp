import { Avatar, AvatarImage } from "@/components/ui/avatar" //always components se import
import { toast } from "react-hot-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getColor } from "@/lib/utils"
import { useAppStore } from "@/store"
import { HOST, LOGOUT_ROUTE } from "@/utils/constants"
import { FiEdit2 } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import {IoPowerSharp} from "react-icons/io5"
import { apiClient } from "@/lib/api-client"

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore() //zustand 
  const navigate = useNavigate()
  const logOut = async () =>{
    try{
      const response= await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true}) //integration of frontend backend and credentila for cookie
      if(response.status===200){
        toast.success("Logout successful")
        navigate("/auth") //goes to first auth page after logout
        setUserInfo(null)
      }
    }catch(error){
    console.log(error)
    }
  }
  //now zustand for statemanagement , profile info uses USERINFO at leftbottom
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33] ">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {
              userInfo.image ? <AvatarImage src={`${HOST}/${userInfo.image}`} alt="profile" className="object-cover w-full h-full bg-black" /> :
                // color comes from database 
                <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                  {userInfo.firstName ? userInfo.firstName.split("").shift() : userInfo.email.split("").shift()}
                </div>
            }
          </Avatar>
        </div>
        <div>
        {
          userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
        }
        </div>
      </div>
      <div className="flex gap-5 ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2 className="text-purple-500 text-xl font-medium "
              //chote se rectangle box pe click kiya toh we wre naviagted to profile page
              onClick={() => navigate('/profile')}/>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp className="text-red-500 text-xl font-medium "
              //logout handle karna is difficult as we have to delete cookie
              onClick={logOut}/>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Log Out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      </div>
    </div>
  )
}

export default ProfileInfo