"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import BankCard from "@/components/BankCard";
import { logOutUser } from "@/components/actions/auth";
import { useRouter } from "next/navigation";

function RightSidebar({
  user,
  transactions = [],
  banks = [],
}: RightSidebarProps) {

  //logout functionalities
  const router = useRouter();
  async function handleClick() {
    const response = await logOutUser();

    alert(response);
    if (response) {
      localStorage.clear();
      sessionStorage.clear();
      router.push("/sign-in");
    }
  }

  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          <div
            className="profile-img"
            aria-label={`${user?.name || "User"}'s Profile Picture`}
          >
            <span className="text-5xl font-bold text-blue-500">
              {user?.name?.charAt(0).toUpperCase() || "N"}
            </span>
          </div>
          <div className="profile-details">
            <h1 className="profile-name">{user?.name || "Your name"}</h1>
            <p className="profile-email">{user?.email || "No Email"}</p>
          </div>
          {/*logout*/}
          <div>
            <button
              className="text-white px-4 py-1 rounded-full my-3 bg-gray-700 hover:bg-gray-400 "
              onClick={handleClick}
            >
              Log out
            </button>
          </div>
        </div>
      </section>
      <section className="banks">
        <div className="flex w-full justify-between">
          <h2 className="header-2">My Banks</h2>
          <Link
            href="/"
            className="flex gap-2"
            aria-label="Add a new bank account"
          >
            <Image
              src="/icons/plus.svg"
              width={20}
              height={20}
              alt="Add a new bank"
              loading="lazy"
            />
            <h2 className="text-14 font-semibold">Add Bank</h2>
          </Link>
        </div>
        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className="relative z-10">
              <BankCard
                key={banks[0].$id}
                account={banks[0]}
                userName={user?.name}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute top-10  left-3  z-0 w-[90%]">
                <BankCard
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={user?.name}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </aside>
  );
}

export default RightSidebar;
