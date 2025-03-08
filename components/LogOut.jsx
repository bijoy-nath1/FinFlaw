import React from "react";

function LogOut({ user, type = "desktop" }) {
  return (
    <div className="footer">
      <div className="px-10 rounded-full border-2 border-black">
        <p className="text-yellow-400">{user.firstName[0]}</p>
      </div>
      <div
        className={type === "mobile" ? "footer_email-mobile" : "footer_email"}
      >
        <h1 className="text-14 truncate font-normal text-gray-600">
          {user.firstName}
        </h1>
        <h1 className="text-14 truncate font-normal text-gray-600">
          {user.email}
        </h1>
      </div>
    </div>
  );
}

export default LogOut;
