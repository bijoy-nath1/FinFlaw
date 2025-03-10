'use client'

// import { StyledString } from "next/dist/build/swc/types";
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { usePlaidLink } from 'react-plaid-link'
import {PlaidLinkOptions,PlaidLinkOnSuccess} from 'react-plaid-link'
import { createLinkToken, exchangePublicToken } from "./actions/auth";
import { Button } from "./ui/button";

export default function PlaidLink({ user, variant }: PlaidLinkProps) {
    const router = useRouter()

    const [token, setToken] = useState('');
    useEffect(() => {
        const getLinkToken = async () => {
               const data = await createLinkToken(user)
            setToken(data?.linkToken)
        }    
        getLinkToken()
    },[user])

    const onSuccess = useCallback <PlaidLinkOnSuccess>(async (public_token:string) => {
        await exchangePublicToken({
            publicToken: public_token,
            user
        })
        router.push('/')
    },[user])

    const config: PlaidLinkOptions = {
        token,
        onSuccess
    }


    const {open,ready}= usePlaidLink(config)
    useEffect(()=>{
    console.log('ready state:',ready)

    },[])
    return (
        <>

            {
                variant === 'primary' ? (
                    <Button className="plaidlink-primary"
                        onClick={() => {open()
                            console.log("clicked")}
                        }
                        disabled={!ready}
                    >
                        Connect Bank
                    </Button>
                ) : variant === 'ghost' ? (
                    <button>
                        Connect Bank
                    </button>
                ) : (
                    <button>
                        Connect bank
                    </button>
                )
            }
        </>
    )
}