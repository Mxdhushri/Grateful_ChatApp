import { apiClient } from '@/lib/api-client';
import OtpInput from "react-otp-input";
import { VERIFY_OTP_ROUTE } from '@/utils/constants';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const handleVerifyOTP = async (event) => {
    try {
      event.preventDefault();
      const response = await apiClient.post(VERIFY_OTP_ROUTE, { email, otp });
      if (response.status === 200) {
        toast.success("OTP Verified successfully");
        navigate("/auth");
      }
    } catch (error) {
      alert('Invalid or expired OTP');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-purple-700">
      <div className="max-w-[500px] p-4 lg:p-8 flex flex-col items-center justify-center">
        <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem] text-white">
          Verify Email
        </h1>
        <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100 text-center text-white">
          A verification code has been sent to you. Enter the code below
        </p>
        <form onSubmit={handleVerifyOTP} className="w-full flex flex-col items-center">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => (
              <input
                {...props}
                placeholder="-"
                style={{
                  boxShadow: "0 0 5px rgba(255, 255, 255, 0.3)",
                }}
                className="w-[48px] lg:w-[60px] h-[60px] lg:h-[60px] border bg-richblack-800 rounded-[0.5rem] text-richblack-5 text-center focus:outline-2 focus:outline-purple-50"
              />
            )}
            containerStyle={{
              justifyContent: "space-between",
              gap: "6px",
              margin: "20px 0",
            }}
          />
          <button
            className="w-full bg-purple-300 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;