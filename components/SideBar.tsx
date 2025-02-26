"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import LogOut from "@/components/LogOut";

function SideBar({ user }: SidebarProps) {
  const pathname = usePathname();
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 cursor-pointer items-center gap-2 flex">
          <Image
            src="/icons/logo.svg"
            width={30}
            height={30}
            alt="not found"
            className="mt-2 ml-3"
          />
          <h1 className="sidebar-logo">FinFlaw</h1>
        </Link>
        {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname.startsWith(item.route + "/");
          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn("sidebar-link", { "bg-black-1": isActive })}
            >
              <div className=" relative size-6">
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  className={cn("sidebar-icon", {
                    "brightness-[3] invert-0": isActive,
                  })}
                />
              </div>
              <p className={cn("sidebar-label", { "!text-white": isActive })}>
                {item.label}
              </p>
            </Link>
          );
        })}
      </nav>
      <div>
        <LogOut user={user} type="mobile" />
      </div>
    </section>
  );
}

export default SideBar;
