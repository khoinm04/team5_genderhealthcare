import React from "react";

export default function SocialLoginButtons() {
  return (
    <>
      <span className="text-[#964F66] text-sm text-center my-1 mx-4">
        Or continue with
      </span>
      <div className="flex items-center self-stretch py-[7px] px-3 gap-3 mx-4">
        <button
          className="flex flex-col shrink-0 items-start bg-[#F2E8EA] text-left py-[5px] px-4 rounded-xl border-0"
          onClick={() => alert("Apple login pressed!")}
        >
          <span className="text-[#1C0C11] text-sm font-bold">Apple</span>
        </button>
        <button
          className="flex flex-col shrink-0 items-start bg-[#F2E8EA] text-left py-[5px] px-4 rounded-xl border-0"
          onClick={() => alert("Google login pressed!")}
        >
          <span className="text-[#1C0C11] text-sm font-bold w-[40px]">Google</span>
        </button>
        <button
          className="flex flex-col shrink-0 items-start bg-[#F2E8EA] text-left py-[5px] px-4 rounded-xl border-0"
          onClick={() => alert("Facebook login pressed!")}
        >
          <span className="text-[#1C0C11] text-sm font-bold w-[60px]">Facebook</span>
        </button>
      </div>
    </>
  );
}
