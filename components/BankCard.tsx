import { formatAmount } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Image from "next/image";

function BankCard({ account, userName, showBalance = true }: CreditCardProps) {
  return (
    <div className="flex flex-col">
      <Link href="/" className="bank-card">
        <div className="bank-card_content">
          <div>
            <h1 className="text-16 font-semibold text-white">
              {account.name || userName}
            </h1>
            <p className="font-ibm-plex-serif font-black text-white">
              {formatAmount(account.currentBalance)}
            </p>
          </div>
          <article className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-12 font-semibold text-white">{userName}</h1>
              <h2 className="text-12 font-semibold text-white">••/••</h2>
            </div>
            <p className="text-12 font-semibold tracking-[1.1px] text-white">
              •••• •••• •••• ••••<span className="text-16">1662</span>
            </p>
          </article>
        </div>
        <div className="bank-card_icon">
          <Image
            src="/icons/Paypass.svg"
            alt="pay"
            loading="lazy"
            width={30}
            height={30}
          />
          <Image
            src="/icons/mastercard.svg"
            alt="pay"
            loading="lazy"
            width={30}
            height={30}
          />
          <Image
            src="/icons/lines.svg"
            alt="pay"
            loading="lazy"
            width={316}
            height={190}
            className="absolute top-0 right-0 rounded-xl"
          />
        </div>
      </Link>
    </div>
  );
}

export default BankCard;
