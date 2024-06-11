// pages/index.tsx

import Head from "next/head";
import Link from "next/link";
import withAuth from "@/middleware/withAuth";
import router from "next/router";
import { useState, useEffect } from "react";

interface User {
  firstName : string,
  lastName : string,
}


const HomePage = () => {
  const [user, setUser] = useState<User>({ firstName: "", lastName: "" });

  useEffect(() => {
    // Retrieve firstName and lastName from localStorage
    const storedFirstName = localStorage.getItem("firstName") || "";
    const storedLastName = localStorage.getItem("lastName") || "";

    // Update the user state with the retrieved values
    setUser({ firstName: storedFirstName, lastName: storedLastName });
  }, []);

  // Implement logout functionality here
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.replace("/login");
  };
  return (
    <>
      <Head>
        <title>Home - Egamlio</title>
      </Head>
      <section className="login-reg">
        <div className="overlay pb-120">
          <div className="container">
            <div className="top-area pt-4 mb-30 w-100">
              <div className="row d-flex align-items-center ">
                <div className="col-sm-5 col">
                  <div className="user-info">
                    <h5>Welcome, {user.firstName} {user.lastName}</h5>
                  </div>
                </div>
                <div className="col-sm-5 col d-flex justify-content-end">
                  <button className="cmn-btn" onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </div>
            <div className="row pt-120 d-flex justify-content-center">
              <div className="col-lg-6">
                <div className="login-reg-main text-center">
                  <div className="form-area">
                    <div className="section-text">
                      <h4>Welcome to Egamlio</h4>
                    </div>
                    <div className="button-group">
                      <Link href="/create-customer">
                        <button className="cmn-btn mt-40 w-100">Create Customer</button>
                      </Link>
                      <Link href="/customers">
                        <button className="cmn-btn mt-40 w-100">View Customers</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default withAuth(HomePage);