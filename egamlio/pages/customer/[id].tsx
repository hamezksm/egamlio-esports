// pages/customer/[id].tsx

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import withAuth from "@/middleware/withAuth";

interface CustomerDetails {
  first_name: string;
  other_names: string;
  gender: string;
  mobile: string;
  email: string;
}

const CustomerProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchCustomerDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `https://stemprotocol.codefremics.com/api/v2/customers/get-customer-details/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 200) {
          setCustomer(response.data.response);
        } else {
          setErrorMessage(response.data.description);
        }
      } catch (error) {
        setErrorMessage("An error occurred while fetching customer details");
        console.error("Fetch customer details error:", error);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  if (!customer) {
    return (
      <>
        <Head>
          <title>Loading...</title>
        </Head>
        <div>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`${customer.first_name} ${customer.other_names} - Profile`}</title>
      </Head>
      <section className="customer-profile">
        <div className="overlay pb-120">
          <div className="container">
            <div className="top-area pt-4 mb-30">
              <div className="row d-flex align-items-center">
                <div className="col-sm-5 col">
                  <Link className="back-home" href="/customers">
                    <img src="/images/icon/left-icon.png" alt="image" />
                    Back To Customers
                  </Link>
                </div>
                <div className="col-sm-2 text-center col">
                  <img src="/images/logo.png" alt="image" />
                </div>
              </div>
            </div>
            <div className="row pt-120 d-flex justify-content-center">
              <div className="col-lg-6">
                <div className="profile-main">
                  <div className="section-text">
                    <h4>Customer Profile</h4>
                  </div>
                  <div className="profile-details">
                    {errorMessage && <div className="error">{errorMessage}</div>}
                    <p><strong>First Name:</strong> {customer.first_name}</p>
                    <p><strong>Other Names:</strong> {customer.other_names}</p>
                    <p><strong>Gender:</strong> {customer.gender}</p>
                    <p><strong>Mobile Number:</strong> {customer.mobile}</p>
                    <p><strong>Email Address:</strong> {customer.email}</p>
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

export default withAuth(CustomerProfile);