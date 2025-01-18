import React from 'react'
import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
function Home() {
  const loggedIn = {
    firstName:"Adrain"
  }
  return (
    <section className="home">
      <div className='home-content'>
        <header className='home-header'>
            <HeaderBox
            type ="greeting"
            title="welcome"
            user={loggedIn?.firstName|| 'guest'}
            subtext="Access and manage your account and transactions efficiently"
            />
            <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250.34}
            />
        </header>
      </div>
    </section>
  )
}

export default Home