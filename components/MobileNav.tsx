"use client";

import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";

function MobileNav({ user }: MobileNavProps) {
  const pathname = usePathname();
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src={"/icons/hamburger.svg"}
            width={30}
            height={30}
            alt="menu icon"
            className="cursor-pointer"
          ></Image>
        </SheetTrigger>

        <SheetContent side="left" className="bg-white border-none">
          <SheetTitle>
            <Link
              href="/"
              className="mb-12 cursor-pointer items-center gap-2 flex"
            >
              <Image
                src="/icons/logo.svg"
                width={30}
                height={30}
                alt="not found"
                className="mt-2 ml-3"
              />
              <h1 className="text-black text-26 font-ibm-plex-serif font-bold ">
                Horizon
              </h1>
            </Link>
          </SheetTitle>
          <nav className="flex flex-col gap-4">
            <div className="mobilenav-sheet">
              <SheetClose asChild>
                <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                  {sidebarLinks.map((item) => {
                    const isActive =
                      pathname === item.route ||
                      pathname.startsWith(item.route + "/");
                    return (
                      <SheetClose asChild key={item.label}>
                        <Link
                          href={item.route}
                          key={item.label}
                          className={cn("mobilenav-sheet_close w-full", {
                            "bg-bank-gradient": isActive,
                          })}
                        >
                          <div className=" relative size-6">
                            <Image
                              src={item.imgURL}
                              alt={item.label}
                              width={20}
                              height={20}
                              className={cn("sidebar-icon", {
                                "brightness-[3] invert-0": isActive,
                              })}
                            />
                          </div>
                          <p
                            className={cn(
                              "text-16 font-semibold text-black-2 ",
                              {
                                "text-white": isActive,
                              }
                            )}
                          >
                            {item.label}
                          </p>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </SheetClose>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </section>
  );
}

export default MobileNav;
